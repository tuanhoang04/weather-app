import { MapContainer, TileLayer } from "react-leaflet";

function Map({latitude, longitude}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      key={`${latitude}-${longitude}`} // Ensures map updates when location changes
      style={{ height: "260px", width: "100%", borderRadius: "15px", margin:'5px' }}
      dragging={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}



export default Map;