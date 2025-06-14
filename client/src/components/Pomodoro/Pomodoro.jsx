import { useState, useEffect, useRef, useCallback } from "react";
import FlashIcon from "../../assets/icons/FlashIcon";
import TulipIcon from "../../assets/icons/TulipIcon";
import "./Pomodoro.css";

const Pomodoro = ({ times }) => {
	const [timeLeft, setTimeLeft] = useState(times.work * 60);
	const [mode, setMode] = useState("work");
	const [isRunning, setIsRunning] = useState(false);
	const [pomodoroCount, setPomodoroCount] = useState(0);

	const timerRef = useRef(null);

	const toggleTimer = useCallback(() => {
		setIsRunning((prev) => !prev);
	}, []);

	// Start when isRunning is true
	useEffect(() => {
		if (isRunning) startTimer();
		return () => clearInterval(timerRef.current);
	}, [isRunning]);

	// Update on mode or times change
	useEffect(() => {
		setTimeLeft(getTimeForMode(mode));
	}, [mode, times]);

	//
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.code === "Space") {
				e.preventDefault();
				toggleTimer();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleTimer]);

	const startTimer = () => {
		clearInterval(timerRef.current);

		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					switchMode();
					return 0;
				}

				return prev - 1;
			});
		}, 1000);
	};

	const switchMode = () => {
		let nextMode;

		if (mode === "work") {
			const newCount = pomodoroCount + 1;
			setPomodoroCount(newCount);

			nextMode = newCount % 4 === 0 ? "long-break" : "short-break";
		} else {
			nextMode = "work";
		}

		setMode(nextMode);
		setTimeLeft(getTimeForMode(nextMode));
		setIsRunning(false);
	};

	const resetTimer = () => {
		clearInterval(timerRef.current);
		setIsRunning(false);
		setPomodoroCount(0);
		setMode("work");
		setTimeLeft(getTimeForMode("work"));
	};

	const formatTime = (seconds) => {
		const min = String(Math.floor(seconds / 60)).padStart(2, "0");
		const sec = String(seconds % 60).padStart(2, "0");
		return `${min}:${sec}`;
	};

	const getTimeForMode = (mode) => {
		switch (mode) {
			case "work":
				return times.work * 60;
			case "short-break":
				return times.shortBreak * 60;
			case "long-break":
				return times.longBreak * 60;
			default:
				return 1;
		}
	};

	return (
		<div className="timer-container text-center">
			<div className="mode-container d-flex justify-content-center">
				{mode === "work" ? (
					<div className="d-flex gap-3 ">
						<FlashIcon size="40" color="#011627" />
						<h3 className="badge-text">Work Time</h3>
						<FlashIcon size="40" color="#011627" />
					</div>
				) : (
					<div className="d-flex gap-3 ">
						<TulipIcon size="40" color="#011627" />
						<h3 className="badge-text">
							{mode === "short-break" ? "Break Time" : "Long Break Time"}
						</h3>
						<TulipIcon size="40" color="#011627" />
					</div>
				)}
			</div>

			<div className="timer display-1 my-3">{formatTime(timeLeft)}</div>

			<div className="progress" style={{ height: "20px" }}>
				<div
					className={"progress-bar"}
					role="progressbar"
					style={{
						width: `${(timeLeft / getTimeForMode(mode)) * 100}%`,
						backgroundColor:
							mode === "work" ? "var(--primary)" : "var(--secondary)",
					}}
				/>
			</div>

			<div className="timer-btns my-4">
				<button className="btn me-4" onClick={toggleTimer}>
					{isRunning ? "Pause" : "Start"}
				</button>

				<button className="btn" onClick={resetTimer}>
					Reset
				</button>
			</div>
		</div>
	);
};

export default Pomodoro;
