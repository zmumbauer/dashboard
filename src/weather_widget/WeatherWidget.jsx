import React, { useState, useEffect } from "react";
import axios from "axios";
import IconCloudy from "./icons/cloudy.svg";
import IconRain from "./icons/rain.svg";
import IconSun from "./icons/sunny.svg";
import IconStorm from "./icons/storm.svg";
import IconSnow from "./icons/snow.svg";
import Loader from "../Loader";

export default function WeatherWidget(props) {
	const latitude = "41.812825";
	const longitude = "-71.374081";
	const units = "metric";
	const [currentData, setCurrentData] = useState({});
	const [minuteData, setMinuteData] = useState([]);
	const [hourData, setHourData] = useState([]);
	const [dailyData, setDailyData] = useState([]);
	const [fetching, setFetching] = useState(true);

	useEffect(() => {
		getWeather();
		const weatherInterval = setInterval(() => {
			getWeather();
		}, 1000 * 60 * 5);

		return () => {
			clearInterval(weatherInterval);
		}
		
	}, []);

	const getWeather = () => {
		setFetching(true);
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER}&units=${units}`
			)
			.then((resp) => {
				setCurrentData({
					temperature: `${Math.round(
						parseFloat(resp.data.current.feels_like)
					)}`,
					weatherCode: `${resp.data.current.weather[0].id.toString()}`,
				});
				setMinuteData(resp.data.minutely);
				setHourData(resp.data.hourly);
				setDailyData(resp.data.daily);
				setFetching(false);
			})
			.catch((data) => console.log("error", data));
	};

	const weatherIcon = (weatherCode) => {
		if (weatherCode === undefined) {
			return null;
		}
		if (weatherCode === "800") {
			return IconSun;
		}

		switch (weatherCode.substr(0, 1)) {
			case "2":
				return IconStorm;
			case "3":
				return IconRain;
			case "5":
				return IconRain;

			case "6":
				return IconSnow;

			case "8":
				return IconCloudy;
			default:
				return null;
		}
	};

	return (
		<div className="weather-widget">
			{fetching ? (
				<Loader />
			) : (
				<div>
					<img
						src={`${weatherIcon(currentData.weatherCode)}`}
						className="weather-widget__icon"
						alt="sunny"
					/>
					<div className="weather-widget__temp">
						{currentData.temperature}°
					</div>
				</div>
			)}
		</div>
	);
}
