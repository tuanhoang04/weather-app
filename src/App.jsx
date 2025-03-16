import "./App.css";
import useSWR from "swr";

import CurrentTimeLocation from "./components/current-time-location.jsx";
import MainWeather from "./components/main-weather.jsx";
import MoreDetails from "./components/more-weather-details.jsx";
import WeatherByHour from "./components/weather-by-hour.jsx";
import Map from "./components/map.jsx";
import { useEffect, useState, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveChart from "./components/chart.jsx";
import * as dateTime from "./utils/date-time.js";
import NavBar from "./components/nav-bar.jsx";
// openweathermap 5 days weather forecast API key
const APIKey = "917f68a3126efb6f9a8db6fce3b5f830";

// function for handling API requests
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
  const [backgroundImgURL, setBackgroundImgURL] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [currSearch, setCurrSearch] = useState();
  const [cityName, setCityName] = useState("");
  const [hour, setHour] = useState(null);
  const [fourWeekDays, setFourWeekDays] = useState(null);
  const [weatherByHours, setWeatherByHours] = useState(new Array(9));
  const [minTempsByDay, setMinTempsByDay] = useState([0, 0, 0, 0, 0]);
  const [maxTempsByDay, setMaxTempsByDay] = useState([0, 0, 0, 0, 0]);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isMobile = useMediaQuery("(max-width:768px)");
  const {
    data: currentWeatherInfo,
    currentWeatherError,
    isLoadingCurrentWeather,
  } = useSWR(
    longitude && latitude
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`
      : null,
    fetcher
  );

  const {
    data: weatherInfo,
    weatherError,
    isLoadingWeather,
  } = useSWR(
    longitude && latitude
      ? `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`
      : null,
    fetcher
  );
  // fetch the location infos whenever the currSearch is changed

  const {
    data: locationInfo,
    getLocationError,
    isLoadingLocation,
  } = useSWR(
    currSearch
      ? `https://nominatim.openstreetmap.org/search?q=${currSearch}&format=json&addressdetails=1`
      : null,
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

    let newWeatherByHours = new Array(9);
    for (let i = 0; i < 9; i++) {
      newWeatherByHours[i] = (
        <WeatherByHour
          key={weatherInfo.list[i].dt + cityName}
          weatherIcon={weatherInfo.list[i].weather[0].icon}
          temp={weatherInfo.list[i].main.temp}
          date={weatherInfo.list[i].dt_txt}
          timezone={openWeatherTZ}
          isMobi={isMobile}
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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--dynamic-bg-image",
      `url(${backgroundImgURL})`
    );
  }, [backgroundImgURL]);
  
  // set the search query to the current input of the user -> fetch all location information
  const handleLocationSearch = (event) => {
    event.preventDefault();
    document.getElementById("search-bar").blur();
    setCurrSearch(searchTerm);
  };

  async function handleUseYourLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationObtained(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          setLatitude("21.00626");
          setLongitude("105.85537");
          setCityName("Hanoi");
        }
      );
    } else {
      setLatitude("21.00626");
      setLongitude("105.85537");
      setCityName("Hanoi");
    }
  }

  const handleLocationObtained = async (lat, lng) => {
    console.log(lat, lng);
    setLatitude(lat);
    setLongitude(lng);
    const data = await reverseGeocode(lat, lng);
    if (data) setCityName(data.name);
    setSearchTerm("");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationObtained(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          setLatitude("21.00626");
          setLongitude("105.85537");
          setCityName("Hanoi");
        }
      );
    } else {
      setLatitude("21.00626");
      setLongitude("105.85537");
      setCityName("Hanoi");
    }
  }, []);

  // testing
  useEffect(() => {
    if (latitude && longitude) {
      console.log(
        `Latitude: ${latitude}, Longitude: ${longitude}, City: ${cityName}`
      );
    }
  }, [latitude, longitude, cityName]); // Log when state updates

  // whenever locationInfo is reassigned, change the usestate latitude, longitude -> change the weather info
  useEffect(() => {
    if (!locationInfo || isLoadingLocation) return;
    if (locationInfo.length > 0) {
      setLatitude(locationInfo[0].lat);
      setLongitude(locationInfo[0].lon);
      setCityName(locationInfo[0].name);
    }
  }, [locationInfo]);

  useEffect(() => {
    if (!currentWeatherInfo || isLoadingCurrentWeather) return;
    const openWeatherTZ = currentWeatherInfo.timezone;
    const timeNow = dateTime.getCurrLocalHourMin(openWeatherTZ);
    const weatherCode = currentWeatherInfo.weather[0].id;
    if (weatherCode > 199 && weatherCode < 550) {
      setBackgroundImgURL("images/rainy.jpg");
    } else if (dateTime.isSunsetSunrise(timeNow)) {
      setBackgroundImgURL("images/setrise.jpg");
    } else if (dateTime.isDaytime(timeNow)) {
      setBackgroundImgURL("images/day.jpg");
    } else {
      setBackgroundImgURL("images/night.jpg");
    }
  }, [currentWeatherInfo]);

  return (
    <div className="container-fluid d-flex flex-column p-3 responsive-bg">
      <NavBar
        handleSubmit={handleLocationSearch}
        handleYourLocation={handleUseYourLocation}
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
      />
      {hour &&
      cityName &&
      fourWeekDays &&
      maxTempsByDay &&
      minTempsByDay &&
      weatherByHours &&
      weatherInfo &&
      currentWeatherInfo ? (
        <div className="d-flex flex-column h-100 flex-grow-1 justify-content-evenly">
          <div className="first-row row justify-content-center mx-1">
            <div className="currWeather col-md bg-dark bg-opacity-50 p-3 rounded-4 shadow-lg border border-white border-opacity-25 my-1 me-lg-3">
              <div className="d-flex flex-column p-2">
                <CurrentTimeLocation
                  tz={weatherInfo?.city?.timezone}
                  locationName={cityName}
                  currHour={hour}
                  isMobi={isMobile}
                />
                <hr />
                <MainWeather
                  iconCode={currentWeatherInfo?.weather[0]?.icon}
                  temp={currentWeatherInfo?.main?.temp}
                  feelsLike={currentWeatherInfo?.main?.feels_like}
                  description={currentWeatherInfo?.weather[0]?.description}
                  isMobi={isMobile}
                />
              </div>
            </div>

            <div className="moredetails col-md p-3 bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 my-1 me-lg-3">
              <MoreDetails
                windspeed={currentWeatherInfo?.wind?.speed}
                humidity={currentWeatherInfo?.main?.humidity}
                pressureGrnd={currentWeatherInfo?.main?.grnd_level}
                pressureSea={currentWeatherInfo?.main?.sea_level}
                visibility={currentWeatherInfo?.visibility}
                rain={currentWeatherInfo?.rain?.["1h"]}
                snow={currentWeatherInfo?.snow?.["1h"]}
                isMobi={isMobile}
              />
            </div>

            <div className="p-3 col-lg-6 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 my-1">
              <div
                className="d-flex flex-row overflow-auto align-items-center"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {weatherByHours.map((card) => card)}
              </div>
            </div>
          </div>

          {isMobile ? (
            <div className="justify-content-between m-1">
              <div className="d-flex justify-content-center align-items-center p-0 mb-2">
                <Map
                  latitude={latitude}
                  longitude={longitude}
                  isMobi={isMobile}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 flex-wrap">
                <ResponsiveChart
                  fourWeekDays={fourWeekDays}
                  maxTempsByDay={maxTempsByDay}
                  minTempsByDay={minTempsByDay}
                />
              </div>
            </div>
          ) : (
            <div className="second-row row justify-content-between m-1">
              <div className="col my-1 d-flex justify-content-center align-items-center p-0">
                <Map
                  latitude={latitude}
                  longitude={longitude}
                  isMobi={isMobile}
                />
              </div>
              <div className="col my-1 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded-4 shadow-lg border border-white border-opacity-25 flex-wrap ms-4">
                <ResponsiveChart
                  fourWeekDays={fourWeekDays}
                  maxTempsByDay={maxTempsByDay}
                  minTempsByDay={minTempsByDay}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex w-100 h-100 flex-column flex-grow-1 justify-content-center align-items-center">
          <p className="fs-1 text-white bg-dark bg-opacity-50 p-2 rounded-3 shadow-lg border border-white border-opacity-25 m-1">
            Loading...
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
