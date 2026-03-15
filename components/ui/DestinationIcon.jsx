/**
 * Hand-crafted SVG landmark illustrations per destination.
 * Each icon is a small scene — not an emoji, not a generic glyph.
 */

const icons = {

  tokyo: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky */}
      <rect width="64" height="64" rx="10" fill="#f0f4ff"/>
      {/* Mt Fuji */}
      <polygon points="32,10 18,38 46,38" fill="#2563eb" opacity="0.15"/>
      <polygon points="32,10 27,22 37,22" fill="white" opacity="0.9"/>
      {/* Tokyo Tower legs */}
      <rect x="28" y="38" width="8" height="18" rx="1" fill="#2563eb" opacity="0.85"/>
      <polygon points="26,38 38,38 35,24 29,24" fill="#2563eb" opacity="0.9"/>
      {/* Observation deck */}
      <rect x="27" y="30" width="10" height="4" rx="1" fill="#2563eb"/>
      {/* Antenna */}
      <line x1="32" y1="24" x2="32" y2="14" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Ground */}
      <rect x="8" y="54" width="48" height="2" rx="1" fill="#e8dfc8"/>
    </svg>
  ),

  santorini: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#eef4fb"/>
      {/* Sea */}
      <rect x="0" y="44" width="64" height="20" rx="0" fill="#b8d4e8" opacity="0.5"/>
      {/* White building cluster */}
      <rect x="10" y="28" width="18" height="22" rx="3" fill="white" stroke="#e8dfc8" strokeWidth="1"/>
      <rect x="20" y="22" width="14" height="28" rx="3" fill="white" stroke="#e8dfc8" strokeWidth="1"/>
      <rect x="36" y="30" width="18" height="20" rx="3" fill="white" stroke="#e8dfc8" strokeWidth="1"/>
      {/* Blue domes */}
      <ellipse cx="19" cy="28" rx="9" ry="5" fill="#4a90d9"/>
      <ellipse cx="43" cy="30" rx="9" ry="5" fill="#4a90d9"/>
      {/* Windows */}
      <rect x="14" y="34" width="5" height="5" rx="1" fill="#b8d4e8"/>
      <rect x="39" y="36" width="5" height="5" rx="1" fill="#b8d4e8"/>
      {/* Sun */}
      <circle cx="52" cy="14" r="6" fill="#f5c842" opacity="0.8"/>
    </svg>
  ),

  patagonia: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#eaf4ef"/>
      {/* Sky gradient suggestion */}
      <rect x="0" y="0" width="64" height="36" rx="10" fill="#d4eaf8" opacity="0.5"/>
      {/* Mountains */}
      <polygon points="8,50 24,18 40,50" fill="#2d4a3e" opacity="0.85"/>
      <polygon points="22,50 36,24 50,50" fill="#4a7c68" opacity="0.9"/>
      <polygon points="38,50 50,30 62,50" fill="#2d4a3e" opacity="0.7"/>
      {/* Snow caps */}
      <polygon points="24,18 20,28 28,28" fill="white" opacity="0.95"/>
      <polygon points="36,24 33,32 39,32" fill="white" opacity="0.95"/>
      {/* Glacier lake */}
      <ellipse cx="20" cy="53" rx="12" ry="4" fill="#b8d4e8" opacity="0.7"/>
    </svg>
  ),

  marrakech: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#f0f4ff"/>
      {/* Main tower */}
      <rect x="22" y="18" width="20" height="36" rx="2" fill="#2563eb" opacity="0.8"/>
      {/* Arched windows */}
      <path d="M28 30 Q32 26 36 30 L36 36 L28 36 Z" fill="#f0f4ff" opacity="0.9"/>
      <path d="M28 42 Q32 38 36 42 L36 46 L28 46 Z" fill="#f0f4ff" opacity="0.9"/>
      {/* Top crenellations */}
      <rect x="22" y="14" width="4" height="6" rx="1" fill="#2563eb" opacity="0.8"/>
      <rect x="28" y="12" width="4" height="8" rx="1" fill="#2563eb" opacity="0.9"/>
      <rect x="34" y="14" width="4" height="6" rx="1" fill="#2563eb" opacity="0.8"/>
      {/* Crescent */}
      <path d="M32 8 Q36 8 36 12 Q33 10 30 12 Q30 8 32 8Z" fill="#c9a84c"/>
      {/* Ground buildings */}
      <rect x="8" y="40" width="14" height="14" rx="2" fill="#e8a87c" opacity="0.6"/>
      <rect x="42" y="38" width="14" height="16" rx="2" fill="#e8a87c" opacity="0.6"/>
      {/* Palm */}
      <line x1="12" y1="40" x2="12" y2="30" stroke="#2d4a3e" strokeWidth="1.5"/>
      <ellipse cx="12" cy="29" rx="5" ry="3" fill="#4a7c68" opacity="0.8"/>
    </svg>
  ),

  kyoto: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#f0f4ff"/>
      {/* Torii gate */}
      <rect x="10" y="42" width="4" height="18" rx="1" fill="#2563eb"/>
      <rect x="50" y="42" width="4" height="18" rx="1" fill="#2563eb"/>
      {/* Top beams */}
      <rect x="6" y="28" width="52" height="5" rx="2" fill="#2563eb"/>
      <rect x="10" y="34" width="44" height="4" rx="2" fill="#2563eb"/>
      {/* Curved ends on top beam */}
      <path d="M6 28 Q6 24 10 25" stroke="#2563eb" strokeWidth="3" fill="none"/>
      <path d="M58 28 Q58 24 54 25" stroke="#2563eb" strokeWidth="3" fill="none"/>
      {/* Cherry blossom tree */}
      <line x1="32" y1="60" x2="32" y2="40" stroke="#7a5c4a" strokeWidth="2"/>
      <circle cx="32" cy="34" r="10" fill="#f9c4c4" opacity="0.7"/>
      <circle cx="25" cy="36" r="7" fill="#f9b0b0" opacity="0.6"/>
      <circle cx="39" cy="36" r="7" fill="#f9b0b0" opacity="0.6"/>
    </svg>
  ),

  reykjavik: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#1a1a2e"/>
      {/* Aurora bands */}
      <path d="M0 20 Q16 12 32 18 Q48 24 64 16" stroke="#4a7c68" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M0 28 Q20 18 40 24 Q54 28 64 22" stroke="#6ec6a0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M0 34 Q16 26 32 32 Q50 38 64 30" stroke="#a0e8c8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.3"/>
      {/* Hallgrimskirkja church */}
      <polygon points="32,16 28,34 36,34" fill="white" opacity="0.95"/>
      <rect x="26" y="34" width="12" height="20" rx="1" fill="white" opacity="0.9"/>
      {/* Side wings */}
      <polygon points="26,42 18,52 26,52" fill="white" opacity="0.7"/>
      <polygon points="38,42 46,52 38,52" fill="white" opacity="0.7"/>
      {/* Stars */}
      <circle cx="12" cy="10" r="1" fill="white" opacity="0.8"/>
      <circle cx="52" cy="8" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="44" cy="14" r="0.8" fill="white" opacity="0.7"/>
    </svg>
  ),

  bali: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#eaf7f0"/>
      {/* Rice terraces */}
      <path d="M0 56 Q16 48 32 52 Q48 56 64 50 L64 64 L0 64 Z" fill="#4a7c68" opacity="0.4"/>
      <path d="M0 50 Q16 42 32 46 Q48 50 64 44 L64 56 L0 56 Z" fill="#4a7c68" opacity="0.5"/>
      <path d="M0 44 Q16 36 32 40 Q48 44 64 38 L64 50 L0 50 Z" fill="#2d4a3e" opacity="0.4"/>
      {/* Temple - Pura Ulun Danu style */}
      <rect x="26" y="32" width="12" height="16" rx="1" fill="#2563eb" opacity="0.7"/>
      {/* Tiered meru tower */}
      <polygon points="32,10 24,22 40,22" fill="#2563eb" opacity="0.9"/>
      <polygon points="32,16 26,26 38,26" fill="#2563eb" opacity="0.7"/>
      <polygon points="32,22 27,30 37,30" fill="#2563eb" opacity="0.6"/>
      {/* Lotus pond */}
      <ellipse cx="32" cy="52" rx="10" ry="4" fill="#b8d4e8" opacity="0.6"/>
      {/* Hibiscus */}
      <circle cx="10" cy="20" r="5" fill="#e85c7a" opacity="0.6"/>
      <circle cx="54" cy="24" r="4" fill="#e85c7a" opacity="0.5"/>
    </svg>
  ),

  "new-york": (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#1c2340"/>
      {/* Moon / night sky */}
      <circle cx="50" cy="14" r="6" fill="#f5e6b0" opacity="0.7"/>
      {/* Buildings skyline */}
      <rect x="4" y="32" width="8" height="30" rx="1" fill="#3a4a6b"/>
      <rect x="10" y="24" width="6" height="38" rx="1" fill="#4a5a7b"/>
      {/* Empire State */}
      <rect x="16" y="18" width="8" height="44" rx="1" fill="#5a6a8b"/>
      <rect x="18" y="12" width="4" height="10" rx="1" fill="#5a6a8b"/>
      <line x1="20" y1="6" x2="20" y2="12" stroke="#f5e6b0" strokeWidth="1.5" strokeLinecap="round"/>
      {/* More buildings */}
      <rect x="24" y="28" width="7" height="34" rx="1" fill="#3a4a6b"/>
      <rect x="30" y="22" width="9" height="40" rx="1" fill="#4a5a7b"/>
      <rect x="38" y="30" width="7" height="32" rx="1" fill="#3a4a6b"/>
      <rect x="44" y="20" width="8" height="42" rx="1" fill="#5a6a8b"/>
      <rect x="51" y="34" width="9" height="28" rx="1" fill="#3a4a6b"/>
      {/* Windows glow */}
      <rect x="18" y="26" width="2" height="2" rx="0.5" fill="#f5e6b0" opacity="0.8"/>
      <rect x="22" y="30" width="2" height="2" rx="0.5" fill="#f5e6b0" opacity="0.6"/>
      <rect x="32" y="28" width="2" height="2" rx="0.5" fill="#f5e6b0" opacity="0.7"/>
      <rect x="46" y="26" width="2" height="2" rx="0.5" fill="#f5e6b0" opacity="0.8"/>
      <rect x="12" y="30" width="2" height="2" rx="0.5" fill="#f5e6b0" opacity="0.6"/>
      {/* Water reflection */}
      <rect x="0" y="58" width="64" height="6" rx="0" fill="#2a3a5b" opacity="0.5"/>
    </svg>
  ),
};

export default function DestinationIcon({ id, className = "w-14 h-14" }) {
  return (
    <div className={className}>
      {icons[id] ?? (
        // Generic fallback — compass rose
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="10" fill="#f5f0e8"/>
          <circle cx="32" cy="32" r="18" stroke="#2563eb" strokeWidth="2" fill="none"/>
          <polygon points="32,14 29,30 35,30" fill="#2563eb"/>
          <polygon points="32,50 29,34 35,34" fill="#7a7060"/>
          <polygon points="14,32 30,29 30,35" fill="#7a7060"/>
          <polygon points="50,32 34,29 34,35" fill="#2563eb"/>
          <circle cx="32" cy="32" r="3" fill="#2563eb"/>
        </svg>
      )}
    </div>
  );
}