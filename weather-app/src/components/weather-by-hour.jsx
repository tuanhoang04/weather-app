import * as dateTime from "../utils/date-time";

export default function WeatherByHour({ weatherIcon, temp, date, timezone, isMobi }) {
  const formattedTime = dateTime.convertToLocalHour(date, timezone);
  const formattedTemp = Math.round(temp) + "°C";
  const formattedWeatherIcon = `../animated/${weatherIcon}.svg`;

  return isMobi ? (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <img
        src={formattedWeatherIcon}
        alt="Weather icon"
        style={{ width: 80, height: 74 }}
      ></img>
      <p className="text-light text-md-center fs-4 mb-3">
        <b>{formattedTemp}</b>
      </p>
      <p className="text-light text-md-center fs-5">{formattedTime}</p>
    </div>
  ) : (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <img
        src={formattedWeatherIcon}
        alt="Weather icon"
        style={{ width: 85, height: 74 }}
      ></img>
      <p className="text-light text-md-center fs-3 mb-3">
        <b>{formattedTemp}</b>
      </p>
      <p className="text-light text-md-center fs-4">{formattedTime}</p>
    </div>
  );
}
