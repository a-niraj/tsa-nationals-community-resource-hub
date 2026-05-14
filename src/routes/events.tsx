import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import eventsBanner from "@/pictures/U_Wash_Quad_cherry_blossoms_06.jpg";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Community Events — Seattle Together" },
      { name: "description", content: "Upcoming events in Seattle, WA: farmers markets, festivals, council meetings, and library programs." },
      { property: "og:title", content: "Events in Redmond, WA" },
      { property: "og:description", content: "What's happening this week in Seattle." },
    ],
  }),
  component: EventsPage,
});

const events = [
  { day: "SAT", date: "May 9", dateKey: "2026-05-09", title: "Redmond Saturday Market", time: "9:00 AM · 3:00 PM", place: "Redmond Town Center", tag: "Market", accent: "rose" },
  { day: "TUE", date: "May 12", dateKey: "2026-05-12", title: "City Council Meeting", time: "7:00 PM", place: "City Hall · Council Chambers", tag: "Civic", accent: "primary" },
  { day: "WED", date: "May 13", dateKey: "2026-05-13", title: "Storytime at the Library", time: "10:30 AM", place: "KCLS Redmond Library", tag: "Family", accent: "sage" },
  { day: "FRI", date: "May 15", dateKey: "2026-05-15", title: "Sammamish River Cleanup", time: "5:30 PM", place: "Marymoor Park, Lot G", tag: "Outdoors", accent: "sage" },
  { day: "SAT", date: "May 16", dateKey: "2026-05-16", title: "Derby Days Kickoff Concert", time: "6:00 PM", place: "Downtown Park", tag: "Festival", accent: "crimson" },
  { day: "SUN", date: "May 17", dateKey: "2026-05-17", title: "Bike to the Farmers Market", time: "8:30 AM", place: "Meets at 520 Trail Head", tag: "Community", accent: "rose" },
  { day: "SAT", date: "May 22", dateKey: "2026-05-22", title: "Northwest Folklife Festival", time: "All Day", place: "Seattle Center", tag: "Festival", accent: "rose" },
  { day: "THU", date: "May 28", dateKey: "2026-05-28", title: "Queen Anne Farmers Market", time: "3:00 PM · 7:00 PM", place: "West Crockett & Queen Anne Ave", tag: "Market", accent: "sage" },
  { day: "FRI", date: "June 5", dateKey: "2026-06-05", title: "Phinney Farmers Market Opens", time: "3:00 PM · 7:00 PM", place: "6761 Phinney Ave N", tag: "Market", accent: "sage" },
  { day: "SAT", date: "June 6", dateKey: "2026-06-06", title: "Pagdiriwang Filipino Festival", time: "10:00 AM · 6:00 PM", place: "Seattle Center", tag: "Festival", accent: "crimson" },
  { day: "SAT", date: "June 13", dateKey: "2026-06-13", title: "Indigenous People Festival", time: "10:00 AM · 5:00 PM", place: "Seattle Center", tag: "Festival", accent: "primary" },
  { day: "SUN", date: "June 28", dateKey: "2026-06-28", title: "Seattle PrideFest", time: "11:00 AM · 6:00 PM", place: "Seattle Center", tag: "Community", accent: "rose" },
  { day: "SAT", date: "July 11", dateKey: "2026-07-11", title: "Polish Festival Seattle", time: "10:00 AM · 6:00 PM", place: "Columbia City", tag: "Festival", accent: "primary" },
  { day: "FRI", date: "July 24", dateKey: "2026-07-24", title: "Bite of Seattle Begins", time: "5:00 PM", place: "Seattle Center", tag: "Festival", accent: "crimson" },
] as const;

const accentBg = {
  rose: "bg-rose text-rose-foreground",
  sage: "bg-sage text-sage-foreground",
  primary: "bg-primary text-primary-foreground",
  crimson: "bg-crimson text-crimson-foreground",
} as const;

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EventsPage() {
  const upcomingEvents = events.filter((event) => event.dateKey >= getLocalDateKey());

  return (
    <PageShell
      eyebrow="Events"
      title="What's happening in the community."
      intro="Civic gatherings, outdoor adventures, family programs, community fun."
      image={{
        src: eventsBanner,
        alt: "Community gathered under cherry blossoms in the University of Washington Quad",
      }}
    >
      <div className="grid gap-4 pb-16">
        {upcomingEvents.map((e, i) => (
          <Reveal key={e.title} delay={(i % 4) * 80} direction="left">
            <article className="rounded-3xl bg-card border border-border p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 sm:gap-5 hover:border-primary transition min-w-0">
              <div className={`self-start shrink-0 rounded-2xl px-4 sm:px-5 py-2 sm:py-3 text-center font-display ${accentBg[e.accent]}`}>
                <div className="text-xs font-bold tracking-widest opacity-80">{e.day}</div>
                <div className="text-xl sm:text-2xl font-black leading-tight">{e.date}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{e.tag}</div>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-primary">{e.title}</h3>
                <p className="text-sm text-foreground/70 mt-1 break-words">{e.time} · {e.place}</p>
              </div>
            </article>
          </Reveal>
        ))}
        {upcomingEvents.length === 0 && (
          <Reveal>
            <div className="rounded-3xl bg-card border border-border p-6 text-foreground/75">
              No upcoming events are listed right now.
            </div>
          </Reveal>
        )}
      </div>
    </PageShell>
  );
}
