"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

const NAV_ITEMS = [
  { href: "/",          label: "Discover",  icon: "✦" },
  { href: "/itinerary", label: "Itinerary", icon: "◈" },
  { href: "/budget",    label: "Budget",    icon: "◎" },
  { href: "/weather",   label: "Weather",   icon: "◐" },
  { href: "/map",       label: "Map",       icon: "◉" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Hide sidebar on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-ink flex flex-col z-40
                       border-r border-white/5 md:w-[60px] lg:w-[220px]">
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
            <Link key={href} href={href}
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

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-white/10">
        {user && (
          <>
            <div className="mb-3 md:hidden lg:block">
              <p className="font-ui text-xs font-semibold text-white/80 truncate">{user.name}</p>
              <p className="font-mono text-[0.58rem] text-white/30 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                         text-white/40 hover:text-white hover:bg-white/5
                         transition-all font-ui text-xs font-medium
                         md:justify-center lg:justify-start"
            >
              <span className="text-sm">→</span>
              <span className="md:hidden lg:block">Sign out</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}