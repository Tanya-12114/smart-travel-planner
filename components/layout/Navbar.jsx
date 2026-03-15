"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",          label: "Discover",  icon: "✦" },
  { href: "/itinerary", label: "Itinerary", icon: "◈" },
  { href: "/budget",    label: "Budget",    icon: "◎" },
  { href: "/weather",   label: "Weather",   icon: "◐" },
  { href: "/map",       label: "Map",       icon: "◉" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] bg-ink flex flex-col z-40
                 border-r border-white/5 md:w-[60px] lg:w-[220px]"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 md:px-0 md:py-5 md:flex md:justify-center lg:px-6 lg:py-6 lg:block">
        <span className="font-display text-lg font-bold text-white tracking-tight md:hidden lg:block">
          Voyagr
        </span>
        <span className="hidden md:block lg:hidden font-display text-lg text-accent font-bold">V</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-ui font-medium
                          md:justify-center md:px-2 lg:justify-start lg:px-3
                          ${active
                            ? "bg-accent text-white"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                          }`}
            >
              <span className="text-sm leading-none flex-shrink-0">{icon}</span>
              <span className="md:hidden lg:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10 md:px-2 lg:px-5">
        <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/20 leading-relaxed md:hidden lg:block">
          Smart Travel<br />Planner v1.0
        </p>
      </div>
    </aside>
  );
}