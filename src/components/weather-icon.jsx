export default function WeatherIcon({ iconCode, locationName }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <p className="text-light text-lg-start fs-5">
        <b>{locationName ? locationName : "Hanoi, Vietnam"}</b>
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="Weather icon"
        style={{ width: 100, height: 100 }}
      ></img>
    </div>
  );
}
