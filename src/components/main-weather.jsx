import useMediaQuery from "@mui/material/useMediaQuery";

export default function MainWeather({
  iconCode,
  temp,
  feelsLike,
  description,
  isMobi
}) {
  const formattedTemp = Math.round(temp);
  const formattedFeelsLike = Math.round(feelsLike);
  const formattedDescription = capitalizeFirstLetter(description);
  return isMobi ? (
    <div className="row">
      <div className="col-sm-6 d-flex flex-column justify-content-center align-items-center">
        <img
          src={`../animated/${iconCode}.svg`}
          alt="Weather icon"
          style={{ width: 90, height: 76 }}
        ></img>
        <p className="text-light text-sm m-1 fs-3 ">{formattedDescription}</p>
      </div>

      <div className="col-sm-6 d-flex flex-column justify-content-center align-items-center">
        <p className="text-white text-md m-1 fs-1">{formattedTemp + "°C"}</p>
        <p className="text-light text-sm m-1 fs-5">
          Feels like {formattedFeelsLike + "°C"}
        </p>
      </div>
    </div>
  ) : (
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
