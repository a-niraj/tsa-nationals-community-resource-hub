import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownAZ, Heart, Search } from "lucide-react";
import { PageShell, ResourceCard } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { getLikedResources, getLikes, getResources, toggleLike } from "@/api/public";
import { getCityFromAddress, RESOURCE_CITIES, type ResourceCity } from "@/lib/resource-city";

export const Route = createFileRoute("/services")({
  validateSearch: (search: Record<string, unknown>): ServicesSearch => ({
    city: parseCitySearch(search.city),
  }),
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
  loader: async () => {
    const [resources, likes] = await Promise.all([getResources(), getLikes()]);
    return { resources, likes };
  },
  component: ServicesPage,
});

const ACCENTS = ["rose", "sage", "primary", "crimson"] as const;
const ALL_CATEGORIES = "All Categories";
const ALL_CITIES = "All Cities";
const USER_ID_STORAGE_KEY = "resource-like-user-id";

type SortOption = "alphabetical" | "mostLiked" | "leastLiked";
type ServicesSearch = {
  city?: ResourceCity;
};

function ServicesPage() {
  const { resources, likes } = Route.useLoaderData();
  const { city: citySearch } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeCity, setActiveCity] = useState<ResourceCity | typeof ALL_CITIES>(
    citySearch ?? ALL_CITIES,
  );
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(likes);
  const [likedResourceIds, setLikedResourceIds] = useState<Set<number>>(() => new Set());
  const [userId, setUserId] = useState("");
  const [likeBusy, setLikeBusy] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLikeCounts(likes);
  }, [likes]);

  useEffect(() => {
    setActiveCity(citySearch ?? ALL_CITIES);
  }, [citySearch]);

  useEffect(() => {
    const storedUserId = getOrCreateLikeUserId();
    setUserId(storedUserId);

    getLikedResources({ data: { userId: storedUserId } })
      .then((likedIds) => setLikedResourceIds(new Set(likedIds)))
      .catch(() => setLikedResourceIds(new Set()));
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(resources.map((resource) => resource.category))).sort((a, b) =>
        sortCategories(a, b),
      ),
    [resources],
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...resources]
      .filter((resource) => {
        const resourceCity = getCityFromAddress(resource.address ?? "");
        const matchesCategory =
          activeCategory === ALL_CATEGORIES || resource.category === activeCategory;
        const matchesCity = activeCity === ALL_CITIES || resourceCity === activeCity;
        const matchesQuery =
          !normalizedQuery ||
          resource.name.toLowerCase().includes(normalizedQuery) ||
          resource.description.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesCity && matchesQuery;
      })
      .sort((a, b) => sortResources(a, b, sortOption, likeCounts));
  }, [activeCategory, activeCity, likeCounts, query, resources, sortOption]);

  const resultCountLabel = useMemo(() => {
    const resourceLabel = filteredResources.length === 1 ? "resource" : "resources";
    const categoryText = activeCategory === ALL_CATEGORIES ? "" : `${activeCategory} `;
    const cityText = activeCity === ALL_CITIES ? "" : ` in ${activeCity}`;

    if (activeCategory === ALL_CATEGORIES && activeCity === ALL_CITIES) {
      return `Showing ${filteredResources.length} of ${resources.length} ${resourceLabel}`;
    }

    return `Showing ${filteredResources.length} ${categoryText}${resourceLabel}${cityText}`;
  }, [activeCategory, activeCity, filteredResources.length, resources.length]);

  async function handleToggleLike(resourceId: number) {
    const nextUserId = userId || getOrCreateLikeUserId();
    if (!userId) setUserId(nextUserId);

    setLikeBusy((prev) => ({ ...prev, [resourceId]: true }));
    try {
      const result = await toggleLike({ data: { resourceId, userId: nextUserId } });

      setLikeCounts((prev) => ({ ...prev, [resourceId]: result.count }));
      setLikedResourceIds((prev) => {
        const next = new Set(prev);
        if (result.liked) {
          next.add(resourceId);
        } else {
          next.delete(resourceId);
        }
        return next;
      });
    } finally {
      setLikeBusy((prev) => ({ ...prev, [resourceId]: false }));
    }
  }

  return (
    <PageShell
      eyebrow="Services"
      title="Help, when you need it."
      intro="A thorough list of local organizations, clinics, and programs. Affordable and accessible."
    >
      <Reveal>
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
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
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
        <div className="flex flex-wrap gap-2">
          {[ALL_CITIES, ...RESOURCE_CITIES].map((city) => {
            const selected = activeCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selected
                    ? "bg-sage text-sage-foreground"
                    : "border border-border bg-background text-foreground/75 hover:border-primary hover:text-primary"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const selected = sortOption === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortOption(option.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selected
                    ? "bg-crimson text-crimson-foreground"
                    : "border border-border bg-background text-foreground/75 hover:border-primary hover:text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">{resultCountLabel}</div>
      </div>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr pb-16">
        {filteredResources.map((r, i) => {
          const city = getCityFromAddress(r.address ?? "");

          return (
            <Reveal key={r.id} delay={(i % 6) * 70} className="h-full">
              <ResourceCard
                title={r.name}
                category={r.category}
                city={city}
                description={r.description}
                meta={r.address ?? r.phone ?? undefined}
                website={r.website ?? undefined}
                accent={ACCENTS[i % ACCENTS.length]}
                likeCount={likeCounts[r.id] ?? 0}
                liked={likedResourceIds.has(r.id)}
                likeDisabled={likeBusy[r.id]}
                onToggleLike={() => handleToggleLike(r.id)}
              />
            </Reveal>
          );
        })}
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

function parseCitySearch(value: unknown): ResourceCity | undefined {
  return typeof value === "string" && isResourceCity(value) ? value : undefined;
}

function isResourceCity(value: string): value is ResourceCity {
  return RESOURCE_CITIES.includes(value as ResourceCity);
}

const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
  icon: typeof ArrowDownAZ;
}> = [
  { value: "alphabetical", label: "A-Z", icon: ArrowDownAZ },
  { value: "mostLiked", label: "Most liked", icon: Heart },
  { value: "leastLiked", label: "Least liked", icon: Heart },
];

function sortResources<T extends { name: string; id: number }>(
  a: T,
  b: T,
  sortOption: SortOption,
  likeCounts: Record<number, number>,
): number {
  const nameComparison = a.name.localeCompare(b.name);

  if (sortOption === "mostLiked") {
    return (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0) || nameComparison;
  }

  if (sortOption === "leastLiked") {
    return (likeCounts[a.id] ?? 0) - (likeCounts[b.id] ?? 0) || nameComparison;
  }

  return nameComparison;
}

function getOrCreateLikeUserId(): string {
  const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (storedUserId) return storedUserId;

  const nextUserId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(USER_ID_STORAGE_KEY, nextUserId);
  return nextUserId;
}
