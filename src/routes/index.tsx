import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/pictures/Space_Needle_with_skyline_and_Mount_Rainier_at_sunset,_2000_(3293292089).jpg";
import c1Img from "@/pictures/c1.jpeg";
import c2Img from "@/pictures/c2.jpeg";
import c3Img from "@/pictures/c3.jpeg";
import c4Img from "@/pictures/c4.jpeg";
import seattleImg from "@/pictures/cSeattle.jpg";
import bellevueImg from "@/pictures/cBellevue.jpg";
import kirklandImg from "@/pictures/cKirkland.jpeg";
import redmondImg from "@/pictures/CRedmond.jpg";
import woodinvilleImg from "@/pictures/cWoodinville.jpeg";
import tukwilaImg from "@/pictures/cTukwila.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { getResources } from "@/api/public";

const carouselSlides = [
  { img: seattleImg, city: "Seattle", caption: "Downtown skyline from Puget Sound" },
  { img: redmondImg, city: "Redmond", caption: "Eastside parks and river trails" },
  { img: bellevueImg, city: "Bellevue", caption: "Lakeside walkable downtown" },
  { img: kirklandImg, city: "Kirkland", caption: "On the shore of Lake Washington" },
  { img: woodinvilleImg, city: "Woodinville", caption: "Wine country, hiding in the suburbs" },
  { img: tukwilaImg, city: "Tukwila", caption: "Just south of Seattle near the airport" },
] as const;

const heroSlides = [
  { img: heroImg, alt: "Space Needle and Seattle skyline with Mount Rainier at sunset" },
  { img: c1Img, alt: "Cascade mountains and evergreen meadow on a sunny day" },
  { img: c2Img, alt: "Deception Pass Bridge above the strait" },
  { img: c3Img, alt: "Volunteers packing bags at a community food drive" },
  { img: c4Img, alt: "Caregiver helping seniors with crafts at a community center" },
] as const;

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-2 sm:mx-0 min-w-0">
      <div className="absolute inset-0 -translate-x-3 -translate-y-3 sm:-translate-x-4 sm:-translate-y-4 rounded-[2rem] bg-sage" />
      <div className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-[2rem] bg-rose" />
      <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3]">
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to hero slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary-foreground" : "w-2 bg-primary-foreground/50 hover:bg-primary-foreground/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % carouselSlides.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + carouselSlides.length) % carouselSlides.length);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">Around the area.</h2>
          <p className="text-muted-foreground mt-2 max-w-xl">A quick look at the cities we cover.</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-md">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
          {carouselSlides.map((s, i) => (
            <img
              key={s.city}
              src={s.img}
              alt={`${s.city}: ${s.caption}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 sm:p-6 text-primary-foreground">
            <div className="font-display text-2xl sm:text-3xl font-black">
              {carouselSlides[index].city}
            </div>
            <div className="text-sm sm:text-base opacity-90">{carouselSlides[index].caption}</div>
          </div>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 text-foreground backdrop-blur grid place-items-center hover:bg-background transition"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 text-foreground backdrop-blur grid place-items-center hover:bg-background transition"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {carouselSlides.map((s, i) => (
          <button
            key={s.city}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}: ${s.city}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

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
            <HeroCarousel />
          </div>
        </section>

        {}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {quickLinks.map((q, i) => {
              const tone =
                q.tone === "rose"
                  ? "bg-rose text-rose-foreground"
                  : q.tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-foreground text-foreground bg-transparent";
              return (
                <Reveal key={q.label} delay={i * 100} direction="up">
                  <Link
                    to={q.to}
                    className={`block rounded-3xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-lg ${tone}`}
                  >
                    <div className="text-xs uppercase tracking-wide opacity-80">{q.tag}</div>
                    <div className="mt-2 text-xl sm:text-2xl md:text-3xl font-display font-bold">{q.label}</div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
          <HomeCarousel />
        </Reveal>

        {/* Featured */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">Find your way around.</h2>
                <p className="text-muted-foreground mt-2 max-w-xl">Three doors into the hub. Pick whichever feels closest to what you need today.</p>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
                <Link
                  to={f.to}
                  className="group block h-full rounded-3xl bg-card p-5 sm:p-7 border border-border hover:border-primary transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl">{f.emoji}</div>
                  <h3 className="mt-4 text-xl sm:text-2xl font-bold text-primary">{f.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-foreground/70">{f.body}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-crimson group-hover:gap-2 transition-all">
                    Open <span aria-hidden>→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stat strip */}
        <section className="mt-16 sm:mt-24 bg-primary text-primary-foreground py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4 text-center md:text-left">
            {[
              ["50+", "Neighbors served"],
              [`${Math.floor(resourceCount / 10) * 10}+`, "Local resources listed"],
              ["20+", "Parks & trails"],
              ["100%", "Free to use"],
            ].map(([n, l], i) => (
              <Reveal key={l} delay={i * 120}>
                <div>
                  <div className="font-display text-4xl sm:text-5xl font-black text-rose">{n}</div>
                  <div className="mt-1 text-xs sm:text-sm uppercase tracking-wide opacity-80">{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">Know a resource we're missing?</h2>
            <p className="mt-4 text-foreground/70 max-w-xl mx-auto">This hub gets better with every neighbor who chips in. Suggest a service, event, or correction.</p>
            <Link to="/about" className="mt-8 inline-flex items-center rounded-full bg-crimson px-7 py-3 font-semibold text-crimson-foreground hover:opacity-90 transition">
              Get in touch
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
