
import GoogleMap from "./GoogleMap";

export interface MapProps {
  lat: number;
  lng: number;
  height?: string;
}

// Re-export GoogleMap as Map for compatibility
const Map: React.FC<MapProps> = ({ lat, lng, height = "160px" }) => {
  return (
    <GoogleMap
      userLocation={{ lat, lng }}
      height={height}
    />
  );
};

export default Map;
