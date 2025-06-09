import {
	addDays,
	format,
	isSameDay,
	isSameHour,
	parseISO,
	differenceInMinutes,
} from "date-fns";
import "./WeeklyCalendar.css";

const WeeklyCalendar = ({
	startDate,
	events,
	onCellClick,
	onRightClickEvent,
	onDragStart,
	onDrop,
	onResizeStart,
}) => {
	const hours = Array.from({ length: 24 }, (_, i) => i); // 0 -> 23
	const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

	const rowHeight = 40;

	// -------------------------------------------------------

	return (
		<>
			<div className="weekly-calendar-container">
				<div className="calendar-header">
					<div className="time-column-header" />
					{days.map((day, i) => (
						<div className="day-header text-center" key={i}>
							{format(day, "EEE dd")}
						</div>
					))}
				</div>

				<div className="calendar-body">
					{hours.map((hour) => (
						<div className="time-row" key={hour}>
							<div className="time-label text-end">
								{`${String(hour).padStart(2, "0")}:00`}
							</div>
							{days.map((day, dayIndex) => {
								const cellDate = new Date(day);
								cellDate.setHours(hour, 0, 0, 0);

								return (
									<div
										className="time-cell"
										key={dayIndex}
										onClick={() => onCellClick(dayIndex, hour)}
										onDragOver={(e) => e.preventDefault()}
										onDrop={() => onDrop(dayIndex, hour)}
									>
										{events.map((event) => {
											const start =
												typeof event.startTime === "string"
													? parseISO(event.startTime)
													: event.startTime;
											const end =
												typeof event.endTime === "string"
													? parseISO(event.endTime)
													: event.endTime;

											if (
												isSameDay(start, cellDate) &&
												isSameHour(start, cellDate)
											) {
												const durationMins = differenceInMinutes(end, start);
												const blockHeight = (durationMins / 60) * rowHeight;

												return (
													<div
														key={event._id || event.title + start.toISOString()}
														className="event-block"
														style={{ height: `${blockHeight - 1}px` }}
														onContextMenu={(e) => {
															e.preventDefault();
															onRightClickEvent(event, e.pageX, e.pageY);
														}}
														draggable
														onDragStart={(e) => onDragStart(e, event)}
													>
														<div className="event-content-wrapper">
															<div className="event-block-content">
																{event.title}
															</div>

															<div
																className="resize-handle"
																onMouseDown={(e) => onResizeStart(e, event)}
															/>
														</div>
													</div>
												);
											}

											return null;
										})}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default WeeklyCalendar;
