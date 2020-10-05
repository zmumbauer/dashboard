import React from "react";
import Clock from "./clock/Clock";
import WeatherWidget from "./weather_widget/WeatherWidget";

export default function Header(props) {
	return (
		<div className="header">
			<Clock />
			<WeatherWidget />
		</div>
	);
}
