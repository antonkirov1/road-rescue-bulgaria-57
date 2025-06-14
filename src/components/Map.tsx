
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// TODO: Replace with your actual Mapbox public token or add logic for user prompt if necessary.
const MAPBOX_TOKEN = "<mapbox-public-token>";

interface MapProps {
  lat: number;
  lng: number;
}

const Map: React.FC<MapProps> = ({ lat, lng }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 14,
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-40 rounded-lg"
      style={{ minHeight: 160, backgroundColor: "#eee" }}
    />
  );
};

export default Map;
