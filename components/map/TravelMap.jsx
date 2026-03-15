"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Fix Leaflet icon paths in Next.js ─────────────────────────
function FixLeafletIcons() {
  const map = useMap();
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, [map]);
  return null;
}

// ── Custom icons ───────────────────────────────────────────────
const originIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#2563eb;border:3px solid white;
    box-shadow:0 0 0 3px rgba(37,99,235,0.3);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:12px;height:12px;border-radius:50%;
    background:#f59e0b;border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// ── Great-circle arc points (intermediate lat/lon) ─────────────
// Generates N intermediate points along the great circle between two coords
function greatCirclePoints(lat1, lon1, lat2, lon2, steps = 60) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;

  const φ1 = toRad(lat1), λ1 = toRad(lon1);
  const φ2 = toRad(lat2), λ2 = toRad(lon2);

  // Central angle
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((φ2 - φ1) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
  ));

  if (d < 0.001) return [[lat1, lon1], [lat2, lon2]];

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    points.push([toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), toDeg(Math.atan2(y, x))]);
  }
  return points;
}

// ── Component that draws arcs using Leaflet polylines ─────────
function RouteArcs({ origin, destinations }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!origin || !destinations.length) return;

    // Remove old arcs
    if (layerRef.current) {
      layerRef.current.forEach((l) => map.removeLayer(l));
    }

    const layers = [];

    destinations.forEach((dest, i) => {
      const points = greatCirclePoints(
        origin[0], origin[1],
        dest.lat, dest.lng
      );

      // Dashed background line (white/faint)
      const shadow = L.polyline(points, {
        color: "rgba(255,255,255,0.15)",
        weight: 3,
        dashArray: "6 6",
        interactive: false,
      }).addTo(map);

      // Colored arc line
      const arc = L.polyline(points, {
        color: "#2563eb",
        weight: 2,
        opacity: 0.75,
        dashArray: "8 5",
        interactive: false,
      }).addTo(map);

      // Animated plane icon at midpoint
      const mid = points[Math.floor(points.length / 2)];
      const next = points[Math.floor(points.length / 2) + 1];
      const angle = Math.atan2(
        next[1] - mid[1],
        next[0] - mid[0]
      ) * (180 / Math.PI);

      const plane = L.marker(mid, {
        icon: L.divIcon({
          className: "",
          html: `<div style="
            font-size:16px;
            transform:rotate(${angle}deg);
            filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));
          ">✈</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
        interactive: false,
      }).addTo(map);

      layers.push(shadow, arc, plane);
    });

    layerRef.current = layers;

    // Auto-fit map to show origin + all destinations
    const allPoints = [
      origin,
      ...destinations.map((d) => [d.lat, d.lng]),
    ];
    map.fitBounds(L.latLngBounds(allPoints), { padding: [60, 60] });

    return () => {
      layers.forEach((l) => map.removeLayer(l));
    };
  }, [origin, destinations, map]);

  return null;
}

// ── Main export ────────────────────────────────────────────────
export default function TravelMap({ trips = [], userLocation = null }) {
  const markers = trips.filter((t) => t.lat != null && t.lng != null);

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <FixLeafletIcons />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Draw arcs from user location to each destination */}
      {userLocation && markers.length > 0 && (
        <RouteArcs origin={userLocation} destinations={markers} />
      )}

      {/* User location marker */}
      {userLocation && (
        <Marker position={userLocation} icon={originIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {/* Destination markers */}
      {markers.map((t) => (
        <Marker key={t._id} position={[t.lat, t.lng]} icon={destIcon}>
          <Popup>
            <strong style={{ color: "#0f1117" }}>{t.destination || t.title}</strong>
            {t.days?.length > 0 && (
              <>
                <br />
                <span style={{ color: "#6b7280", fontSize: "0.8em" }}>
                  {t.days.length} day{t.days.length !== 1 ? "s" : ""} planned
                </span>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}