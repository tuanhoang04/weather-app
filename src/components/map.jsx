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
          height: "300px",
          width: "100%",
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          borderBottomLeftRadius:  "0px",
          borderBottomRightRadius: "0px",
        }}
        dragging={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
      <p className="text-white flex-end m-1">Use two fingers to drag</p>
    </div>
  ) : (
    <div
      className="d-flex flex-column justify-content-end align-items-center"
      style={{ width: "80%" }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        key={`${latitude}-${longitude}`} // Ensures map updates when location changes
        style={{
          height: "300px",
          width: "100%",
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
        }}
        dragging={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export default Map;
