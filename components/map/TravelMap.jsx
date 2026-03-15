"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's broken default icon in Next.js / webpack
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

/**
 * trips — array of trip objects, each with:
 *   { _id, title, destination, lat, lng }
 * lat/lng are saved at trip creation from Nominatim coordinates
 */
export default function TravelMap({ trips = [] }) {
  // Filter to only valid coordinates (already done in parent but belt+suspenders)
  const markers = trips.filter((t) => t.lat != null && t.lng != null);

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <FixLeafletIcons />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      {markers.map((t) => (
        <Marker key={t._id} position={[t.lat, t.lng]}>
          <Popup>
            <strong>{t.destination || t.title}</strong>
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