import React, { useState, useEffect } from "react";
import axios from "axios";
import IconCloudy from "./icons/cloudy.svg";
import IconRain from "./icons/rain.svg";
import IconSun from "./icons/sunny.svg";
import IconStorm from "./icons/storm.svg";
import IconSnow from "./icons/snow.svg";

export default function WeatherWidget(props) {
	const latitude = "41.812825";
	const longitude = "-71.374081";
	const units = "metric";
	const [currentData, setCurrentData] = useState({});
	const [minuteData, setMinuteData] = useState([]);
	const [hourData, setHourData] = useState([]);
	const [dailyData, setDailyData] = useState([]);

	useEffect(() => {
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
			})
			.catch((data) => console.log("error", data));
	}, []);

	const weatherIcon = (weatherCode) => {
		if (weatherCode === undefined) {
			return null;
		}
		if (weatherCode === "800") {
			return { IconSun };
		}

		switch (weatherCode.substr(0, 1)) {
			case "2":
				return (
					<img
						src={IconStorm}
						className="weather-widget__icon"
						alt="thunderstorm"
					/>
				);
			case "3":
				return (
					<img
						src={IconRain}
						className="weather-widget__icon"
						alt="rain"
					/>
				);
			case "5":
				return (
					<img
						src={IconRain}
						className="weather-widget__icon"
						alt="rain"
					/>
				);
			case "6":
				return (
					<img
						src={IconSnow}
						className="weather-widget__icon"
						alt="snow"
					/>
				);
			case "8":
				return (
					<img
						src={IconCloudy}
						className="weather-widget__icon"
						alt="sunny"
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="weather-widget">
			{weatherIcon(currentData.weatherCode)}
			<div className="weather-widget__temp">{currentData.temperature}°</div>
		</div>
	);
}
