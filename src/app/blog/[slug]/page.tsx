import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles, getArticleBySlug } from "@/lib/blog-data";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

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
      title: `${article.title} | My AI Picker Blog`,
      description: article.description,
      keywords: article.keywords,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        url: `https://myaipicker.com/blog/${article.slug}`,
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

  const related = blogArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <span>/</span>
        <span className="truncate text-foreground">{article.title.slice(0, 40)}...</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 font-semibold text-aurora">
          {article.category}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {article.date}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {article.readTime}
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">{article.description}</p>

      {/* Content */}
      <div
        className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 [&_a]:font-semibold [&_a]:text-aurora [&_a]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:font-bold [&_th]:text-foreground"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* CTA */}
      <div className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
        <h3 className="font-display text-lg font-bold">Compare these tools yourself</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Use our interactive comparison deck with real benchmark scores.
        </p>
        <Link
          href="/#compare"
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
        >
          Compare AI Tools →
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">More Articles</h2>
          <div className="mt-4 space-y-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-aurora/40"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-bold group-hover:text-aurora">
                    {r.title}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
