import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools, getToolById, getSimilarTools, specKeys } from "@/lib/ai-data";
import { ToolDetailContent } from "./tool-detail-content";

/**
 * Tool Detail Page — /tools/[slug]
 * SEO target: "[tool name] pricing", "[tool name] features", "[tool name] review"
 */

// Pre-generate all 80 tool pages at build time
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.id }));
}

// Dynamic SEO metadata per tool
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const tool = getToolById(slug);
    if (!tool) return { title: "Tool not found" };

    const title = `${tool.name} — Pricing, Features & Review (2026) | My AI Picker`;
    const description = `${tool.tagline} See full ${tool.name} pricing tiers, capabilities, pros & cons, and alternatives. Compare ${tool.name} with 80+ AI tools on My AI Picker.`;

    return {
      title,
      description,
      keywords: [
        tool.name,
        `${tool.name} pricing`,
        `${tool.name} features`,
        `${tool.name} review`,
        `${tool.name} alternatives`,
        `${tool.name} vs`,
        tool.vendor,
        ...tool.tags,
      ],
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://myaipicker.com/tools/${tool.id}`,
      },
      alternates: {
        canonical: `https://myaipicker.com/tools/${tool.id}`,
      },
    };
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) notFound();

  const similar = getSimilarTools(tool, 4);

  return <ToolDetailContent tool={tool} similar={similar} specKeys={specKeys} />;
}
