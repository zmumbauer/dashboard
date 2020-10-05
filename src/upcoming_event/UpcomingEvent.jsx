import React from "react";
import moment from "moment";

export default function UpcomingEvent(props) {
	return (
		<div className="upcoming-event" style={{
			paddingLeft: '20px',
			borderLeft: `5px solid ${props.color}`,
		}}>
			<div className="upcoming-event__title">{props.title}</div>
			<div className="upcoming-event__time">
				{props.startTime.calendar()}
			</div>
		</div>
	);
}
