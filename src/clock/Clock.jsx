import React, { useState, useEffect } from "react";
import moment from "moment";

export default function Clock(props) {
	const [time, setTime] = useState(moment());

	useEffect(() => {
		var timer = setInterval(() => {
			setTime(moment());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div className="clock">
			<div className="clock__time">{time.format("hh[:]mm[:]ssa")}</div>
			<div className="clock__date">{time.format("dddd, MMMM Do")}</div>
		</div>
	);
}
