import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import copyrightChecklistPdf from "@/pictures/Webmaster - Student Copyright Checklist (1).pdf?url";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Reference | Seattle Together" },
      { name: "description", content: "Project documents, code stack, and libraries used to build Seattle Together." },
    ],
  }),
  component: ReferencePage,
});

const libraries: { name: string; purpose: string }[] = [
  { name: "@tanstack/react-router", purpose: "File-based routing for every page in the site" },
  { name: "@tanstack/react-start", purpose: "Full-stack React framework powering the build, server functions, and SSR" },
  { name: "@tanstack/react-query", purpose: "Async data caching and revalidation for resources and likes" },
  { name: "react & react-dom", purpose: "UI library (React 19) underneath everything else" },
  { name: "vite", purpose: "Dev server and production bundler" },
  { name: "@cloudflare/vite-plugin & wrangler", purpose: "Build and deploy the site as a Cloudflare Worker" },
  { name: "@supabase/supabase-js", purpose: "Reads and writes resources, likes, submissions, and contact messages" },
  { name: "tailwindcss & tw-animate-css", purpose: "Utility-first styling and small animation helpers" },
  { name: "Radix UI primitives", purpose: "Accessible building blocks behind dropdowns, dialogs, menus, and form controls" },
  { name: "class-variance-authority, tailwind-merge, clsx", purpose: "Compose Tailwind class variants for the shadcn/ui-style components" },
  { name: "leaflet & react-leaflet", purpose: "Interactive resource map with OpenStreetMap tiles" },
  { name: "lucide-react", purpose: "Icon set used in the header, search, and resource cards" },
  { name: "react-hook-form & zod (with @hookform/resolvers)", purpose: "Form state and schema validation for submissions and contact" },
  { name: "date-fns", purpose: "Date formatting for events and admin views" },
  { name: "sonner", purpose: "Toast notifications for actions like liking or submitting" },
  { name: "embla-carousel-react", purpose: "City photo carousels on the homepage" },
  { name: "TypeScript, ESLint, Prettier", purpose: "Type checking, linting, and code formatting" },
];

function DocumentSection({
  eyebrow,
  title,
  description,
  pdfUrl,
}: {
  eyebrow: string;
  title: string;
  description: string;
  pdfUrl?: string;
}) {
  return (
    <section className="rounded-3xl bg-card border border-border p-5 sm:p-7 h-full flex flex-col">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage-foreground">
        {eyebrow}
      </span>
      <div className="mt-4 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary leading-snug">{title}</h2>
      </div>
      <p className="mt-3 text-foreground/75">{description}</p>
      {pdfUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background">
          <object
            data={pdfUrl}
            type="application/pdf"
            aria-label={title}
            className="block w-full h-[45vh] min-h-[400px]"
          >
            <iframe
              src={pdfUrl}
              title={title}
              className="block w-full h-[45vh] min-h-[400px]"
            />
          </object>
        </div>
      ) : (
        <div className="mt-6 grid flex-1 place-items-center rounded-2xl border border-dashed border-border bg-background/40 p-10 text-sm text-muted-foreground min-h-[45vh]">
          The document will appear here once it is ready.
        </div>
      )}
    </section>
  );
}

function ReferencePage() {
  return (
    <PageShell
      eyebrow="Reference"
      title="Reference Page"
      intro="A look at the documents behind the project, what the site is built with, and the open source libraries doing the heavy lifting."
    >
      <div className="pb-16 space-y-12">
        <div className="grid gap-5 md:grid-cols-2 md:items-stretch">
          <Reveal direction="left" className="h-full">
            <DocumentSection
              eyebrow="Document"
              title="Work Log"
              description="A timeline of what got built each week, what changed, and the design choices that came out of it."
            />
          </Reveal>
          <Reveal direction="right" delay={100} className="h-full">
            <DocumentSection
              eyebrow="Document"
              title="Copyright Checklist"
              description="Where every image, dataset, and quote on the site came from, with the license notes to back it up."
              pdfUrl={copyrightChecklistPdf}
            />
          </Reveal>
        </div>

        <Reveal>
          <section className="rounded-3xl bg-card border border-border p-5 sm:p-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-foreground">
              Code Stack
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-black text-primary">What powers Seattle Together</h2>
            <div className="mt-4 space-y-4 text-foreground/80 leading-relaxed max-w-3xl">
              <p>
                The site is a React 19 app running on TanStack Start. TanStack Router handles every page through file based routing, and TanStack Query keeps the data fresh. The whole codebase is TypeScript, and Vite bundles it for both dev and production.
              </p>
              <p>
                For styling, the whole UI is built with Tailwind CSS 4. The dropdowns, dialogs, and form controls sit on top of Radix primitives, wrapped in lightweight shadcn style components. The cards, hero sections, and illustrated touches are written straight in JSX, so there is no extra design system to wrestle with.
              </p>
              <p>
                Everything that needs to be saved (resources, likes, contact messages, and pending submissions) lives in a Supabase Postgres database. The admin review screen is gated by a single password to keep moderation simple. The map of the area uses Leaflet with OpenStreetMap tiles through React Leaflet.
              </p>
              <p>
                The site ships as a Cloudflare Worker. Vite handles the build with the official @cloudflare/vite-plugin, and Wrangler covers local previews and production deploys. Before each release, the site gets a pass on phones, tablets, and desktops to make sure the layout and keyboard navigation hold up.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-3xl bg-card border border-border p-5 sm:p-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              Libraries
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-black text-primary">Additional libraries utilized</h2>
            <p className="mt-3 text-foreground/75 max-w-2xl">
              The open source packages doing actual work in the app, and what each one is here for.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {libraries.map((lib) => (
                <li
                  key={lib.name}
                  className="rounded-2xl border border-border bg-background/40 p-4"
                >
                  <div className="font-semibold text-foreground">{lib.name}</div>
                  <div className="mt-1 text-sm text-foreground/70">{lib.purpose}</div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </PageShell>
  );
}
