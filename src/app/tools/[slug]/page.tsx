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

// Common misspellings / variants for popular tools (helps capture typo traffic)
const SPELLING_VARIANTS: Record<string, string[]> = {
  quillbot: ["quill bot", "quiblot", "quiltbot", "qillbot", "quillbot paraphraser", "quill bot paraphraser"],
  chatgpt: ["chat gpt", "gpt chat", "openai chat", "gpt-4", "gpt4"],
  claude: ["claude ai", "anthropic claude", "claude anthropic"],
  midjourney: ["mid journey", "mid-journey", "midjourney ai"],
  "stable-diffusion": ["stable diffusion", "stable-diffusion ai", "sd ai"],
  "github-copilot": ["github copilot", "copilot github", "copilot ai"],
  "dalle3": ["dall e", "dall-e", "dalle", "dalle 3", "dall e 3", "dall-e-3"],
  "elevenlabs": ["eleven labs", "11 labs", "elevenlabs voice"],
  "notion-ai": ["notion ai", "notion artificial intelligence"],
  perplexity: ["perplexity ai", "perplexity search"],
};

// Dynamic SEO metadata per tool
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const tool = getToolById(slug);
    if (!tool) return { title: "Tool not found" };

    const title = `${tool.name} — Pricing, Features & Review (2026)`;
    const description = `${tool.tagline} See full ${tool.name} pricing tiers, capabilities, pros & cons, and alternatives. Compare ${tool.name} with 130+ AI tools on My AI Picker.`;

    // Build keyword list: primary + long-tail + spelling variants
    const baseKeywords = [
      tool.name,
      tool.name.toLowerCase(),
      `${tool.name} pricing`,
      `${tool.name} features`,
      `${tool.name} review`,
      `${tool.name} alternatives`,
      `${tool.name} vs`,
      `${tool.name} cost`,
      `${tool.name} price`,
      `${tool.name} free`,
      `${tool.name} api`,
      tool.vendor,
      ...tool.tags,
    ];
    const variants = SPELLING_VARIANTS[tool.id] || [];
    const keywords = [...baseKeywords, ...variants];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://myaipicker.com/tools/${tool.id}`,
        siteName: "My AI Picker",
        images: [
          {
            url: "https://myaipicker.com/og-image.png",
            width: 1024,
            height: 1024,
            alt: `${tool.name} — pricing, features, and review (2026)`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://myaipicker.com/og-image.png"],
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

  // Build FAQ list dynamically per tool
  const faqs = [
    {
      question: `What is ${tool.name} used for?`,
      answer: `${tool.name} by ${tool.vendor} is ${tool.tagline.toLowerCase()} ${tool.description.slice(0, 120)}`,
    },
    {
      question: `How much does ${tool.name} cost?`,
      answer: `${tool.name} pricing: ${tool.priceNote}. The free tier includes limited usage; paid plans unlock higher limits and premium features.`,
    },
    {
      question: `Is ${tool.name} free to use?`,
      answer: tool.priceNote.toLowerCase().includes("free")
        ? `Yes — ${tool.name} has a free tier. ${tool.priceNote}.`
        : `No — ${tool.name} does not have a free tier. Pricing starts at ${tool.priceNote}.`,
    },
    {
      question: `What is the best alternative to ${tool.name}?`,
      answer: similar.length > 0
        ? `The best alternatives to ${tool.name} are ${similar.slice(0, 3).map(s => s.name).join(", ")}. Compare them side-by-side on our comparison page.`
        : `There are several alternatives to ${tool.name} — explore them on our AI tools directory.`,
    },
    {
      question: `Is ${tool.name} worth it in 2026?`,
      answer: `${tool.name} is rated ${tool.rating.toFixed(1)}/5. It's worth it if you need ${tool.spec.bestFor.toLowerCase()}. Compare it with alternatives before deciding.`,
    },
  ];

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "AI Tool",
    operatingSystem: "Web",
    description: tool.tagline,
    offers: {
      "@type": "Offer",
      price: tool.priceNote.includes("Free") ? "0" : "20",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: "5",
      ratingCount: "100",
    },
    url: `https://myaipicker.com/tools/${tool.id}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://myaipicker.com" },
      { "@type": "ListItem", position: 2, name: "AI Tools", item: "https://myaipicker.com/#tools" },
      { "@type": "ListItem", position: 3, name: tool.name, item: `https://myaipicker.com/tools/${tool.id}` },
    ],
  };

  return (
    <>
      <ToolDetailContent tool={tool} similar={similar} specKeys={specKeys} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
