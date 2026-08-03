// components/ui/Icons.jsx
// Shared SVG icon set — replaces all emoji usage across the project

export function FlightIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-1 0-1.5.5-3.5 2.5L11 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.5.7c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.7c.3.4.8.5 1.1.3l.7-.5c.4-.3.6-.8.5-1.3z"/>
    </svg>
  );
}

export function HotelIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V8l9-6 9 6v14"/>
      <path d="M9 22V12h6v10"/>
      <rect x="9" y="6" width="2" height="2"/><rect x="13" y="6" width="2" height="2"/>
      <rect x="9" y="10" width="2" height="2"/><rect x="13" y="10" width="2" height="2"/>
    </svg>
  );
}

export function FoodIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  );
}

export function ActivitiesIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  );
}

export function TransportIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      <line x1="6" y1="11" x2="6" y2="11" strokeWidth="3"/>
      <line x1="18" y1="11" x2="18" y2="11" strokeWidth="3"/>
    </svg>
  );
}

export function MiscIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/>
      <circle cx="4" cy="12" r="2"/>
      <circle cx="20" cy="12" r="2"/>
    </svg>
  );
}

export function WarningIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/>
    </svg>
  );
}

export function GlobeIcon({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

export function MapPinIcon({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export function CheckIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function CurrencyIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

export function CalendarIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export function LocationIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

// Map of category key → icon component (for use in budget page)
export const CATEGORY_ICONS = {
  flights:    FlightIcon,
  hotels:     HotelIcon,
  food:       FoodIcon,
  activities: ActivitiesIcon,
  transport:  TransportIcon,
  misc:       MiscIcon,
};