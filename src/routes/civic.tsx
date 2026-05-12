import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ResourceCard } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import civicBanner from "@/pictures/South_Lake_Union_cityscape.jpeg";

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
  { category: "Parks", title: "Marymoor Park", city: "Redmond", description: "640 acres of trails, dog park, climbing rock, and the famous concert venue.", accent: "sage" as const },
  { category: "Parks", title: "Idylwood Beach Park", city: "Redmond", description: "Lake Sammamish access with swimming, picnic shelters, and a playground.", accent: "sage" as const },
  { category: "Parks", title: "Lake Sammamish State Park", city: "Issaquah", description: "531-acre day-use park with two swimming beaches, kayak rentals, and a great-blue-heron rookery. Discover Pass required.", accent: "sage" as const },
  { category: "Parks", title: "Farrel-McWhirter Farm Park", city: "Redmond", description: "Working farm park with barnyard animals, riding trails, and seasonal kids' programs.", accent: "sage" as const },
  { category: "Parks", title: "Grass Lawn Park", city: "Redmond", description: "27-acre neighborhood park with sports fields, a playground, and a covered picnic shelter.", accent: "sage" as const },
  { category: "Parks", title: "Hartman Park", city: "Redmond", description: "Wooded park with tennis courts, ballfields, and a quiet looped walking path.", accent: "sage" as const },
  { category: "Parks", title: "Bridle Trails State Park", city: "Kirkland", description: "482-acre forest park with 28 miles of equestrian and hiking trails. Discover Pass required.", accent: "sage" as const },
  { category: "Parks", title: "Juanita Beach Park", city: "Kirkland", description: "Lake Washington swimming beach with a roped swim area, fishing pier, and Friday summer markets.", accent: "sage" as const },
  { category: "Parks", title: "Saint Edward State Park", city: "Kenmore", description: "316 acres of old-growth forest, hiking trails, and a historic seminary on the shore of Lake Washington.", accent: "sage" as const },
  { category: "Parks", title: "O.O. Denny Park", city: "Kirkland", description: "Quiet Lake Washington shoreline park with a beach, picnic area, and a Douglas fir trail.", accent: "sage" as const },
  { category: "Parks", title: "Mercer Slough Nature Park", city: "Bellevue", description: "320 acres of wetlands with boardwalks, kayak access, and a working blueberry farm.", accent: "sage" as const },
  { category: "Parks", title: "Cougar Mountain Regional Wildland Park", city: "Bellevue / Issaquah", description: "3,100 acres with over 30 miles of forest trails — the largest park in the King County system.", accent: "sage" as const },
  { category: "Parks", title: "Discovery Park", city: "Seattle", description: "534-acre coastal park in Magnolia with bluffs, beach access, a lighthouse, and miles of trails.", accent: "sage" as const },
  { category: "Parks", title: "Green Lake Park", city: "Seattle", description: "3-mile paved loop around a popular lake, with a swimming beach, pedal boats, and a community center.", accent: "sage" as const },
  { category: "Parks", title: "Gas Works Park", city: "Seattle", description: "Lakefront park on Lake Union with kite-flying hills, picnic spots, and the remains of a 1900s gasification plant.", accent: "sage" as const },
  { category: "Parks", title: "Volunteer Park", city: "Seattle", description: "48-acre Capitol Hill park with a conservatory, the Asian Art Museum, and a water tower with city views.", accent: "sage" as const },
  { category: "Trails", title: "Burke-Gilman Trail", city: "Seattle to Bothell", description: "20-mile paved trail running from Golden Gardens to Bothell along the old Burlington Northern rail line.", accent: "primary" as const },
  { category: "Trails", title: "Sammamish River Trail", city: "Bothell to Redmond", description: "10-mile paved trail along the Sammamish River, connecting the Burke-Gilman to Marymoor Park.", accent: "primary" as const },
  { category: "Trails", title: "East Lake Sammamish Trail", city: "Redmond to Issaquah", description: "11-mile paved trail on a former railbed, linking Marymoor to Lake Sammamish State Park.", accent: "primary" as const },
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
      image={{
        src: civicBanner,
        alt: "South Lake Union park with the Seattle skyline in the background",
      }}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr pb-16">
        {items.map((item, idx) => (
          <Reveal key={item.title} delay={(idx % 3) * 100} className="h-full">
            <ResourceCard {...item} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}