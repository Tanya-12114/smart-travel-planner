"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import { weatherApi } from "@/lib/api";

/* ─── Animated SVG Weather Icons ─────────────────────── */

const iconStyles = `
  @keyframes spin-slow  { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
  @keyframes pulse-sun  { 0%,100% { opacity:1 } 50% { opacity:.7 } }
  @keyframes float-cld  { 0%,100% { transform:translateX(0) } 50% { transform:translateX(3px) } }
  @keyframes rain-drop  { 0% { transform:translateY(-4px); opacity:0 }
                          60% { opacity:1 } 100% { transform:translateY(14px); opacity:0 } }
  @keyframes bolt-flash { 0%,90%,100% { opacity:1 } 92%,98% { opacity:.15 } }
  @keyframes snow-fall  { 0% { transform:translateY(-4px) rotate(0deg); opacity:0 }
                          50% { opacity:1 } 100% { transform:translateY(14px) rotate(180deg); opacity:0 } }
  @keyframes wind-blow  { 0%,100% { stroke-dashoffset:0; opacity:.9 }
                          50% { stroke-dashoffset:-12; opacity:.4 } }
  @keyframes fog-drift  { 0%,100% { opacity:.8; transform:translateX(0) }
                          50% { opacity:.35; transform:translateX(5px) } }
`;

function SunnyIcon({ lg }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <g style={{ transformOrigin:"32px 32px", animation:"spin-slow 12s linear infinite" }}
         stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
        {[[32,4,32,10],[32,54,32,60],[4,32,10,32],[54,32,60,32],
          [11.5,11.5,15.9,15.9],[48.1,48.1,52.5,52.5],[52.5,11.5,48.1,15.9],[15.9,48.1,11.5,52.5]]
          .map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
      </g>
      <circle style={{ animation:"pulse-sun 3s ease-in-out infinite" }}
              cx="32" cy="32" r="14" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      <circle cx="32" cy="32" r="10" fill="#FDE68A"/>
    </svg>
  );
}

function PartlyCloudyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <g style={{ animation:"pulse-sun 4s ease-in-out infinite" }}>
        <circle cx="24" cy="22" r="11" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
        <circle cx="24" cy="22" r="7" fill="#FDE68A"/>
      </g>
      <g style={{ animation:"float-cld 4s ease-in-out infinite" }}>
        <ellipse cx="38" cy="38" rx="16" ry="11" fill="white" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="26" cy="40" rx="11" ry="9"  fill="white" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="34" cy="32" rx="10" ry="9"  fill="white" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="38" cy="40" rx="16" ry="9"  fill="white"/>
        <ellipse cx="26" cy="42" rx="11" ry="7"  fill="white"/>
      </g>
    </svg>
  );
}

function CloudyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <g style={{ animation:"float-cld 5s ease-in-out infinite", opacity:.45 }}>
        <ellipse cx="42" cy="30" rx="15" ry="10" fill="#94A3B8"/>
        <ellipse cx="30" cy="33" rx="10" ry="8"  fill="#94A3B8"/>
        <ellipse cx="42" cy="36" rx="15" ry="8"  fill="#94A3B8"/>
      </g>
      <g style={{ animation:"float-cld 4s ease-in-out infinite .5s" }}>
        <ellipse cx="36" cy="40" rx="18" ry="12" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="22" cy="43" rx="12" ry="10" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="32" cy="33" rx="13" ry="11" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
        <ellipse cx="36" cy="43" rx="18" ry="9"  fill="#E2E8F0"/>
        <ellipse cx="22" cy="46" rx="12" ry="7"  fill="#E2E8F0"/>
      </g>
    </svg>
  );
}

