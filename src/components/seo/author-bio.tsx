import { CalendarDays, User, ShieldCheck } from "lucide-react";

interface AuthorBioProps {
  authorName?: string;
  authorRole?: string;
  lastUpdated?: string;
  readTime?: string;
}

/**
 * Author bio + last updated — E-E-A-T signals.
 * Place at top or bottom of blog articles.
 */
export function AuthorBio({
  authorName = "My AI Picker Editorial Team",
  authorRole = "AI Tools Researcher & Reviewer",
  lastUpdated,
  readTime,
}: AuthorBioProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card/60 p-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-aurora/40 bg-aurora/10 text-aurora">
          <User className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{authorName}</p>
          <p className="text-[11px]">{authorRole}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {lastUpdated && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Updated {lastUpdated}
          </span>
        )}
        {readTime && (
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            {readTime} read
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-aurora" />
          Reviewed by AI experts
        </span>
      </div>
    </div>
  );
}
