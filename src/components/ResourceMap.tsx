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
    <div className="w-full max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-primary">
        Find a Community Resource Nearby
      </h2>

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
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
              {loc.website && (
                <a
                  href={`https://${loc.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  🌐 {loc.website}
                </a>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
