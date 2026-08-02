import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles, getArticleBySlug } from "@/lib/blog-data";
import { CalendarDays, Clock, ArrowRight, Sparkles } from "lucide-react";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = getArticleBySlug(slug);
    if (!article) return { title: "Article not found" };
    return {
      title: `${article.title} | My AI Picker`,
      description: article.description,
      keywords: article.keywords,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        url: `https://myaipicker.com/blog/${article.slug}`,
        publishedTime: article.date,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
      },
      alternates: { canonical: `https://myaipicker.com/blog/${article.slug}` },
    };
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Related: same category first, then others
  const sameCategory = blogArticles.filter(
    (a) => a.slug !== slug && a.category === article.category
  );
  const others = blogArticles.filter(
    (a) => a.slug !== slug && a.category !== article.category
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    author: {
      "@type": "Organization",
      name: "My AI Picker",
      url: "https://myaipicker.com",
    },
    publisher: {
      "@type": "Organization",
      name: "My AI Picker",
      logo: {
        "@type": "ImageObject",
        url: "https://myaipicker.com/logo-myaipicker.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://myaipicker.com/blog/${article.slug}`,
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <span>/</span>
            <span className="truncate text-foreground">
              {article.title.slice(0, 40)}
              {article.title.length > 40 ? "..." : ""}
            </span>
          </nav>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 font-semibold text-aurora">
              <Sparkles className="h-3 w-3" />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {article.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime} read
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {article.description}
          </p>

          {/* Hero image (optional) */}
          {article.image && (
            <figure className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <img
                src={article.image}
                alt={`${article.title} — visual comparison`}
                className="aspect-[1344/768] w-full object-cover"
                loading="eager"
              />
            </figure>
          )}

          {/* Divider */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Content */}
          <div
            className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 [&_a]:font-semibold [&_a]:text-aurora [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-aurora/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:scroll-mt-20 [&_h3]:font-display [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_img]:mx-auto [&_img]:my-6 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_li]:text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_ol_li]:text-muted-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground [&_table]:my-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-2.5 [&_td]:text-sm [&_td]:text-muted-foreground [&_th]:border [&_th]:border-border [&_th]:bg-card [&_th]:p-2.5 [&_th]:text-left [&_th]:font-bold [&_th]:text-foreground [&_ul]:ml-4 [&_ul_li]:list-disc"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.keywords.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Topics:
              </span>
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 rounded-xl border border-aurora/30 bg-gradient-to-br from-aurora/[0.06] to-card p-6 text-center">
            <h3 className="font-display text-lg font-bold">
              Compare these tools yourself
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use our interactive comparison deck with real benchmark scores.
            </p>
            <Link
              href="/#compare"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft"
            >
              Compare AI Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold">
                More AI Tool Guides
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-aurora/40"
                  >
                    <span className="text-xs font-semibold text-aurora">
                      {r.category}
                    </span>
                    <h3 className="mt-1 line-clamp-2 font-display text-base font-bold group-hover:text-aurora">
                      {r.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {r.description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-aurora">
                      Read
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />

      {/* JSON-LD structured data for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
