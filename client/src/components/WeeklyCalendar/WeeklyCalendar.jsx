import { useState } from "react";
import { startOfWeek, addDays, addHours, format } from "date-fns";
import "./WeeklyCalendar.css";

const WeeklyCalendar = ({ startDate }) => {
	const hours = Array.from({ length: 24 }, (_, i) => i); // 0 -> 23
	const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

	return (
		<div className="weekly-calendar-container">
			<div className="calendar-header">
				<div className="time-column-header" />
				{days.map((day, i) => (
					<div className="day-header text-center">{format(day, "EEE dd")}</div>
				))}
			</div>
			<div className="calendar-body">
				{hours.map((hour) => (
					<div className="time-row" key={hour}>
						<div className="time-label text-end">
							{`${String(hour).padStart(2, "0")}:00`}
						</div>
						{days.map((_, i) => (
							<div className="time-cell" key={i} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default WeeklyCalendar;
