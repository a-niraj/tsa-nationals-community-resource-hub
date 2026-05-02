import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

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
  { day: "SAT", date: "May 9", title: "Redmond Saturday Market", time: "9:00 AM · 3:00 PM", place: "Redmond Town Center", tag: "Market", accent: "rose" },
  { day: "TUE", date: "May 12", title: "City Council Meeting", time: "7:00 PM", place: "City Hall · Council Chambers", tag: "Civic", accent: "primary" },
  { day: "WED", date: "May 13", title: "Storytime at the Library", time: "10:30 AM", place: "KCLS Redmond Library", tag: "Family", accent: "sage" },
  { day: "FRI", date: "May 15", title: "Sammamish River Cleanup", time: "5:30 PM", place: "Marymoor Park, Lot G", tag: "Outdoors", accent: "sage" },
  { day: "SAT", date: "May 16", title: "Derby Days Kickoff Concert", time: "6:00 PM", place: "Downtown Park", tag: "Festival", accent: "crimson" },
  { day: "SUN", date: "May 17", title: "Bike to the Farmers Market", time: "8:30 AM", place: "Meets at 520 Trail Head", tag: "Community", accent: "rose" },
] as const;

const accentBg = {
  rose: "bg-rose text-rose-foreground",
  sage: "bg-sage text-sage-foreground",
  primary: "bg-primary text-primary-foreground",
  crimson: "bg-crimson text-crimson-foreground",
} as const;

function EventsPage() {
  return (
    <PageShell
      eyebrow="Events"
      title="What's on this week."
      intro="A mix of civic gatherings, outdoor adventures, family programs, and good old-fashioned community fun."
    >
      <div className="grid gap-4 pb-16">
        {events.map((e) => (
          <article key={e.title} className="rounded-3xl bg-card border border-border p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5 hover:border-primary transition">
            <div className={`shrink-0 rounded-2xl px-5 py-3 text-center font-display ${accentBg[e.accent]}`}>
              <div className="text-xs font-bold tracking-widest opacity-80">{e.day}</div>
              <div className="text-2xl font-black leading-tight">{e.date}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{e.tag}</div>
              <h3 className="mt-1 text-2xl font-bold text-primary">{e.title}</h3>
              <p className="text-sm text-foreground/70 mt-1">{e.time} · {e.place}</p>
            </div>
            <button className="self-start md:self-auto rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
              Add to calendar
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}