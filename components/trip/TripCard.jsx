export default function TripCard({ trip, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-cream border border-sand rounded-xl p-5 card-hover cursor-pointer group"
    >
      <p className="eyebrow mb-2">{trip.destination || "No destination"}</p>

      <h3 className="font-display text-xl font-semibold text-ink mb-1 group-hover:text-accent transition-colors">
        {trip.title || trip.name}
      </h3>

      {(trip.startDate || trip.endDate) && (
        <p className="font-mono text-[0.65rem] text-muted mt-2 tracking-wide">
          {trip.startDate} {trip.startDate && trip.endDate && "→"} {trip.endDate}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted/60">
          {(trip.days?.length ?? 0)} day{trip.days?.length !== 1 ? "s" : ""}
        </span>
        <span className="font-ui text-xs text-accent group-hover:translate-x-1 transition-transform inline-block">
          View →
        </span>
      </div>
    </div>
  );
}