import { useState } from "react";
import WeeklyCalendar from "../../components/WeeklyCalendar/WeeklyCalendar";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import "./WeeklyCalendarPage.css";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";

const WeeklyCalendarPage = () => {
	const [currentWeekStart, setCurrentWeekStart] = useState(
		startOfWeek(new Date(), { weekStartsOn: 1 })
	);

	const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
	const formattedWeek =
		format(currentWeekStart, "MMM d") + " - " + format(currentWeekEnd, "MMM d");

	return (
		<div className="weekly-calendar-page">
			<div className="week-nav d-flex justify-content-center align-items-center gap-3 mb-3">
				<button
					className="btn"
					onClick={() => setCurrentWeekStart((prev) => subWeeks(prev, 1))}
				>
					<LeftArrowIcon size="24" color="#2a272c" />
				</button>
				<h4>{formattedWeek}</h4>
				<button
					className="btn"
					onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, 1))}
				>
					<RightArrowIcon size="24" color="#2a272c" />
				</button>
			</div>

			<WeeklyCalendar startDate={currentWeekStart} />
		</div>
	);
};

export default WeeklyCalendarPage;
