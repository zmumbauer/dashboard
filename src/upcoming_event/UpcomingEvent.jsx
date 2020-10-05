import React from "react";

export default function UpcomingEvent(props) {
	return (
		<div className="upcoming-event">
			<div className="upcoming-event__title">{props.title}</div>
			<div className="upcoming-event__time">
				{props.startTime.calendar()}
			</div>
		</div>
	);
}
