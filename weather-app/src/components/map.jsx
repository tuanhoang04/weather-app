import { MapContainer, TileLayer } from "react-leaflet";

function Map({ latitude, longitude, isMobi }) {
  return isMobi ? (
    <div
      className="d-flex flex-column justify-content-end align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25"
      style={{ width: "100%" }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        key={`${latitude}-${longitude}`} // Ensures map updates when location changes
        style={{
          height: "400px",
          width: "99.8%",
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
        dragging={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
      <p className="text-white flex-end m-1">Use two fingers to drag</p>
    </div>
  ) : (
    // desktop map
    <div
      className="d-flex flex-column justify-content-end align-items-center border border-black rounded-4 border-opacity-25"
      style={{ width: "90%" }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        key={`${latitude}-${longitude}`} // Ensures map updates when location changes
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "15px",
        }}
        dragging={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export default Map;
