// Simple card used on other pages — no animated icons needed here
export default function WeatherCard({ data }) {
  const iconMap = { "☀️":"☀️", "🌤️":"🌤️", "⛅":"⛅", "🌧️":"🌧️", "🌬️":"🌬️" };
  return (
    <div className="bg-ink rounded-xl p-6 flex items-center gap-6">
      <span className="text-5xl">{iconMap[data.icon] || "🌤️"}</span>
      <div>
        <p className="eyebrow mb-1">{data.city}</p>
        <p className="font-display text-4xl font-black text-blue-300 tracking-tight">
          {data.temp}°C
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mt-1">
          {data.description}
        </p>
        <p className="font-ui text-xs text-white/40 mt-2">Humidity: {data.humidity}%</p>
      </div>
    </div>
  );
}