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
			<div className="clock__time">
				<div>{time.format("hh[:]mm")}</div>
				<div className="clock__seconds">
					<span>{time.format("ss")}</span>
					<span>{time.format("a")}</span>
				</div>
			</div>
			<div className="clock__date">{time.format("dddd, MMMM Do")}</div>
		</div>
	);
}