function RainyIcon() {
  const drops = [[22,44,20,52,0],[30,44,28,52,.3],[38,44,36,52,.6],[46,44,44,52,.15],[26,47,24,55,.45]];
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <ellipse cx="36" cy="28" rx="18" ry="12" fill="#64748B" stroke="#475569" strokeWidth="1.5"/>
      <ellipse cx="22" cy="31" rx="12" ry="10" fill="#64748B" stroke="#475569" strokeWidth="1.5"/>
      <ellipse cx="32" cy="22" rx="13" ry="11" fill="#64748B" stroke="#475569" strokeWidth="1.5"/>
      <ellipse cx="36" cy="33" rx="18" ry="9"  fill="#64748B"/>
      <ellipse cx="22" cy="35" rx="12" ry="7"  fill="#64748B"/>
      {drops.map(([x1,y1,x2,y2,delay],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i%2===0?"#60A5FA":"#93C5FD"} strokeWidth="2" strokeLinecap="round"
              style={{ animation:`rain-drop 1.2s ease-in infinite ${delay}s` }}/>
      ))}
    </svg>
  );
}

function StormyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <ellipse cx="36" cy="24" rx="18" ry="12" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <ellipse cx="22" cy="27" rx="12" ry="10" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <ellipse cx="32" cy="18" rx="13" ry="11" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <ellipse cx="36" cy="29" rx="18" ry="9"  fill="#475569"/>
      <ellipse cx="22" cy="31" rx="12" ry="7"  fill="#475569"/>
      <polygon points="34,36 29,48 33,48 28,60 38,44 34,44" fill="#FDE047" stroke="#EAB308" strokeWidth=".5"
               style={{ animation:"bolt-flash 3s ease-in-out infinite" }}/>
    </svg>
  );
}

function SnowyIcon() {
  const flakes = [[22,46,0],[32,44,.4],[42,46,.8],[27,52,1.2]];
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      <ellipse cx="36" cy="26" rx="18" ry="12" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5"/>
      <ellipse cx="22" cy="29" rx="12" ry="10" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5"/>
      <ellipse cx="32" cy="20" rx="13" ry="11" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5"/>
      <ellipse cx="36" cy="31" rx="18" ry="9"  fill="#94A3B8"/>
      <ellipse cx="22" cy="33" rx="12" ry="7"  fill="#94A3B8"/>
      {flakes.map(([cx,cy,delay],i) => (
        <g key={i} style={{ animation:`snow-fall 2s ease-in infinite ${delay}s` }}>
          <circle cx={cx} cy={cy} r={i===3?2:2.5} fill="#BAE6FD"/>
          <line x1={cx} y1={cy-2.5} x2={cx} y2={cy+2.5} stroke="#7DD3FC" strokeWidth="1"/>
          <line x1={cx-2.5} y1={cy-1} x2={cx+2.5} y2={cy+1} stroke="#7DD3FC" strokeWidth="1"/>
          <line x1={cx-2.5} y1={cy+1} x2={cx+2.5} y2={cy-1} stroke="#7DD3FC" strokeWidth="1"/>
        </g>
      ))}
    </svg>
  );
}

function WindyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      {[["M8 22 Q20 16 32 22 Q44 28 56 22",30,10,0,"#94A3B8",3],
        ["M8 32 Q22 26 36 32 Q46 36 54 30",24,8,.3,"#64748B",2.5],
        ["M12 42 Q24 36 36 42 Q46 46 52 42",18,6,.6,"#94A3B8",2]
       ].map(([d,da,dg,delay,color,sw],i) => (
        <path key={i} d={d} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"
              strokeDasharray={`${da} ${dg}`}
              style={{ animation:`wind-blow 2s ease-in-out infinite ${delay}s` }}/>
      ))}
    </svg>
  );
}

function FoggyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{iconStyles}</style>
      {[[10,20,54,20,"#CBD5E1",4,0],[14,30,50,30,"#94A3B8",4,.5],
        [8,40,56,40,"#CBD5E1",4,1],[16,50,48,50,"#94A3B8",3,1.5]].map(([x1,y1,x2,y2,color,sw,delay],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} strokeLinecap="round"
              style={{ animation:`fog-drift 3s ease-in-out infinite ${delay}s` }}/>
      ))}
    </svg>
  );
}

