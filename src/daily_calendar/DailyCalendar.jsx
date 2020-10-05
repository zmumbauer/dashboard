import React from 'react';
import UpcomingEvent from "../upcoming_event/UpcomingEvent";

export default function DailyCalendar(props) {
	return(
		<div className="daily-calendar">
			<div className="daily-calendar__title">{props.title}</div>
			{props.events.length > 0
				? props.events.map((event, i) => {
						return (
							<UpcomingEvent
								key={i}
								title={event.summary}
								startTime={event.startTime}
								allDay={event.start.dateTime ? false : true}
							/>
						);
				  })
				: "No events"}
		</div>
	);
}