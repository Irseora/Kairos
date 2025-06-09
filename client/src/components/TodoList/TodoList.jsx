import { useState } from "react";
import MagicWandIcon from "../../assets/icons/MagicWandIcon.jsx";
import EraserIcon from "../../assets/icons/EraserIcon.jsx";
import "./TodoList.css";

const TodoList = ({
	list,
	onToggleTodo,
	onAddTodo,
	onDeleteTodo,
	onRightClick,
}) => {
	const todos = list.todos || [];
	const [newTodoText, setNewTodoText] = useState("");

	const handleAdd = () => {
		if (!newTodoText.trim() || !list?._id) return;

		onAddTodo(list._id, newTodoText.trim());
		setNewTodoText("");
	};

	return (
		<>
			<div className="card todo-card mt-3" onContextMenu={onRightClick}>
				<div className="card-body">
					<h4 className="card-title text-center">{list.title}</h4>
					<hr />
					<ul className="list-group ">
						{todos.map((todo) => (
							<li
								key={todo._id}
								className={`list-group-item d-flex justify-content-between align-items-center ${
									todo.done ? "todo-done" : "todo"
								}`}
								onClick={() => onToggleTodo(todo._id)}
							>
								<span>{todo.text}</span>
								<button
									className="btn delete-button"
									onClick={(e) => {
										e.stopPropagation(); // Don't toggle todo when deleteing
										onDeleteTodo(list._id, todo._id);
									}}
								>
									<EraserIcon size="18" color="#011627" />
								</button>
							</li>
						))}
						<li className="list-group-item">
							<form
								className="d-flex"
								onSubmit={(e) => {
									e.preventDefault();
									handleAdd();
								}}
							>
								<input
									type="text"
									className="form-control me-2 todo-input"
									placeholder="Add new todo"
									value={newTodoText || ""}
									onChange={(e) => setNewTodoText(e.target.value)}
								/>
								<button className="btn add-task-btn" type="submit">
									<MagicWandIcon size="30" color="#011627" />
								</button>
							</form>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default TodoList;
