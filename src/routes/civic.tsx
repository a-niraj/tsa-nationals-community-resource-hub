import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ResourceCard } from "@/components/PageShell";

export const Route = createFileRoute("/civic")({
  head: () => ({
    meta: [
      { title: "Civic Info — Seattle Together" },
      { name: "description", content: "Parks, transit, permits, utilities, and government resources for Seattle area residents." },
      { property: "og:title", content: "Civic Info Seattle, WA" },
      { property: "og:description", content: "Parks, transit, permits, and government in Seattle." },
    ],
  }),
  component: CivicPage,
});

const items = [
  { category: "Parks", title: "Marymoor Park", description: "640 acres of trails, dog park, climbing rock, and the famous concert venue.", accent: "sage" as const },
  { category: "Parks", title: "Idylwood Beach Park", description: "Lake Sammamish access with swimming, picnic shelters, and a playground.", accent: "sage" as const },
  { category: "Transit", title: "Sound Transit Link Light Rail", description: "Downtown Redmond and Marymoor Village stations connect you to Seattle.", accent: "primary" as const },
  { category: "Transit", title: "Redmond Trip Resource Center", description: "Bus passes, bike maps, and carpool matching for residents and commuters.", accent: "primary" as const },
  { category: "Government", title: "Redmond City Hall", description: "Permits, public records, and council agendas. 15670 NE 85th St.", accent: "rose" as const },
  { category: "Utilities", title: "Water, Sewer & Recycling", description: "Set up service, report outages, and find your collection schedule.", accent: "crimson" as const },
  { category: "Schools", title: "Lake Washington School District", description: "Enrollment, bus routes, lunch menus, and family liaison contacts.", accent: "rose" as const },
  { category: "Get Involved", title: "Boards & Commissions", description: "Volunteer for parks, planning, arts, or human services advisory boards.", accent: "sage" as const },
];

function CivicPage() {
  return (
    <PageShell
      eyebrow="Civic"
      title="The Seattle owner's manual."
      intro="Everything you need to navigate parks, transit, permits, schools, and your local government."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {items.map((i) => (
          <ResourceCard key={i.title} {...i} />
        ))}
      </div>
    </PageShell>
  );
}