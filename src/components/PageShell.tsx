import type { ReactNode } from "react";
import { ExternalLink, Heart } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-sage-foreground uppercase tracking-wide">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black text-primary leading-[1] break-words">
            {title}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-foreground/75 max-w-2xl">{intro}</p>
        </section>
        <section className="max-w-6xl mx-auto px-4 sm:px-6">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ResourceCard({
  title,
  category,
  city,
  description,
  meta,
  website,
  accent = "rose",
  likeCount,
  liked = false,
  likeDisabled = false,
  onToggleLike,
}: {
  title: string;
  category: string;
  city?: string;
  description: string;
  meta?: string;
  website?: string;
  accent?: "rose" | "sage" | "primary" | "crimson";
  likeCount?: number;
  liked?: boolean;
  likeDisabled?: boolean;
  onToggleLike?: () => void;
}) {
  const websiteUrl = formatExternalUrl(website);
  const websiteLabel = formatWebsiteLabel(website);
  const dot =
    accent === "rose"
      ? "bg-rose"
      : accent === "sage"
        ? "bg-sage"
        : accent === "crimson"
          ? "bg-crimson"
          : "bg-primary";
  return (
    <article className="rounded-3xl bg-card border border-border p-5 sm:p-6 hover:border-primary transition hover:-translate-y-1 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {category}
        </div>
        <div className="flex items-center gap-1.5">
          {city && (
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground/70">
              {city}
            </span>
          )}
          {typeof likeCount === "number" && onToggleLike && (
            <button
              type="button"
              onClick={onToggleLike}
              disabled={likeDisabled}
              aria-pressed={liked}
              aria-label={`${liked ? "Unlike" : "Like"} ${title}. ${likeCount} likes`}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                liked
                  ? "border-rose bg-rose text-rose-foreground"
                  : "border-border bg-background text-foreground/75 hover:border-rose hover:text-rose"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
              {likeCount}
            </button>
          )}
        </div>
      </div>
      <h3 className="mt-3 text-xl font-bold text-primary break-words">{title}</h3>
      <p className="mt-2 text-sm text-foreground/75 break-words">{description}</p>
      {meta && <div className="mt-4 text-xs font-medium text-foreground/60 break-words">{meta}</div>}
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-primary underline-offset-4 transition hover:underline"
        >
          <span className="truncate">{websiteLabel}</span>
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

function formatExternalUrl(value?: string): string | undefined {
  const cleaned = value?.replace(/\s+/g, "").trim();
  if (!cleaned) return undefined;
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
}

function formatWebsiteLabel(value?: string): string {
  const cleaned = value?.replace(/\s+/g, "").trim() ?? "";
  return cleaned.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
