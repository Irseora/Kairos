import { useEffect } from "react";
import "./Modal.css";

const Modal = ({
	isOpen,
	title,
	children,
	onCancel,
	onConfirm,
	confirmText = "OK",
	cancelText = "Cancel",
}) => {
	if (!isOpen) return null;

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onCancel();
		};

		if (isOpen) window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onCancel]);

	return (
		<div className="modal-backdrop">
			<div className="modal">
				<h4>{title}</h4>
				<div className="modal-body">{children}</div>
				<div className="modal-actions">
					<button className="btn" onClick={onCancel}>
						{cancelText}
					</button>
					<button className="btn" onClick={onConfirm}>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
