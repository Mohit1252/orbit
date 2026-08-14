interface Tool {
  id: string;
  name: string;
  vendor: string;
  rating: number;
  priceNote: string;
  category: string;
  tagline: string;
}

interface SoftwareApplicationSchemaProps {
  tool: Tool;
}

/**
 * SoftwareApplication JSON-LD schema — for tool detail pages.
 * Makes tools eligible for rich results (ratings, pricing).
 */
export function SoftwareApplicationSchema({ tool }: SoftwareApplicationSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "AI Tool",
    operatingSystem: "Web",
    description: tool.tagline,
    offers: {
      "@type": "Offer",
      price: tool.priceNote.includes("Free") ? "0" : tool.priceNote,
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
