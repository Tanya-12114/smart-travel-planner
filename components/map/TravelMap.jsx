"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's broken default icon paths in Next.js / webpack
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

// Real-world lat/lng keyed by destination id
const DEST_COORDS = {
  "tokyo":     [35.6762, 139.6503],
  "santorini": [36.3932, 25.4615],
  "patagonia": [-50.9423, -73.4068],
  "marrakech": [31.6295, -7.9811],
  "kyoto":     [35.0116, 135.7681],
  "reykjavik": [64.1466, -21.9426],
  "bali":      [-8.3405, 115.0920],
  "new-york":  [40.7128, -74.0060],
};

/**
 * Accepts either:
 *  - pins: array of destination objects (from DESTINATIONS) with an `id` field
 *  - trips: raw trip objects (fallback — tries to match destination name to coords)
 */
export default function TravelMap({ trips = [], pins = [] }) {
  // Build valid markers — skip any with missing coords
  const markers = pins.length
    ? pins
        .map((p) => {
          const coords = DEST_COORDS[p.id];
          if (!coords) return null;
          return { coords, label: p.name, sub: p.country, emoji: p.emoji };
        })
        .filter(Boolean)
    : trips
        .map((t) => {
          // Find matching dest by destination string
          const key = Object.keys(DEST_COORDS).find((k) =>
            t.destination?.toLowerCase().includes(k.replace("-", " "))
          );
          const coords = key ? DEST_COORDS[key] : null;
          if (!coords) return null;
          return { coords, label: t.title || t.name, sub: t.destination };
        })
        .filter(Boolean);

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <FixLeafletIcons />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.coords}>
          <Popup>
            <strong>{m.emoji} {m.label}</strong>
            {m.sub && <><br /><span style={{ color: "#7a7060", fontSize: "0.8em" }}>{m.sub}</span></>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}