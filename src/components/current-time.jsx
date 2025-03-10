import * as dateTime from "../utils/date-time";

export default function CurrentTime({ tz, locationName, currHour, isMobi }) {
  const formattedWeekday = dateTime.getCurrLocalWeekday(tz);
  const formattedDate = dateTime.getCurrLocalDate(tz);
  return isMobi ? (
    <div className="row justify-content-between">
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-light text-lg-start fs-2 m-0">
          <b>{locationName ? locationName : "Hà Nội"}</b>
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-light text-md-start mb-0 fs-3 d-flex justify-content-center align-items-center">
          {formattedWeekday}, {formattedDate}
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-light text-md-start mb-0 fs-2">
          <b>{currHour}</b>
        </p>
      </div>
    </div>
  ) : (
    <div className="row justify-content-between">
      <p className="col-sm-6 text-light text-lg-start fs-3 m-0">
        <b>{locationName ? locationName : "Hà Nội"}</b>
      </p>
      <div className="col-sm-6">
        <p className="text-light text-md-start mb-0 fs-4">
          <b>{formattedWeekday},</b>
        </p>
        <p className="text-light text-md-start mb-0 fs-4">
          <b>{formattedDate}</b>
        </p>
        <p className="text-light text-md-start mb-0 fs-4">{currHour}</p>
      </div>
    </div>
  );
}
