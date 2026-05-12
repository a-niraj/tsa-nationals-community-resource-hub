"use client";

import { useEffect, useState } from "react";
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
  { to: "/services", label: "Resources" },
  { to: "/map", label: "Map" },
  { to: "/ai", label: "AI Help" },
  { to: "/events", label: "Events" },
  { to: "/civic", label: "City Essentials" },
  { to: "/about", label: "About" },
] as const;

const submitLink = { to: "/submit", label: "Submit a New Resource" } as const;
const footerNav = [...nav, submitLink] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-primary-foreground/10 transition-colors duration-200 ${
        scrolled ? "bg-primary/75 backdrop-blur" : "bg-primary"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-10 h-10 rounded-full bg-primary-foreground grid place-items-center text-primary font-display font-black text-lg">
            s
          </span>
          <span className="font-display font-black text-xl tracking-tight text-primary-foreground">
            seattle.together
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-full text-primary-foreground/75 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              activeProps={{
                className: "px-3 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to={submitLink.to}
            className="hidden sm:inline-flex items-center rounded-lg bg-sage px-5 py-2.5 text-sm font-semibold text-sage-foreground shadow-md transition hover:bg-sage/90 hover:shadow-lg"
            activeProps={{
              className:
                "hidden sm:inline-flex items-center rounded-lg bg-sage/80 px-5 py-2.5 text-sm font-semibold text-sage-foreground shadow-inner",
            }}
          >
            {submitLink.label}
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40"
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
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuItem asChild className="rounded-xl p-0 sm:hidden">
                <Link
                  to={submitLink.to}
                  className="w-full rounded-lg bg-sage px-3 py-2 font-semibold text-sage-foreground shadow-md"
                >
                  {submitLink.label}
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
    <footer className="mt-24 bg-card">
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-16 sm:h-20 text-card"
      >
        <rect width="1200" height="80" fill="var(--background)" />
        <g fill="oklch(0.3 0.05 190)">
          {Array.from({ length: 40 }).map((_, i) => {
            const cx = i * 32 + 8;
            const h = 38 + ((i * 13) % 28);
            const w = 22 + (i % 3) * 4;
            const baseY = 80;
            return (
              <polygon
                key={cx}
                points={`${cx},${baseY - h} ${cx - w / 2},${baseY} ${cx + w / 2},${baseY}`}
              />
            );
          })}
        </g>
      </svg>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] text-sm">
        <div className="max-w-md">
          <div className="font-display font-black text-3xl text-primary">seattle.together</div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            A neighborly guide to services, events, and civic life in the Seattle area.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="md:justify-self-end">
          <div className="font-semibold text-foreground">Explore</div>
          <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 text-muted-foreground sm:grid-cols-3 md:grid-cols-2">
            {footerNav.map((n) => (
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-sm leading-6 text-muted-foreground">
          Made with care by community members. Not affiliated with the City of Seattle.
        </div>
      </div>
    </footer>
  );
}
