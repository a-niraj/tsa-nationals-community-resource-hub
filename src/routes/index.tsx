import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/redmond-hero.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getResources } from "@/api/public";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seattle Together - Community Resource Hub for Seattle, WA" },
      { name: "description", content: "A friendly guide to local services, events, parks, and civic resources in Seattle, Washington." },
      { property: "og:title", content: "Seattle Together — Community Resource Hub" },
      { property: "og:description", content: "Services, events, and civic life in Seattle, all in one neighborly place." },
    ],
  }),
  loader: async () => {
    const resources = await getResources();
    return { resourceCount: resources.length };
  },
  component: Index,
});

const quickLinks = [
  { label: "Saturday Market", tag: "This weekend", to: "/events", tone: "rose" },
  { label: "Marymoor Park", tag: "Outdoors", to: "/civic", tone: "primary" },
  { label: "City Hall", tag: "Civic", to: "/civic", tone: "outline" },
] as const;

const featured = [
  {
    title: "Local Services",
    body: "Trusted businesses, food banks, healthcare, and family support — searchable by neighborhood.",
    to: "/services",
    emoji: "",
  },
  {
    title: "Community Events",
    body: "Farmers markets, library storytime, council meetings, and seasonal festivals.",
    to: "/events",
    emoji: "",
  },
  {
    title: "Civic Info",
    body: "Parks, transit, permits, schools, utilities, and ways to get involved locally.",
    to: "/civic",
    emoji: "",
  },
] as const;

function Index() {
  const { resourceCount } = Route.useLoaderData();
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main>
        {}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-sage-foreground uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Seattle, Washington
              </span>
                <h1 className="mt-5 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-primary">
                  <span className="block mb-2">Resources,</span>
                  <em className="block not-italic text-crimson font-display italic">
                      Simplified.
                  </em>
                </h1>
              <p className="mt-5 text-base sm:text-lg md:text-xl text-foreground/80 max-w-xl">
                Your friendly guide to everything happening in Seattle - from farmers
                markets and library hours to where to recycle paint.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/services" className="inline-flex items-center rounded-full bg-primary px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground hover:opacity-90 transition">
                  Browse services
                </Link>
                <Link to="/events" className="inline-flex items-center rounded-full border-2 border-primary px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
                  See what's on
                </Link>
              </div>
            </div>
            <div className="relative mx-2 sm:mx-0 min-w-0">
              <div className="absolute -inset-3 sm:-inset-4 rounded-[2.5rem] bg-rose/30 -rotate-2" />
              <img
                src={heroImg}
                alt="Illustration of downtown Seattle with evergreen trees and Cascade mountains"
                width={1280}
                height={960}
                className="relative rounded-[2rem] w-full h-auto shadow-xl rotate-1"
              />
            </div>
          </div>
        </section>

        {}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {quickLinks.map((q) => {
              const tone =
                q.tone === "rose"
                  ? "bg-rose text-rose-foreground"
                  : q.tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-foreground text-foreground bg-transparent";
              return (
                <Link
                  key={q.label}
                  to={q.to}
                  className={`rounded-3xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-lg ${tone}`}
                >
                  <div className="text-xs uppercase tracking-wide opacity-80">{q.tag}</div>
                  <div className="mt-2 text-xl sm:text-2xl md:text-3xl font-display font-bold">{q.label}</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">Find your way around.</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">Three doors into the hub. Pick whichever feels closest to what you need today.</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-3xl bg-card p-5 sm:p-7 border border-border hover:border-primary transition-all hover:-translate-y-1"
              >
                <div className="text-4xl">{f.emoji}</div>
                <h3 className="mt-4 text-xl sm:text-2xl font-bold text-primary">{f.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-foreground/70">{f.body}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-crimson group-hover:gap-2 transition-all">
                  Open <span aria-hidden>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stat strip */}
        <section className="mt-16 sm:mt-24 bg-primary text-primary-foreground py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4 text-center md:text-left">
            {[
              ["x+", "Neighbors served"],
              [`${Math.floor(resourceCount / 10) * 10}+`, "Local resources listed"],
              ["x", "Parks & trails"],
              ["100%", "Free to use"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl sm:text-5xl font-black text-rose">{n}</div>
                <div className="mt-1 text-xs sm:text-sm uppercase tracking-wide opacity-80">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">Know a resource we're missing?</h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">This hub gets better with every neighbor who chips in. Suggest a service, event, or correction.</p>
          <Link to="/about" className="mt-8 inline-flex items-center rounded-full bg-crimson px-7 py-3 font-semibold text-crimson-foreground hover:opacity-90 transition">
            Get in touch
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
