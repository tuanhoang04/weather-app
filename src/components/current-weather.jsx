import * as dateTime from '../utils/date-time';
export default function CurrentWeather({tz, temp, feelsLike, description, currHour }) {

  const formattedWeekday = dateTime.getCurrLocalWeekday(tz);
  const formattedDate =  dateTime.getCurrLocalDate(tz);

  const formattedTemp = Math.round(temp);
  const formattedFeelsLike = Math.round(feelsLike);
  const formattedDescription = capitalizeFirstLetter(description);
  return (
    <div className="d-flex p-2 flex-column fs-5">
      <p className="text-light text-md-start mx-1 mb-1 fs-5">
        <b>{formattedWeekday},</b>
      </p>
      <p className="text-light text-md-start mx-1 mb-1 fs-5">
        <b>{formattedDate}</b>
      </p>
      <p className="text-light text-md-start mx-1 fs-5">
        {currHour}
      </p>
      <p className="text-white text-md-start m-1 fs-3">
        {formattedTemp + "°C"}
      </p>
      <p className="text-light text-md-start m-1 fs-5">
        Feels like {formattedFeelsLike + "°C"}
      </p>
      <p className="text-light text-lg-start m-1 fs-5">
        {formattedDescription}
      </p>
    </div>
  );
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
