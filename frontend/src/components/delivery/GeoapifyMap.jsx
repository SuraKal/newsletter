import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { appClient } from "@/api/appClient";

// Marker tint per destination kind so the admin shipment maps separate the
// company delivery stops from the subscriber (reader) destinations.
const DOT_COLORS = {
  company: "#44403c",
  reader: "#059669",
  origin: "#e11d48",
};

// Module-scoped cache so repeated views of the same reader destination never
// re-fire the Geoapify geocode proxy for a given session.
const geocodeCache = new Map();

const hasCoords = (location) =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

const coordsOf = (location) =>
  hasCoords(location)
    ? { lat: location.latitude, lng: location.longitude }
    : null;

const geocodeTextFor = (location) =>
  (
    location.geocodeText ||
    location.address ||
    location.label ||
    location.name ||
    ""
  ).trim();

const fetchGeocode = (text) => {
  const key = String(text || "").trim().toLowerCase();
  if (!key) return Promise.resolve(null);
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  const promise = appClient.maps
    .geocode(text)
    .then((features) => {
      const coordinates = features?.[0]?.geometry?.coordinates;
      if (Array.isArray(coordinates) && coordinates.length >= 2) {
        return { lat: coordinates[1], lng: coordinates[0] };
      }
      return null;
    })
    .catch(() => null);

  geocodeCache.set(key, promise);
  return promise;
};

const markerIcon = (kind) => {
  const color = DOT_COLORS[kind] || "#44403c";
  return L.divIcon({
    className: "nekedem-map-marker",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px #fff,0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
};

// Keeps the map viewport fitted to every resolved delivery point as the
// reader destinations finish geocoding.
function FitBounds({ positions }) {
  const map = useMap();
  const key = (positions || [])
    .map((position) => `${position?.lat},${position?.lng}`)
    .join("|");

  useEffect(() => {
    const valid = (positions || []).filter(
      (position) => position?.lat != null && position?.lng != null,
    );
    if (!valid.length) return;
    map.fitBounds(
      valid.map((position) => [position.lat, position.lng]),
      { padding: [36, 36], maxZoom: 13 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

function useLocationCoords(location) {
  const [coords, setCoords] = useState(() => coordsOf(location));

  useEffect(() => {
    let mounted = true;
    if (hasCoords(location)) {
      setCoords(coordsOf(location));
      return undefined;
    }
    const text = geocodeTextFor(location);
    if (!text) {
      setCoords(null);
      return undefined;
    }
    setCoords(null);
    fetchGeocode(text).then((result) => {
      if (mounted) setCoords(result);
    });
    return () => {
      mounted = false;
    };
  }, [location]);

  return coords;
}

function GeoapifyMarker({ location, onResolved }) {
  const coords = useLocationCoords(location);

  useEffect(() => {
    if (coords) onResolved?.(location.id, coords);
  }, [coords, location.id, onResolved]);

  if (!coords) {
    return null;
  }

  return (
    <Marker
      position={[coords.lat, coords.lng]}
      icon={markerIcon(location.kind)}
    >
      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
        {location.name}
      </Tooltip>
      <Popup>
        <div className="min-w-40 max-w-60 font-sans text-sm text-stone-900">
          <p className="font-semibold leading-snug">{location.name}</p>
          {location.address ? (
            <p className="mt-0.5 text-xs leading-snug text-stone-600">
              {location.address}
            </p>
          ) : null}
          {(location.copies ||
            location.contact ||
            location.status ||
            location.latitude != null) ? (
            <div className="mt-2 space-y-0.5 text-xs text-stone-500">
              {location.copies ? <p>{location.copies}</p> : null}
              {location.contact ? <p>Contact: {location.contact}</p> : null}
              {location.status ? <p>State: {location.status}</p> : null}
              {location.latitude != null ? (
                <p className="font-mono text-[11px]">
                  {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </p>
              ) : null}
            </div>
          ) : null}
          {location.link ? (
            <Link
              to={location.link.to}
              className="mt-2 inline-block text-xs font-semibold text-emerald-700 underline"
            >
              {location.link.label}
            </Link>
          ) : null}
        </div>
      </Popup>
    </Marker>
  );
}

function MapUnavailable({ locations, height }) {
  if (!locations.length) {
    return (
      <div
        className="flex items-center gap-3 overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 dark:border-stone-700 dark:bg-stone-900/40"
        style={{ minHeight: height - 16 }}
      >
        <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
        <p className="font-sans text-sm text-stone-500 dark:text-stone-400">
          No saved delivery destinations to plot. The route map appears once a
          company or reader delivery address is added.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900/40"
      style={{ minHeight: height - 16 }}
    >
      <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
        <MapPin className="h-4 w-4" />
        Geoapify map unavailable
      </p>
      <ul className="mt-3 space-y-2">
        {locations.map((location) => (
          <li
            key={location.id}
            className="flex items-start gap-2 font-sans text-sm text-stone-700 dark:text-stone-200"
          >
            <span
              className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: DOT_COLORS[location.kind] || "#44403c" }}
            />
            <span className="min-w-0">
              <span className="font-medium">{location.name}</span>
              {location.address || geocodeTextFor(location) ? (
                <span className="text-stone-500 dark:text-stone-400">
                  {" "}
                  · {location.address || geocodeTextFor(location)}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Geoapify-powered delivery map used by the admin shipment workspace.
 *
 * Locations with saved coordinates render immediately; reader destinations
 * (free-text profiles) are geocoded through the backend proxy and pinned once
 * resolved. Without a reachable backend the panel degrades to a text listing
 * so dispatch still sees every stop.
 */
export default function GeoapifyMap({ locations = [], height = 360 }) {
  const [config, setConfig] = useState(null);
  const [resolved, setResolved] = useState({});

  useEffect(() => {
    let mounted = true;
    appClient.maps.config().then((value) => {
      if (mounted) setConfig(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleResolved = useCallback((id, coords) => {
    setResolved((current) => {
      if (current[id]?.lat === coords.lat && current[id]?.lng === coords.lng) {
        return current;
      }
      return { ...current, [id]: coords };
    });
  }, []);

  const memoLocations = useMemo(() => locations, [locations]);

  const positions = useMemo(
    () =>
      memoLocations.map(
        (location) => resolved[location.id] || coordsOf(location),
      ),
    [memoLocations, resolved],
  );

  if (!config) {
    return <MapUnavailable locations={memoLocations} height={height} />;
  }

  const tileUrl = (config.tileUrl || "").replace(
    "{apiKey}",
    config.apiKey,
  );

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700"
      style={{ height }}
    >
      <MapContainer
        center={[9.03, 38.74]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={tileUrl} attribution={config.attribution} maxZoom={20} />
        <FitBounds positions={positions} />
        {memoLocations.map((location) => (
          <GeoapifyMarker
            key={location.id}
            location={location}
            onResolved={handleResolved}
          />
        ))}
      </MapContainer>
    </div>
  );
}