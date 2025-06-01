import { useState } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	subMonths,
	addMonths,
	format,
} from "date-fns";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import "./Calendar.css";

const Calendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	const renderHeader = () => {
		return (
			<div className="calendar-header d-flex justify-content-center align-items-center gap-3 mb-3">
				<button
					className="btn"
					onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}
				>
					<LeftArrowIcon size="24" color="#2a272c" />
				</button>
				<h4>{format(currentDate, "MMMM yyyy")}</h4>
				<button
					className="btn"
					onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
				>
					<RightArrowIcon size="24" color="#2a272c" />
				</button>
			</div>
		);
	};

	const renderDays = () => {
		const days = [];
		const date = startOfWeek(currentDate, { weekStartsOn: 1 });

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className="calendar-day-name" key={i}>
					{format(addDays(date, i), "EEE")}
				</div>
			);
		}

		return <div className="calendar-days">{days}</div>;
	};

	const renderCells = () => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
		const endDate = endOfWeek(monthEnd);

		const rows = [];
		let days = [];
		let day = startDate;

		// Build rows (weeks)
		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				days.push(
					<div
						className={`calendar-cell ${
							day.getMonth() !== monthStart.getMonth() ? "disabled" : ""
						}`}
						key={day}
					>
						{format(day, "d")}
					</div>
				);

				day = addDays(day, 1);
			}

			rows.push(
				<div className="calendar-row" key={day}>
					{days}
				</div>
			);
			days = [];
		}

		return <div className="calendar-body">{rows}</div>;
	};

	return (
		<div className="calendar-container">
			{renderHeader()}
			{renderDays()}
			{renderCells()}
		</div>
	);
};

export default Calendar;
