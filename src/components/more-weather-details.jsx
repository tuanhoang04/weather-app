export default function MoreDetails({
  windspeed,
  humidity,
  pressureGrnd,
  pressureSea,
  rainProb,
}) {
  const formattedPressure =
    (pressureGrnd !== pressureSea
      ? Math.min(pressureGrnd, pressureSea) +
        "-" +
        Math.max(pressureSea, pressureGrnd)
      : pressureSea) + "hPa";
  const formattedWind = windspeed + " m/s";
  const formattedHumidity = humidity + "%";
  const formattedRainProb = rainProb * 100 + "%";

  return (
    <div className="d-flex p-2 flex-column">
      <p className="text-light text-md-start fs-5">
        <b>More Details: </b>
      </p>

      <p className="text-white text-md-start m-1">
        Windspeed: <b>{formattedWind}</b>
      </p>

      <p className="text-light text-md-start m-1">
        Air humidity: <b>{formattedHumidity}</b>
      </p>

      <p className="text-white text-md-start m-1">
        Pressure: <b>{formattedPressure}</b>
      </p>

      <p className="text-white text-md-start m-1">
        Rain probability: <b>{formattedRainProb}</b>
      </p>
    </div>
  );
}
