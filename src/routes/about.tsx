import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Seattle Together" },
      { name: "description", content: "Seattle Together is a neighbor-built community resource hub for the Seattle area." },
      { property: "og:title", content: "About Seattle Together" },
      { property: "og:description", content: "A neighborly project to make Seattle easier to navigate." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built by neighbors, for neighbors."
      intro="Seattle Together is an independent, volunteer-run hub that pulls together the best local services, events, and civic info in one friendly and accessible place."
    >
      <div className="grid gap-8 md:grid-cols-2 pb-16">
        <div className="rounded-3xl bg-card border border-border p-7">
          <h2 className="text-2xl font-bold text-primary">Why we made this</h2>
          <p className="mt-3 text-foreground/75">Seattle is full of incredible resources, but they're scattered across dozens of websites, PDFs, and bulletin boards. We wanted one warm, plainspoken place to point a neighbor when they ask "where do I start?"</p>
        </div>
        <div className="rounded-3xl bg-sage text-sage-foreground p-7">
          <h2 className="text-2xl font-bold">How to help</h2>
          <ul className="mt-3 space-y-2 text-foreground/80">
            <li>• Suggest a missing resource or correction</li>
            <li>• Share an event happening in your neighborhood</li>
            <li>• Volunteer to help us keep listings fresh</li>
          </ul>
        </div>
        <div className="md:col-span-2 rounded-3xl bg-primary text-primary-foreground p-8">
          <h2 className="text-3xl font-black">Get in touch</h2>
          <p className="mt-2 opacity-80 max-w-xl">Drop us a line and we'll get back within a few days. We read everything.</p>
          <form className="mt-6 grid gap-3 md:grid-cols-2 max-w-2xl">
            <input className="rounded-full bg-background/10 border border-background/20 px-4 py-3 placeholder:text-primary-foreground/60" placeholder="Your name" />
            <input className="rounded-full bg-background/10 border border-background/20 px-4 py-3 placeholder:text-primary-foreground/60" placeholder="Email" type="email" />
            <textarea rows={4} className="md:col-span-2 rounded-3xl bg-background/10 border border-background/20 px-4 py-3 placeholder:text-primary-foreground/60" placeholder="What's on your mind?" />
            <button type="button" className="md:col-span-2 justify-self-start rounded-full bg-rose px-6 py-3 font-semibold text-rose-foreground hover:bg-crimson transition">Send note</button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}