import React, { useState, useEffect } from 'react';

export default function Clock(props) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		var timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		}

	}, []);

	return(
		<div className="clock">{time.toLocaleTimeString()}</div>
	)
}