import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

/**
 * Breadcrumbs — visible navigation + BreadcrumbList JSON-LD schema.
 * Place near top of any page (below navbar, above H1).
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `https://myaipicker.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          return (
            <span key={idx} className="inline-flex items-center gap-1">
              {idx === 0 && <Home className="h-3 w-3" />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-foreground font-medium" : ""}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 opacity-50" />}
            </span>
          );
        })}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
