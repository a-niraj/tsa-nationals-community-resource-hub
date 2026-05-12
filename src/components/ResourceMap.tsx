import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Resource } from "@/lib/types";
import { getCityFromAddress } from "@/lib/resource-city";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export function ResourceMap({ resources }: { resources: Resource[] }) {
  const mappable = resources.filter(
    (r): r is Resource & { lat: number; lng: number } =>
      typeof r.lat === "number" && typeof r.lng === "number",
  );

  if (mappable.length === 0) {
    return <p className="text-center text-foreground/60 py-8">No resources with locations yet.</p>;
  }

  const center = mappable.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.lat / mappable.length,
      lng: acc.lng + loc.lng / mappable.length,
    }),
    { lat: 0, lng: 0 },
  );
  const zoom = mappable.length === 1 ? 13 : 11;

  return (
    <div className="relative z-0 w-full max-w-4xl mx-auto my-8 min-w-0 isolate">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-[45vh] min-h-[280px] max-h-[500px] sm:h-[60vh] w-full rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {mappable.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {getCityFromAddress(loc.address ?? "")}
              <br />
              {loc.address}
              <br />
              {loc.phone && <span>📞 {loc.phone}</span>}
              <br />
              {loc.website && (() => {
                const cleaned = loc.website.replace(/\s+/g, "").trim();
                const href = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
                const label = cleaned.replace(/^https?:\/\//i, "").replace(/\/$/, "");
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🌐 {label}
                  </a>
                );
              })()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
