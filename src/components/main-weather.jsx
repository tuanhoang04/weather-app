export default function MainWeather({
  iconCode,
  temp,
  feelsLike,
  description,
}) {
  const formattedTemp = Math.round(temp);
  const formattedFeelsLike = Math.round(feelsLike);
  const formattedDescription = capitalizeFirstLetter(description);

  return (
    <div className="row">
      <div className="col-sm-6 d-flex flex-column justify-content-end">
        <img
          src={`../animated/${iconCode}.svg`}
          alt="Weather icon"
          style={{ width: 80, height: 66 }}
        ></img>
        <p className="text-light text-sm m-1 ">{formattedDescription}</p>
      </div>

      <div className="col-sm-6 d-flex flex-column justify-content-end">
        <p className="text-white text-md m-1 fs-1">{formattedTemp + "°C"}</p>
        <p className="text-light text-sm m-1 ">
          Feels like {formattedFeelsLike + "°C"}
        </p>
      </div>
    </div>
  );
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}