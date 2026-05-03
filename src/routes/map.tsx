import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ResourceMap } from "@/components/ResourceMap";
import { getResources } from "@/api/public";

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

function MapPage() {
  const resources = Route.useLoaderData();
  return (
    <PageShell
      eyebrow="Locations"
      title="Find resources nearby."
      intro="Browse our community resources on an interactive map. Click any marker to see details, hours, contact info, and more."
    >
      <ResourceMap resources={resources} />
    </PageShell>
  );
}
