#!/usr/bin/env node

/**
 * update-models.js — Fetches latest LLM pricing from OpenRouter API
 * and updates data/models.json with accurate per-token pricing + context lengths.
 *
 * Usage:
 *   node scripts/update-models.js          (normal run)
 *   node scripts/update-models.js --dry    (dry run, no file write)
 *
 * Non-LLM tools (Midjourney, Runway, ElevenLabs, etc.) are NOT touched.
 * Only tools with `auto_update: true` in models.json are updated.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_FILE = path.join(__dirname, "..", "data", "models.json");
const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";
const DRY_RUN = process.argv.includes("--dry");

// ─── Helpers ──────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[update-models] ${msg}`);
}

function formatPrice(perToken) {
  // OpenRouter returns price per token as a string (e.g. "0.000005")
  // Convert to per-million-tokens for readability
  const num = parseFloat(perToken);
  if (isNaN(num) || num === 0) return 0;
  return Math.round(num * 1_000_000 * 100) / 100; // round to 2 decimals
}

function formatContext(tokens) {
  if (!tokens || tokens <= 0) return null;
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
  return String(tokens);
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  log("Starting OpenRouter sync...");
  log(`Mode: ${DRY_RUN ? "DRY RUN (no changes written)" : "LIVE"}`);

  // 1. Load current models.json
  const rawData = fs.readFileSync(MODELS_FILE, "utf-8");
  const modelsData = JSON.parse(rawData);
  log(`Loaded ${Object.keys(modelsData.tools).length} auto-updatable tools from models.json`);

  // 2. Fetch from OpenRouter
  log(`Fetching models from ${OPENROUTER_URL}...`);
  const response = await fetch(OPENROUTER_URL, {
    headers: { "Accept": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API returned ${response.status}: ${response.statusText}`);
  }

  const apiData = await response.json();
  const apiModels = apiData.data || [];
  log(`Fetched ${apiModels.length} models from OpenRouter`);

  // Build a lookup map: openrouter_id → model data
  const apiLookup = {};
  for (const m of apiModels) {
    apiLookup[m.id] = m;
  }

  // 3. Diff and update
  let addedCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  let newModelsFound = [];
  const now = new Date().toISOString();

  for (const [toolId, toolEntry] of Object.entries(modelsData.tools)) {
    if (!toolEntry.auto_update) {
      log(`  ⏭️  ${toolId}: skipped (auto_update=false)`);
      continue;
    }

    const matchedModels = [];
    let cheapestPrompt = Infinity;
    let cheapestCompletion = Infinity;
    let maxContext = 0;

    for (const orId of toolEntry.openrouter_ids) {
      const apiModel = apiLookup[orId];
      if (!apiModel) {
        log(`  ⚠️  ${toolId}: OpenRouter ID "${orId}" not found in API (may be deprecated)`);
        continue;
      }

      const promptPrice = formatPrice(apiModel.pricing?.prompt || "0");
      const completionPrice = formatPrice(apiModel.pricing?.completion || "0");
      const context = apiModel.context_length || 0;

      matchedModels.push({
        id: apiModel.id,
        name: apiModel.name || orId,
        context: formatContext(context) || "—",
        context_tokens: context,
        prompt_per_million: promptPrice,
        completion_per_million: completionPrice,
      });

      if (promptPrice > 0 && promptPrice < cheapestPrompt) cheapestPrompt = promptPrice;
      if (completionPrice > 0 && completionPrice < cheapestCompletion) cheapestCompletion = completionPrice;
      if (context > maxContext) maxContext = context;
    }

    if (matchedModels.length === 0) {
      log(`  ❌ ${toolId}: no matching OpenRouter models found`);
      continue;
    }

    // Check if anything changed
    const newApiPricing = {
      prompt_per_million: cheapestPrompt === Infinity ? null : cheapestPrompt,
      completion_per_million: cheapestCompletion === Infinity ? null : cheapestCompletion,
    };
    const newContext = formatContext(maxContext);

    const pricingChanged =
      JSON.stringify(newApiPricing) !== JSON.stringify(toolEntry.api_pricing);
    const contextChanged = newContext !== toolEntry.context_length;
    const modelsChanged =
      JSON.stringify(matchedModels) !== JSON.stringify(toolEntry.openrouter_models);

    if (pricingChanged || contextChanged || modelsChanged) {
      const wasNeedsReview = toolEntry.needs_review;
      toolEntry.api_pricing = newApiPricing;
      toolEntry.context_length = newContext;
      toolEntry.openrouter_models = matchedModels;
      toolEntry.last_updated = now;
      // Only flag needs_review if pricing actually changed (not just model list)
      toolEntry.needs_review = pricingChanged || contextChanged ? true : wasNeedsReview;

      log(`  ✏️  ${toolId}: updated (pricing: $${newApiPricing.prompt_per_million}/M prompt, $${newApiPricing.completion_per_million}/M completion, context: ${newContext})`);
      updatedCount++;
    } else {
      log(`  ✅ ${toolId}: unchanged`);
      unchangedCount++;
    }
  }

  // 4. Check for NEW OpenRouter models we don't track yet
  const trackedIds = new Set();
  for (const tool of Object.values(modelsData.tools)) {
    for (const id of tool.openrouter_ids) trackedIds.add(id);
  }

  // Look for notable new models from major providers
  const notableProviders = ["openai/", "anthropic/", "google/", "meta-llama/", "mistralai/", "x-ai/", "deepseek/"];
  for (const m of apiModels) {
    if (trackedIds.has(m.id)) continue;
    if (!notableProviders.some((p) => m.id.startsWith(p))) continue;
    // Only flag if it's a new model (not a variant we might have missed)
    newModelsFound.push({ id: m.id, name: m.name || m.id });
  }

  if (newModelsFound.length > 0) {
    log(`\n🆕 ${newModelsFound.length} new models found on OpenRouter not tracked yet:`);
    for (const m of newModelsFound.slice(0, 20)) {
      log(`   - ${m.id} (${m.name})`);
    }
    if (newModelsFound.length > 20) log(`   ... and ${newModelsFound.length - 20} more`);
  }

  // 5. Update meta
  modelsData._meta.last_sync = now;

  // 6. Write or dry-run
  if (DRY_RUN) {
    log("\n--- DRY RUN: no changes written ---");
    log(`Would have updated: ${updatedCount} tools`);
    log(`Unchanged: ${unchangedCount} tools`);
    log(`New models found: ${newModelsFound.length}`);
  } else {
    const output = JSON.stringify(modelsData, null, 2) + "\n";
    fs.writeFileSync(MODELS_FILE, output, "utf-8");
    log(`\n✅ Written to ${MODELS_FILE}`);
    log(`Updated: ${updatedCount} | Unchanged: ${unchangedCount} | New models found: ${newModelsFound.length}`);

    if (updatedCount > 0) {
      log("\n📝 These tools have needs_review=true — verify descriptions/tags manually.");
      // Output summary for GitHub Actions (new environment file syntax)
      const fs2 = await import("fs");
      const ghOutput = process.env.GITHUB_OUTPUT;
      if (ghOutput) {
        fs2.appendFileSync(ghOutput, `changes=${updatedCount}\n`);
        fs2.appendFileSync(ghOutput, `has_changes=true\n`);
      }
    } else {
      const fs2 = await import("fs");
      const ghOutput = process.env.GITHUB_OUTPUT;
      if (ghOutput) {
        fs2.appendFileSync(ghOutput, `has_changes=false\n`);
      }
    }
  }
}

main().catch((err) => {
  console.error("[update-models] FATAL:", err);
  process.exit(1);
});
