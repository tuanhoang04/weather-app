export default function MoreDetails({
  windspeed,
  humidity,
  pressureGrnd,
  pressureSea,
  visibility,
  rain,
  snow,
  isMobi
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
  }else{
    formattedRain = 0 + "mm/h";
  }
  if (snow != null) {
    formattedSnow = snow + "mm/h";
  } else {
    formattedSnow = 0 + "mm/h";
  }

  return isMobi ? (
    <div className="d-flex p-2 flex-column">
      <p className="text-light text-md-start fs-3">
        <b>More Details </b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Windspeed: <b>{formattedWind}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Air humidity: <b>{formattedHumidity}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Pressure: <b>{formattedPressure}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Visibility: <b>{formattedVisibility}</b>
      </p>
      {formattedRain && (
        <p className="text-white text-md-start m-1 fs-5">
          Rain: <b>{formattedRain}</b>
        </p>
      )}

      {formattedSnow && (
        <p className="text-white text-md-start m-1 fs-5">
          Snow: <b>{formattedSnow}</b>
        </p>
      )}
    </div>
  ) : (
    <div className="d-flex p-2 flex-column">
      <p className="text-light text-md-start fs-4">
        <b>More Details </b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Windspeed: <b>{formattedWind}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Air humidity: <b>{formattedHumidity}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Pressure: <b>{formattedPressure}</b>
      </p>

      <p className="text-white text-md-start m-1 fs-5">
        Visibility: <b>{formattedVisibility}</b>
      </p>
      {formattedRain && (
        <p className="text-white text-md-start m-1 fs-5">
          Rain: <b>{formattedRain}</b>
        </p>
      )}

      {formattedSnow && (
        <p className="text-white text-md-start m-1 fs-5">
          Snow: <b>{formattedSnow}</b>
        </p>
      )}
    </div>
  );
}
