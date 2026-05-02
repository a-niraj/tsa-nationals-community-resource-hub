import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/map", label: "Map" },
  { to: "/ai", label: "AI Help" },
  { to: "/events", label: "Events" },
  { to: "/civic", label: "Civic" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-primary grid place-items-center text-primary-foreground font-display font-black">r</span>
          <span className="font-display font-black text-xl tracking-tight text-primary">seattle.together</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: "px-3 py-2 rounded-full bg-primary text-primary-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/services"
          className="hidden sm:inline-flex items-center rounded-full bg-rose px-4 py-2 text-sm font-semibold text-rose-foreground hover:bg-crimson transition-colors"
        >
          Find help →
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-display font-black text-2xl text-primary">seattle.together</div>
          <p className="mt-2 text-muted-foreground max-w-xs">A neighborly guide to services, events, and civic life in the Seattle area.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Explore</div>
          <ul className="space-y-1 text-muted-foreground">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-foreground">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        Made with care by community members. Not affiliated with the City of Seattle.
      </div>
    </footer>
  );
}