const ICON_MAP = {
  sunny: SunnyIcon, "partly-cloudy": PartlyCloudyIcon, cloudy: CloudyIcon,
  rainy: RainyIcon, stormy: StormyIcon, snowy: SnowyIcon, windy: WindyIcon, foggy: FoggyIcon,
};

function resolveType(s = "") {
  const t = s.toLowerCase();
  if (/snow|sleet|hail/.test(t))                      return "snowy";
  if (/storm|thunder|lightning/.test(t))              return "stormy";
  if (/rain|drizzl|shower/.test(t))                   return "rainy";
  if (/fog|mist|haze/.test(t))                        return "foggy";
  if (/wind|breezy|gust/.test(t))                     return "windy";
  if (/overcast|cloudy/.test(t) && !/partly/.test(t)) return "cloudy";
  if (/partly|mostly sunny|⛅|🌤/.test(t))            return "partly-cloudy";
  if (/clear|sunny|hot|☀/.test(t))                    return "sunny";
  return "partly-cloudy";
}

function WeatherIcon({ type, size }) {
  const Icon = ICON_MAP[type] || PartlyCloudyIcon;
  return (
    <div className={size === "lg" ? "w-20 h-20" : "w-10 h-10"}>
      <Icon />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────── */

export default function WeatherPage() {
  const [city, setCity]     = useState("");
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    if (!city.trim()) return;
    setLoading(true);
    try   { setData(await weatherApi.get(city)); }
    catch { setData(null); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-12 md:p-6 lg:p-12 min-h-screen">
      <PageHeader eyebrow="Know before you go" title="Weather <em>Forecast</em>" />

      {/* Search */}
      <div className="flex gap-3 max-w-md mb-10">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="City or destination…"
          className="input-base flex-1"
        />
        <button onClick={lookup} disabled={loading} className="btn-primary">
          {loading ? "…" : "Check"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {data ? (
          <motion.div key={data.city} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>

            {/* Hero card */}
            <div className="bg-ink rounded-2xl p-8 mb-5 flex items-center gap-10 flex-wrap">
              <WeatherIcon type={resolveType(data.current.icon + " " + data.current.desc)} size="lg" />
              <div>
                <h2 className="font-display text-3xl font-light text-white mb-1">{data.city}</h2>
                <p className="font-display text-6xl font-black text-blue-300 tracking-tight">
                  {data.current.temp}°C
                </p>
                <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mt-2">
                  {data.current.desc}
                </p>
              </div>
              <div className="ml-auto flex flex-col gap-2">
                {[["Humidity", data.current.humidity+"%"],["Wind",data.current.wind],
                  ["Visibility",data.current.visibility],["Feels like",data.current.feelsLike+"°C"]
                ].map(([k,v]) => (
                  <div key={k} className="flex gap-3 font-mono text-[0.7rem]">
                    <span className="text-muted">{k}</span>
                    <span className="text-white/60">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {data.forecast.map((day, i) => (
                <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white border border-sand rounded-lg px-2 py-4 text-center"
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-2">{day.day}</p>
                  <div className="flex justify-center mb-2">
                    <WeatherIcon type={resolveType(day.icon)} size="sm" />
                  </div>
                  <p className="font-display text-lg font-bold text-ink">{day.temp}°</p>
                </motion.div>
              ))}
            </div>

          </motion.div>
        ) : (
          !loading && (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="text-center py-24 text-muted"
            >
              <p className="text-5xl mb-4">◐</p>
              <p className="font-display italic text-xl">Enter a destination to see its forecast.</p>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Quick picks */}
      {!data && (
        <div className="mt-16">
          <p className="eyebrow mb-4">Popular destinations</p>
          <div className="flex flex-wrap gap-2">
            {["Tokyo","Santorini","Bali","Reykjavík","Marrakech","New York","Paris","Dubai"].map((c) => (
              <button key={c}
                onClick={() => { setCity(c); setTimeout(lookup, 0); }}
                className="tag-pill cursor-pointer hover:bg-accent hover:text-white transition-colors py-1.5 px-3 text-xs"
              >{c}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}