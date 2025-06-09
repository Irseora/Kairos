import { useEffect, useState } from "react";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import WeeklyCalendar from "../../components/WeeklyCalendar/WeeklyCalendar";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import Modal from "../../components/Modal/Modal";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import "./WeeklyCalendarPage.css";

const WeeklyCalendarPage = () => {
	const { user } = useAuth();

	const [currentWeekStart, setCurrentWeekStart] = useState(
		startOfWeek(new Date(), { weekStartsOn: 1 })
	);

	const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
	const formattedWeek =
		format(currentWeekStart, "MMM d") + " - " + format(currentWeekEnd, "MMM d");

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		event: null,
	});

	const [modalData, setModalData] = useState(null);
	const [modalMode, setModalMode] = useState("create");
	const [showAddEditModal, setShowAddEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [draggedEvent, setDraggedEvent] = useState(null);

	const [resizingEvent, setResizingEvent] = useState(null);
	const [isResizing, setIsResizing] = useState(false);

	// Load events for current user from db when user or week changes
	useEffect(() => {
		const fetchEvents = async () => {
			if (!user?._id) return;

			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/events/user/${
						user._id
					}?weekStart=${currentWeekStart.toISOString()}`
				);
				const data = await res.json();
				setEvents(data);
			} catch (err) {
				console.error("Failed to fetch calendar events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [user, currentWeekStart]);

	const handleCellClick = (dayIndex, hour) => {
		if (isResizing) return;

		const startDate = new Date(currentWeekStart);
		startDate.setDate(startDate.getDate() + dayIndex);
		startDate.setHours(hour, 0, 0, 0);

		const endDate = new Date(startDate);
		endDate.setHours(startDate.getHours() + 1);

		setModalData({
			title: "",
			startTime: startDate,
			endTime: endDate,
		});
		setModalMode("create");
		setShowAddEditModal(true);
	};

	const handleAddEditEvent = async () => {
		if (!modalData.title.trim()) return;

		const eventPayload = {
			...modalData,
			startTime: new Date(modalData.startTime).toISOString(),
			endTime: new Date(modalData.endTime).toISOString(),
		};

		try {
			// Add event
			if (modalMode === "create") {
				const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...eventPayload, userId: user._id }),
				});

				const created = await res.json();
				setEvents((prev) => [...prev, created]);
			} else {
				// Edit event
				const res = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/events/${modalData._id}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(eventPayload),
					}
				);

				const updated = await res.json();
				setEvents((prev) =>
					prev.map((event) => (event._id === updated._id ? updated : event))
				);
			}
		} catch (err) {
			console.error("Failed to save event:", err);
		} finally {
			setShowAddEditModal(false);
			setModalData(null);
		}
	};

	const handleDeleteEvent = async () => {
		try {
			await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/events/${contextMenu.event._id}`,
				{
					method: "DELETE",
				}
			);
			setEvents((prev) =>
				prev.filter((event) => event._id !== contextMenu.event._id)
			);
		} catch (err) {
			console.error("Failed to delete event:", err);
		} finally {
			setContextMenu({ ...contextMenu, visible: false });
			setShowDeleteModal(false);
		}
	};

	const handleDragStart = (e, event) => {
		setDraggedEvent(event);
	};

	const handleDrop = async (dayIndex, hour) => {
		if (!draggedEvent) return;

		const originalStart = new Date(draggedEvent.startTime);
		const originalEnd = new Date(draggedEvent.endTime);

		if (isNaN(originalStart) || isNaN(originalEnd)) {
			console.error("Invalid dragged event date values");
			return;
		}

		const newStart = new Date(currentWeekStart);
		newStart.setDate(newStart.getDate() + dayIndex);
		newStart.setHours(hour, 0, 0, 0);

		const duration = originalEnd.getTime() - originalStart.getTime();
		const newEnd = new Date(newStart.getTime() + duration);

		if (isNaN(newStart) || isNaN(newEnd)) {
			console.error("Invalid computed drop dates");
			return;
		}

		const updatedEvent = {
			...draggedEvent,
			startTime: newStart.toISOString(),
			endTime: newEnd.toISOString(),
		};

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/events/${draggedEvent._id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedEvent),
				}
			);

			const updated = await res.json();

			setEvents((prev) =>
				prev.map((event) => (event._id === updated._id ? updated : event))
			);
		} catch (err) {
			console.error("Failed to update event:", err);
		} finally {
			setDraggedEvent(null);
		}
	};

	const handleResizeStart = (e, event) => {
		e.preventDefault();
		setIsResizing(true);
		setResizingEvent(event);
	};

	// Live resize preview
	useEffect(() => {
		if (!resizingEvent) return;

		const handleMouseMove = (e) => {
			const calendarTop = document
				.querySelector(".weekly-calendar-container")
				.getBoundingClientRect().top;

			const pixelY = e.clientY - calendarTop;
			const hour = Math.floor(pixelY / 40);

			const newEnd = new Date(resizingEvent.startTime);
			newEnd.setHours(hour + 1, 0, 0, 0);

			if (newEnd > new Date(resizingEvent.startTime)) {
				setResizingEvent((prev) => ({
					...prev,
					endTime: newEnd.toISOString(),
				}));

				setEvents((prev) =>
					prev.map((event) =>
						event._id === resizingEvent._id
							? { ...event, endTime: newEnd.toISOString() }
							: event
					)
				);
			}
		};

		const handleMouseUp = async () => {
			if (!resizingEvent) return;

			try {
				await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/events/${resizingEvent._id}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							...resizingEvent,
							startTime: new Date(resizingEvent.startTime).toISOString(),
							endTime: new Date(resizingEvent.endTime).toISOString(),
						}),
					}
				);
			} catch (err) {
				console.error("Failed to resize evenet");
			} finally {
				setIsResizing(false);
				setResizingEvent(null);
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [resizingEvent]);

	if (loading) return <p>Loading calendar...</p>;

	return (
		<>
			<div className="weekly-calendar-page">
				<h6 className="text-center">{currentWeekStart.getFullYear()}</h6>
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

				<WeeklyCalendar
					startDate={currentWeekStart}
					events={events}
					onCellClick={(dayIndex, hour) => {
						handleCellClick(dayIndex, hour);
					}}
					onRightClickEvent={(event, x, y) => {
						setContextMenu({ visible: true, x, y, event });
					}}
					onDragStart={handleDragStart}
					onDrop={handleDrop}
					onResizeStart={handleResizeStart}
				/>
			</div>

			{contextMenu.visible && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					onClose={() => setContextMenu({ ...contextMenu, visible: false })}
					options={[
						{
							label: "Edit Event",
							onClick: () => {
								setModalMode("edit");
								setModalData(contextMenu.event);
								setShowAddEditModal(true);
								setContextMenu({ ...contextMenu, visible: false });
							},
						},
						{
							label: "Delete Event",
							onClick: () => setShowDeleteModal(true),
						},
					]}
				/>
			)}

			{/* Add / edit event modal */}
			{showAddEditModal && (
				<Modal
					isOpen={showAddEditModal}
					title={modalMode === "create" ? "Create Event" : "Edit Event"}
					onCancel={() => setShowAddEditModal(false)}
					onConfirm={handleAddEditEvent}
					confirmText={modalMode === "create" ? "Create" : "Save"}
					cancelText="Cancel"
				>
					<div className="form-group">
						<label>Event Title:</label>
						<input
							type="text"
							value={modalData.title}
							onChange={(e) =>
								setModalData({ ...modalData, title: e.target.value })
							}
							autoFocus
						/>
					</div>

					<div className="form-group">
						<label>Start Time:</label>
						<select
							value={new Date(modalData.startTime).getHours()}
							onChange={(e) => {
								const newStart = new Date(modalData.startTime);
								newStart.setHours(Number(e.target.value), 0, 0, 0);

								const newEnd = new Date(modalData.endTime);
								const duration =
									(newENd - new Date(modalData.startTIme)) / (1000 * 60 * 60);
								newEnd.setHours(newStart.getHours() + duration);

								setModalData({
									...modalData,
									startTime: newStart,
									endTime: newEnd,
								});
							}}
						>
							{Array.from({ length: 24 }, (_, i) => (
								<option key={i} value={i}>
									{`${i.toString().padStart(2, "0")}:00`}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>End Time:</label>
						<select
							value={new Date(modalData.endTime).getHours()}
							onChange={(e) => {
								const newEnd = new Date(modalData.endTime);
								newEnd.setHours(Number(e.target.value), 0, 0, 0);
								setModalData({ ...modalData, endTime: newEnd });
							}}
						>
							{Array.from({ length: 24 }, (_, i) => (
								<option key={i} value={i}>
									{`${i.toString().padStart(2, "0")}:00`}
								</option>
							))}
						</select>
					</div>
				</Modal>
			)}

			{/* Delete event modal */}
			{showDeleteModal && (
				<Modal
					isOpen={showDeleteModal}
					title="Delete Event"
					onCancel={() => setShowDeleteModal(false)}
					onConfirm={handleDeleteEvent}
					confirmText="Delete"
					cancelText="Cancel"
				>
					<p>
						Are you sure you want to delete
						<br />
						<strong>{contextMenu.event?.title}</strong>?
					</p>
				</Modal>
			)}
		</>
	);
};

export default WeeklyCalendarPage;
