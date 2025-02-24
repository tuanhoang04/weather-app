import { MapContainer, TileLayer } from "react-leaflet";
import useMediaQuery from "@mui/material/useMediaQuery";

function Map({latitude, longitude}) {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      key={`${latitude}-${longitude}`} // Ensures map updates when location changes
      style={{ height: "260px", width: "100%", borderRadius: "15px", margin:'5px' }}
      dragging={!isMobile}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}

export default Map;