import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ x, y, onClose, options }) => {
	return (
		<ul
			className="context-menu"
			style={{
				top: y,
				left: x,
			}}
			onClick={onClose}
		>
			{options.map((option, index) => (
				<li key={index} onClick={option.onClick}>
					{option.label}
				</li>
			))}
		</ul>
	);
};

export default ContextMenu;
