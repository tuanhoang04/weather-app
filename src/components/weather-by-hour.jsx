import * as dateTime from "../utils/date-time";

export default function WeatherByHour({ weatherIcon, temp, date, timezone }) {
  const formattedTime = dateTime.convertToLocalHour(date,timezone);
  const formattedTemp = Math.round(temp) + "°C";
  const formattedWeatherIcon = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <img
        src={formattedWeatherIcon}
        alt="Weather icon"
        style={{ width: 80, height: 80 }}
      ></img>
      <p className="text-light text-md-center fs-5">{formattedTemp}</p>
      <p className="text-light text-md-center">{formattedTime}</p>
    </div>
  );
}
