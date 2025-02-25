import "./App.css";
import useSWR from "swr";
import { useGeolocated } from "react-geolocated";
import CurrentTime from "./components/current-time.jsx";
import MainWeather from "./components/main-weather.jsx";
import MoreDetails from "./components/more-weather-details.jsx";
import WeatherByHour from "./components/weather-by-hour.jsx";
import Map from "./components/map.jsx";
import { useEffect, useState, useCallback } from "react";
import ResponsiveChart from "./components/chart.jsx";
import * as dateTime from "./utils/date-time.js";
import GeoLocator from "./components/GeoLocator.jsx";

// openweathermap 5 days weather forecast API key
const APIKey = "917f68a3126efb6f9a8db6fce3b5f830";

// function for handling API requests
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
  const [backgroundImgURL, setBackgroundImgURL] = useState("");
  const [latitude, setLatitude] = useState("21.00626");
  const [longitude, setLongitude] = useState("105.85537");
  const [searchQuery, setSearchQuery] = useState("");
  const [currSearch, setCurrSearch] = useState("Hanoi");
  const [cityName, setCityName] = useState("Hanoi");
  const [reversedName, setReversedName] = useState("");
  const [hour, setHour] = useState(null);
  const [fourWeekDays, setFourWeekDays] = useState(null);
  const [weatherByHours, setWeatherByHours] = useState(new Array(9));
  const [minTempsByDay, setMinTempsByDay] = useState([0, 0, 0, 0]);
  const [maxTempsByDay, setMaxTempsByDay] = useState([0, 0, 0, 0]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGeo, setShowGeo] = useState(false);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const {
    data: weatherInfo,
    weatherError,
    isLoadingWeather,
  } = useSWR(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`,
    fetcher
  );
  // fetch the location infos whenever the currSearch is changed

  const {
    data: locationInfo,
    getLocationError,
    isLoadingLocation,
  } = useSWR(
    `https://nominatim.openstreetmap.org/search?q=${currSearch}&format=json&addressdetails=1`,
    fetcher
  );

  async function reverseGeocode(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        console.log("Invalid API fetching for Nominatim reverse geocoding");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching reverse geocode data:", error);
      return null;
    }
  }

  // use the corresponding background image to daytime/nighttime and set
  // weather-by-hour array to new divs since the whole weatherInfo is changed
  useEffect(() => {
    if (!weatherInfo || !weatherInfo.list) return;

    const openWeatherTZ = weatherInfo.city.timezone;
    const timeNow = dateTime.getCurrLocalHourMin(openWeatherTZ);

    if (dateTime.isSunsetSunrise(timeNow)) {
      setBackgroundImgURL("images/setrise.jpg");
    } else if (dateTime.isDaytime(timeNow)) {
      setBackgroundImgURL("images/day.jpg");
    } else {
      setBackgroundImgURL("images/night.jpg");
    }

    let newWeatherByHours = new Array(9);
    for (let i = 0; i < 9; i++) {
      newWeatherByHours[i] = (
        <WeatherByHour
          key={weatherInfo.list[i].dt}
          weatherIcon={weatherInfo.list[i].weather[0].icon}
          temp={weatherInfo.list[i].main.temp}
          date={weatherInfo.list[i].dt_txt}
          timezone={openWeatherTZ}
        />
      );
    }

    let newMinTempsByDay = new Array(5).fill(10000);
    let newMaxTempsByDay = new Array(5).fill(10000);
    let idx = 0;
    let currMin = 10000;
    let currMax = -10000;
    let prevDay = dateTime.getWeekDayFromDate(
      weatherInfo.list[0].dt_txt,
      openWeatherTZ
    );

    for (let i = 0; i < 40 && idx < 5; i++) {
      let currDay = dateTime.getWeekDayFromDate(
        weatherInfo.list[i].dt_txt,
        openWeatherTZ
      );
      if (currDay !== prevDay) {
        prevDay = currDay;
        newMinTempsByDay[idx] = currMin;
        newMaxTempsByDay[idx++] = currMax;
        currMin = 10000;
        currMax = -10000;
      }
      currMin = Math.min(
        currMin,
        Math.round(weatherInfo.list[i].main.temp_min)
      );
      currMax = Math.max(
        currMax,
        Math.round(weatherInfo.list[i].main.temp_max)
      );
    }
    if (newMaxTempsByDay[4] === 10000 && newMinTempsByDay[4] === 10000) {
      newMaxTempsByDay[4] = currMax;
      newMinTempsByDay[4] = currMin;
    }
    const weekDay = dateTime
      .getWeekDayFromDate(weatherInfo.list[0].dt_txt, openWeatherTZ)
      .substring(0, 3);
    idx = daysOfWeek.indexOf(weekDay);
    if (idx === -1) {
      console.error("Invalid weekday index!");
      return;
    }
    let newFourWeekDays = new Array(5);
    for (let i = 0; i < 5; i++) {
      newFourWeekDays[i] = daysOfWeek[(idx + i) % 7];
    }

    setHour(dateTime.getCurrLocalHourMin(openWeatherTZ));
    setFourWeekDays(newFourWeekDays);
    setMaxTempsByDay(newMaxTempsByDay);
    setMinTempsByDay(newMinTempsByDay);
    setWeatherByHours(newWeatherByHours);
  }, [weatherInfo]);

  // set the search query to the current input of the user -> fetch all location information
  const handleLocationSearch = (event) => {
    event.preventDefault();
    setCurrSearch(searchQuery);
  };

  const handleUseYourLocation = () => {
    setShowGeo(true);
  };

  const handleLocationObtained = useCallback(
    (lat, lng) => {
      setLatitude(lat);
      setLongitude(lng);
      setCityName(reverseGeocode(lat,lng).then(data=>data.address.suburb));
      console.log(lat, lng);
      setShowGeo(false);
    },
    [showGeo]
  );



  // whenever locationInfo is reassigned, change the usestate latitude, longitude -> change the weather info
  useEffect(() => {
    if (!locationInfo || isLoadingLocation) return;
    console.log(locationInfo);
    if (locationInfo.length > 0) {
      setLatitude(locationInfo[0].lat);
      setLongitude(locationInfo[0].lon);
      setCityName(locationInfo[0].name);
    }
  }, [locationInfo]);

  return (
    <div
      style={{
        background: `url(${backgroundImgURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="container-fluid outer d-flex flex-column justify-content-between p-3"
    >
      <nav className="d-flex flex-row navbar justify-content-center w-100">
        <form className="form-inline d-flex" onSubmit={handleLocationSearch}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              className="form-control w-75"
              type="search"
              placeholder="Search for cities"
              spellCheck="false"
              autoComplete="off"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              // Using onBlur with a short timeout allows the click to register
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {showSuggestions && (
              <ul
                className="suggestions-list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  position: "absolute",
                  background: "white",
                  width: "75%",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                <li
                  style={{ padding: "8px", cursor: "pointer" }}
                  onMouseDown={handleUseYourLocation}
                >
                  Use your location
                </li>
              </ul>
            )}
            {showGeo && (
              <GeoLocator onLocationObtained={handleLocationObtained} />
            )}
          </div>
          <button className="btn ms-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </nav>

      {fourWeekDays &&
        maxTempsByDay &&
        minTempsByDay &&
        weatherByHours &&
        weatherInfo &&
        locationInfo && (
          <div>
            <div className="first-row row mx-1">
              <div className="currWeather col-md bg-dark bg-opacity-50 p-3 rounded-4 shadow-lg border border-white border-opacity-25 m-1">
                <div className="d-flex flex-column p-2">
                  <CurrentTime
                    tz={weatherInfo?.city?.timezone}
                    locationName={cityName}
                    currHour={hour}
                  />
                  <hr />
                  <MainWeather
                    iconCode={weatherInfo.list[0].weather[0].icon}
                    temp={weatherInfo.list[0].main.temp}
                    feelsLike={weatherInfo.list[0].main.feels_like}
                    description={weatherInfo.list[0].weather[0].description}
                  />
                </div>
              </div>

              <div className="moredetails col-md p-3 bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 m-1">
                <MoreDetails
                  windspeed={weatherInfo.list[0].wind.speed}
                  humidity={weatherInfo.list[0].main.humidity}
                  pressureGrnd={weatherInfo.list[0].main.grnd_level}
                  pressureSea={weatherInfo.list[0].main.sea_level}
                  rainProb={weatherInfo.list[0].pop}
                />
              </div>

              <div className="p-3 col-lg-6 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 m-1">
                <div
                  className="d-flex flex-row overflow-auto align-items-center"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {weatherByHours.map((card) => card)}
                </div>
              </div>
            </div>

            <div className="second-row row m-1 justify-content-between">
              <div className="col-md-5 m-1 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 p-0">
                <Map latitude={latitude} longitude={longitude} />
              </div>
              <div className="col-md-6 m-1 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 flex-wrap">
                <ResponsiveChart
                  fourWeekDays={fourWeekDays}
                  maxTempsByDay={maxTempsByDay}
                  minTempsByDay={minTempsByDay}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
