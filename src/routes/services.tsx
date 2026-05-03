import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ResourceCard } from "@/components/PageShell";
import { getResources } from "@/api/public";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Local Services — Seattle Together" },
      { name: "description", content: "Find trusted local services in Seattle, WA: food assistance, healthcare, family support, housing, and more." },
      { property: "og:title", content: "Local Services in Seattle, WA" },
      { property: "og:description", content: "Trusted businesses and essential services across Seattle." },
    ],
  }),
  loader: () => getResources(),
  component: ServicesPage,
});

const ACCENTS = ["rose", "sage", "primary", "crimson"] as const;

function ServicesPage() {
  const resources = Route.useLoaderData();

  return (
    <PageShell
      eyebrow="Services"
      title="Help, when you need it."
      intro="A curated list of local organizations, clinics, and programs. Free or low-cost, all year round."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {resources.map((r, i) => (
          <ResourceCard
            key={r.id}
            title={r.name}
            category={r.category}
            description={r.description}
            meta={r.address ?? r.phone ?? undefined}
            accent={ACCENTS[i % ACCENTS.length]}
          />
        ))}
        {resources.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-dashed border-border p-12 text-center text-foreground/60">
            No resources yet.
          </div>
        )}
      </div>
    </PageShell>
  );
}
