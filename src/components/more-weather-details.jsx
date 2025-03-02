export default function MoreDetails({
  windspeed,
  humidity,
  pressureGrnd,
  pressureSea,
  visibility,
  rain,
  snow,
}) {
  const formattedPressure =
    (pressureGrnd !== pressureSea
      ? Math.min(pressureGrnd, pressureSea) +
        "-" +
        Math.max(pressureSea, pressureGrnd)
      : pressureSea) + "hPa";
  const formattedWind = windspeed + "m/s";
  const formattedHumidity = humidity + "%";
  const formattedVisibility = visibility + "m";
  let formattedRain = null;
  let formattedSnow = null;
  if (rain != null) {
    formattedRain = rain + "mm/h";
  }
  if (snow != null) {
    formattedSnow = snow + "mm/h";
  }

  return (
    <div className="d-flex p-2 flex-column">
      <p className="text-light text-md-start fs-5">
        <b>More Details: </b>
      </p>

      <p className="text-white text-md-start m-1">
        Windspeed: <b>{formattedWind}</b>
      </p>

      <p className="text-white text-md-start m-1">
        Air humidity: <b>{formattedHumidity}</b>
      </p>

      <p className="text-white text-md-start m-1">
        Pressure: <b>{formattedPressure}</b>
      </p>

      <p className="text-white text-md-start m-1">
        Visibility: <b>{formattedVisibility}</b>
      </p>
      {formattedRain && (
        <p className="text-white text-md-start m-1">
          Rain: <b>{formattedRain}</b>
        </p>
      )}

      {formattedSnow && (
        <p className="text-white text-md-start m-1">
          Snow: <b>{formattedSnow}</b>
        </p>
      )}
    </div>
  );
}
