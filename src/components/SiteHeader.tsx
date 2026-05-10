"use client";

import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/map", label: "Map" },
  { to: "/ai", label: "AI Help" },
  { to: "/events", label: "Events" },
  { to: "/civic", label: "Civic" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-primary grid place-items-center text-primary-foreground font-display font-black">
            r
          </span>
          <span className="font-display font-black text-xl tracking-tight text-primary">
            seattle.together
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{
                className: "px-3 py-2 rounded-full bg-primary text-primary-foreground",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-rose px-4 py-2 text-sm font-semibold text-rose-foreground hover:bg-crimson transition-colors"
          >
            Find help <span aria-hidden>&rarr;</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
              <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                Navigation
              </DropdownMenuLabel>
              {nav.map((n) => (
                <DropdownMenuItem key={n.to} asChild className="rounded-xl p-0">
                  <Link
                    to={n.to}
                    className="w-full rounded-xl px-3 py-2 font-medium text-foreground/80 hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl p-0 sm:hidden">
                <Link
                  to="/services"
                  className="w-full rounded-xl bg-rose px-3 py-2 font-semibold text-rose-foreground"
                >
                  Find help
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] text-sm">
        <div className="max-w-md">
          <div className="font-display font-black text-3xl text-primary">seattle.together</div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            A neighborly guide to services, events, and civic life in the Seattle area.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="md:justify-self-end">
          <div className="font-semibold text-foreground">Explore</div>
          <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 text-muted-foreground sm:grid-cols-3 md:grid-cols-2">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="inline-flex py-1 transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-5 text-sm leading-6 text-muted-foreground">
          Made with care by community members. Not affiliated with the City of Seattle.
        </div>
      </div>
    </footer>
  );
}
