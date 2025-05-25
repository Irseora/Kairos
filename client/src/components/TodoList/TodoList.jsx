import { useEffect, useState } from "react";
import MagicWandIcon from "../../assets/icons/MagicWandIcon.jsx";
import EraserIcon from "../../assets/icons/EraserIcon.jsx";
import ContextMenu from "../ContextMenu/ContextMenu.jsx";
import "./TodoList.css";

const TodoList = ({
	list,
	onToggleTodo,
	onAddTodo,
	onDeleteTodo,
	onRightClick,
}) => {
	const [newTodoText, setNewTodoText] = useState();

	// Handler for adding new todo
	const handleAddTodoClick = () => {
		// Check if input is empty
		if (newTodoText.trim()) {
			onAddTodo(list.id, newTodoText);
			setNewTodoText("");
		}
	};

	return (
		<>
			<div className="card todo-card mt-3" onContextMenu={onRightClick}>
				<div className="card-body">
					<h4 className="card-title text-center">{list.title}</h4>
					<hr />
					<ul className="list-group ">
						{list.todos.map((todo) => (
							<li
								key={todo.id}
								className={`list-group-item d-flex justify-content-between align-items-center ${
									todo.done ? "todo-done" : "todo"
								}`}
								onClick={() => onToggleTodo(todo.id)}
							>
								<span>{todo.text}</span>
								<button
									className="btn delete-button"
									onClick={(e) => {
										e.stopPropagation(); // Don't toggle todo when deleteing
										onDeleteTodo(list.id, todo.id);
									}}
								>
									<EraserIcon size="18" color="#2a272c" />
								</button>
							</li>
						))}
						<li className="list-group-item d-flex">
							<input
								type="text"
								className="form-control me-2 todo-input"
								placeholder="Add new todo"
								value={newTodoText || ""}
								onChange={(e) => setNewTodoText(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddTodoClick();
									}
								}}
							></input>
							<button className="btn" onClick={handleAddTodoClick}>
								<MagicWandIcon size="30" color="#2a272c" />
							</button>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default TodoList;
