import * as dateTime from "../utils/date-time";

export default function WeatherByHour({ weatherIcon, temp, date, timezone }) {
  const formattedTime = dateTime.convertToLocalHour(date, timezone);
  const formattedTemp = Math.round(temp) + "°C";
  const formattedWeatherIcon = `../animated/${weatherIcon}.svg`;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <img
        src={formattedWeatherIcon}
        alt="Weather icon"
        style={{ width: 78, height: 68 }}
      ></img>
      <p className="text-light text-md-center fs-5 mb-4">
        <b>{formattedTemp}</b>
      </p>
      <p className="text-light text-md-center">{formattedTime}</p>
    </div>
  );
}
