import { DateTime } from "luxon";

export const getCurrLocalHourMin = (timezoneOffset) => {
  const nowUtc = DateTime.utc();
  const localTime = nowUtc.plus({ seconds: timezoneOffset });
  return localTime.toFormat("HH:MMa");
};

// get weekday from openweather API date format
export const getWeekDayFromDate = (ogDate, timezoneOffset) => {
  const dateObj = DateTime.fromISO(ogDate.replace(" ", "T"), { zone: "utc" });
  const localTime = dateObj.plus({ seconds: timezoneOffset });
  return localTime.toFormat("EEEE");
};

export const convertToLocalHour = (utcTime, timezoneOffset) => {
  const dateObj = DateTime.fromISO(utcTime.replace(" ", "T"), { zone: "utc" });
  const localTime = dateObj.plus({ seconds: timezoneOffset });
  return localTime.toFormat("HH:mm");
};

export const getCurrLocalWeekday = (timezoneOffset)=>{
    const nowUtc = DateTime.utc();
    const localTime = nowUtc.plus({ seconds: timezoneOffset });
    return localTime.toFormat("EEEE");
} 
export const getCurrLocalDate = (timezoneOffset)=>{
    const nowUtc = DateTime.utc();
    const localTime = nowUtc.plus({ seconds: timezoneOffset });
    return localTime.toFormat("MMMM d");
} 

export const isDaytime = (localHourMin) => {
  const formattedHour = localHourMin.substring(0, 2);
  return formattedHour > 7 && formattedHour < 16 ? true : false;
};
export const isSunsetSunrise = (localHourMin) => {
  const formattedHour = localHourMin.substring(0, 2);
  return (formattedHour >= 16 && formattedHour <= 18) ||
    (formattedHour >= 5 && formattedHour <= 7)
    ? true
    : false;
};


// export const formatTimezone = (timezone) => {
//   const hour = Math.floor(timezone / 3600);
//   const minute = Math.abs((timezone % 3600) / 60);
//   const sign = hour >= 0 ? "+" : "-";
//   const formattedHour = String(Math.abs(hour)).padStart(2, "0");
//   const formattedMinute = String(minute).padStart(2, "0");

//   return `${sign}${formattedHour}:${formattedMinute}`;
// };
