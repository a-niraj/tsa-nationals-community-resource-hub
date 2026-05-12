import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ResourceMap } from "@/components/ResourceMap";
import { Reveal } from "@/components/Reveal";
import { getResources } from "@/api/public";
import seattleImg from "@/pictures/Seattle.jpeg";
import redmondImg from "@/pictures/Redmond.jpeg";
import bellevueImg from "@/pictures/Bellevue.jpeg";
import kirklandImg from "@/pictures/Kirkland.jpeg";
import woodinvilleImg from "@/pictures/woodinville.jpeg";
import tukwilaImg from "@/pictures/Tukwila.jpeg";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Resource Map — Seattle Together" },
      { name: "description", content: "Interactive map of community resources in Seattle, WA." },
    ],
  }),
  loader: () => getResources(),
  component: MapPage,
});

const cities = [
  {
    name: "Seattle",
    img: seattleImg,
    description: "The big one on Puget Sound. Pike Place Market in the morning, the Space Needle at night, and a whole lot of saltwater shoreline in between.",
  },
  {
    name: "Redmond",
    img: redmondImg,
    description: "Quiet Eastside town with Marymoor Park, the Microsoft campus, and miles of flat, easy trail along the Sammamish River.",
  },
  {
    name: "Bellevue",
    img: bellevueImg,
    description: "A walkable downtown next to the Botanical Garden and Mercer Slough wetlands. About 15 minutes from Seattle if traffic cooperates.",
  },
  {
    name: "Kirkland",
    img: kirklandImg,
    description: "Right on Lake Washington with public beaches, a busy little arts scene at Moss Bay, and Juanita Beach Park up the road.",
  },
  {
    name: "Woodinville",
    img: woodinvilleImg,
    description: "Wine country, hiding in the suburbs. Over 100 tasting rooms and the northern tip of the Sammamish River Trail.",
  },
  {
    name: "Tukwila",
    img: tukwilaImg,
    description: "Just south of Seattle near the airport. Home to Westfield Southcenter and, surprisingly, the Museum of Flight.",
  },
] as const;

function MapPage() {
  const resources = Route.useLoaderData();
  return (
    <PageShell
      eyebrow="Locations"
      title="Find resources nearby."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {cities.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 100}>
            <article className="group overflow-hidden rounded-3xl bg-card border border-border hover:border-primary transition min-w-0 h-full">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={c.img}
                  alt={`${c.name} cityscape`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-xl font-bold text-primary">{c.name}</h3>
                <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{c.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-8 text-base sm:text-lg text-foreground/75 max-w-2xl">
          Browse our community resources on an interactive map. Click any marker to see details, hours, contact info, and more.
        </p>
      </Reveal>
      <Reveal>
        <ResourceMap resources={resources} />
      </Reveal>
    </PageShell>
  );
}
