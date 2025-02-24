import { MapContainer, TileLayer } from "react-leaflet";
import useMediaQuery from "@mui/material/useMediaQuery";

function Map({ latitude, longitude }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <div className="w-100 d-flex flex-column justify-content-end align-items-center">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        key={`${latitude}-${longitude}`} // Ensures map updates when location changes
        style={{
          height: "300px",
          width: "100%",
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          borderBottomLeftRadius: isMobile?"0px":"15px",
          borderBottomRightRadius: isMobile?"0px":"15px"
        }}
        dragging={!isMobile}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>

      {isMobile && (
        <p className="text-white flex-end m-1">Use two fingers to drag</p>
      )}
    </div>
  );
}

export default Map;
