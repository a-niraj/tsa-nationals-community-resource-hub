import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
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
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-sage-foreground uppercase tracking-wide">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-primary leading-[0.95]">{title}</h1>
          <p className="mt-5 text-lg text-foreground/75 max-w-2xl">{intro}</p>
        </section>
        <section className="max-w-6xl mx-auto px-6">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ResourceCard({
  title,
  category,
  description,
  meta,
  website,
  accent = "rose",
}: {
  title: string;
  category: string;
  description: string;
  meta?: string;
  website?: string;
  accent?: "rose" | "sage" | "primary" | "crimson";
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
    <article className="rounded-3xl bg-card border border-border p-6 hover:border-primary transition hover:-translate-y-1">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        {category}
      </div>
      <h3 className="mt-3 text-xl font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-foreground/75">{description}</p>
      {meta && <div className="mt-4 text-xs font-medium text-foreground/60">{meta}</div>}
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
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function formatWebsiteLabel(value?: string): string {
  const trimmed = value?.trim() ?? "";
  return trimmed.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
