import "./App.css";
import useSWR from "swr";
import CurrentWeather from "./components/current-weather.jsx";
import WeatherIcon from "./components/weather-icon.jsx";
import MoreDetails from "./components/more-weather-details.jsx";
import WeatherByHour from "./components/weather-by-hour.jsx";
import Map from "./components/map.jsx";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import * as dateTime from "./utils/date-time.js";

// openweathermap 5 days weather forecast API key
const APIKey = "917f68a3126efb6f9a8db6fce3b5f830";

// function for handling API requests
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
  const [backgroundImgURL, setBackgroundImgURL] = useState("images/day.jpg");
  const [latitude, setLatitude] = useState("21.00626");
  const [longitude, setLongitude] = useState("105.85537");
  const [searchQuery, setSearchQuery] = useState("");
  const [currSearch, setCurrSearch] = useState("Hanoi");
  const [hour, setHour] = useState(null);
  const [fourWeekDays, setFourWeekDays] = useState(null);
  const [weatherByHours, setWeatherByHours] = useState(new Array(8));
  const [minTempsByDay, setMinTempsByDay] = useState([0, 0, 0, 0, 0]);
  const [maxTempsByDay, setMaxTempsByDay] = useState([0, 0, 0, 0, 0]);
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

    let newWeatherByHours = new Array(8);
    for (let i = 0; i < 8; i++) {
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

    let newMinTempsByDay = new Array(5);
    let newMaxTempsByDay = new Array(5);
    let idx = 0;
    let currMin = 10000;
    let currMax = -10000;
    let prevDay = dateTime.getWeekDayFromDate(
      weatherInfo.list[0].dt_txt,
      openWeatherTZ
    );

    for (let i = 0; idx < 5; i++) {
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
      currMin = Math.min(currMin, weatherInfo.list[i].main.temp_min);
      currMax = Math.max(currMax, weatherInfo.list[i].main.temp_max);
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

  // whenever locationInfo is reassigned, change the usestate latitude, longitude -> change the weather info
  useEffect(() => {
    if (!locationInfo || isLoadingLocation) return;
    if (locationInfo.length > 0) {
      setLatitude(locationInfo[0].lat);
      setLongitude(locationInfo[0].lon);
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
          <input
            className="form-control w-75"
            type="search"
            placeholder="Search for cities"
            spellCheck="false"
            autoComplete="off"
            aria-autocomplete="none"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              <div className="col-md currWeather bg-dark bg-opacity-50 p-3 rounded-4 shadow-lg border border-white border-opacity-25 d-flex flex-row m-1">
                <div className="p-2 cityAndIcon">
                  <WeatherIcon
                    iconCode={weatherInfo.list[0].weather[0].icon}
                    locationName={locationInfo[0].name}
                  />
                </div>

                <CurrentWeather
                  tz={weatherInfo.city.timezone}
                  temp={weatherInfo.list[0].main.temp}
                  feelsLike={weatherInfo.list[0].main.feels_like}
                  description={weatherInfo.list[0].weather[0].description}
                  currHour={hour}
                />
              </div>

              <div className="moredetails col-md bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 m-1">
                <MoreDetails
                  windspeed={weatherInfo.list[0].wind.speed}
                  humidity={weatherInfo.list[0].main.humidity}
                  pressureGrnd={weatherInfo.list[0].main.grnd_level}
                  pressureSea={weatherInfo.list[0].main.sea_level}
                  rainProb={weatherInfo.list[0].pop}
                />
              </div>

              <div className="p-2 col-lg-6 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 m-1">
                <div
                  className="d-flex flex-row overflow-auto align-items-center"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {weatherByHours.map((card) => card)}
                </div>
              </div>
            </div>

            <div className="second-row row m-1 justify-content-between">
              <div className="col-md-5 m-1 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25">
                <Map latitude={latitude} longitude={longitude} />
              </div>
              <div
                className="col-md-6 m-1 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 flex-wrap"
                style={{ height: "290px" }}
              >
                {
                  <LineChart
                    xAxis={[
                      {
                        data: fourWeekDays,
                        scaleType: "band",
                      },
                    ]}
                    yAxis={[
                      {
                        label: "Temperature (°C)", // Y-axis label text (e.g., Temperature)
                      },
                    ]}
                    series={[
                      {
                        data: maxTempsByDay,
                        label: "Maximum Temperature",
                        curve: "linear",
                        color: "#e15759",
                      },
                      {
                        data: minTempsByDay,
                        label: "Minimum Temperature",
                        curve: "linear",
                        color: "#4e79a7",
                      },
                    ]}
                  />
                }
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
