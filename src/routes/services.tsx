import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageShell, ResourceCard } from "@/components/PageShell";
import { getResources } from "@/api/public";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Local Services — Seattle Together" },
      {
        name: "description",
        content:
          "Find trusted local services in Seattle, WA: food assistance, healthcare, family support, housing, and more.",
      },
      { property: "og:title", content: "Local Services in Seattle, WA" },
      {
        property: "og:description",
        content: "Trusted businesses and essential services across Seattle.",
      },
    ],
  }),
  loader: () => getResources(),
  component: ServicesPage,
});

const ACCENTS = ["rose", "sage", "primary", "crimson"] as const;
const ALL_CATEGORIES = "All resources";

function ServicesPage() {
  const resources = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(
    () =>
      Array.from(new Set(resources.map((resource) => resource.category))).sort((a, b) =>
        sortCategories(a, b),
      ),
    [resources],
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || resource.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        resource.name.toLowerCase().includes(normalizedQuery) ||
        resource.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, resources]);

  return (
    <PageShell
      eyebrow="Services"
      title="Help, when you need it."
      intro="A curated list of local organizations, clinics, and programs. Free or low-cost, all year round."
    >
      <div className="mb-8 grid gap-5 rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a resource"
            className="h-12 w-full rounded-full border border-input bg-background pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[ALL_CATEGORIES, ...categories].map((category) => {
            const selected = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground/75 hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {filteredResources.map((r, i) => (
          <ResourceCard
            key={r.id}
            title={r.name}
            category={r.category}
            description={r.description}
            meta={r.address ?? r.phone ?? undefined}
            website={r.website ?? undefined}
            accent={ACCENTS[i % ACCENTS.length]}
          />
        ))}
        {resources.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-dashed border-border p-12 text-center text-foreground/60">
            No resources yet.
          </div>
        )}
        {resources.length > 0 && filteredResources.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-dashed border-border p-12 text-center text-foreground/60">
            No resources match your search.
          </div>
        )}
      </div>
    </PageShell>
  );
}

function sortCategories(a: string, b: string): number {
  if (a === "Other") return 1;
  if (b === "Other") return -1;
  return a.localeCompare(b);
}
