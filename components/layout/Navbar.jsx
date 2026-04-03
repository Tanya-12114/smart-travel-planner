"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

// --- SVG Icon Components ---

function DiscoverIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ItineraryIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function BudgetIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function WeatherIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function MapIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function SignOutIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// --- Nav Items ---

const NAV_ITEMS = [
  { href: "/",          label: "Discover",  Icon: DiscoverIcon  },
  { href: "/itinerary", label: "Itinerary", Icon: ItineraryIcon },
  { href: "/budget",    label: "Budget",    Icon: BudgetIcon    },
  { href: "/weather",   label: "Weather",   Icon: WeatherIcon   },
  { href: "/map",       label: "Map",       Icon: MapIcon       },
];

// --- Sidebar Component ---

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-ink flex flex-col z-40
                       border-r border-white/5 md:w-[60px] lg:w-[220px]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 md:px-0 md:py-5 md:flex md:justify-center lg:px-6 lg:py-6 lg:block">
        <span className="font-display text-lg font-semibold text-white tracking-tight md:hidden lg:block">
          Voyagr
        </span>
        <span className="hidden md:block lg:hidden font-display text-lg text-accent font-bold">V</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
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
              <Icon className="flex-shrink-0" />
              <span className="md:hidden lg:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info + logout — always visible */}
      <div className="px-3 py-4 border-t border-white/10">
        {user && (
          <div className="mb-3 px-1 md:hidden lg:block">
            <p className="font-ui text-sm font-semibold text-white/90 truncate">{user.name}</p>
            <p className="font-ui text-xs text-white/70 truncate mt-0.5">{user.email}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                     text-white/70 hover:text-white hover:bg-red-500/20
                     border border-white/10 hover:border-red-500/40
                     transition-all font-ui text-sm font-medium
                     md:justify-center lg:justify-start"
        >
          <SignOutIcon className="flex-shrink-0" />
          <span className="md:hidden lg:block">Sign out</span>
        </button>
      </div>
    </aside>
  );
}