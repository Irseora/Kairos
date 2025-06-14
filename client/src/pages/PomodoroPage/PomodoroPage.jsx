import { useState } from "react";
import Pomodoro from "../../components/Pomodoro/Pomodoro";
import "./PomodoroPage.css";
import Modal from "../../components/Modal/Modal";

const PomodoroPage = () => {
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [times, setTimes] = useState({
		work: 25,
		shortBreak: 5,
		longBreak: 15,
	});

	return (
		<>
			<div className="container pomodoro-container">
				<div className="text-center mb-4">
					<Pomodoro times={times} />

					<button
						className="btn mt-4"
						onClick={() => setShowSettingsModal(true)}
					>
						Settings
					</button>
				</div>
			</div>

			<Modal
				isOpen={showSettingsModal}
				title="Set Timers"
				onCancel={() => setShowSettingsModal(false)}
				onConfirm={() => setShowSettingsModal(false)}
				cancelText="Close"
				confirmText="Save"
			>
				{["work", "shortBreak", "longBreak"].map((type) => (
					<div className="mb-3" key={type}>
						<label className="form-label text-capitalize">
							{/* Human readable */}
							{type.replace(/([A-Z])/g, " $1")} (minutes)
						</label>

						<input
							className="form-control"
							type="number"
							min="1"
							value={times[type]}
							onChange={(e) =>
								setTimes({
									...times,
									[type]: parseInt(e.target.value),
								})
							}
						/>
					</div>
				))}
			</Modal>
		</>
	);
};

export default PomodoroPage;
