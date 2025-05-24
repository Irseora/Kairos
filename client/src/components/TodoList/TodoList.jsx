import { useState } from "react";
import MagicWandIcon from "../../assets/icons/MagicWandIcon.jsx";
import "./TodoList.css";

const TodoList = ({ list, onToggleTodo, onAddTodo, onDeleteTodo }) => {
	const [newTodoText, setNewTodoText] = useState();

	const handleAddTodoClick = () => {
		// Check if input is empty
		if (newTodoText.trim()) {
			onAddTodo(list.id, newTodoText);
			setNewTodoText("");
		}
	};

	return (
		<div className="card todo-card h-100 mt-3">
			<div className="card-body">
				<h5 className="card-title">{list.title}</h5>
				<ul className="list-group list-group-flush">
					{list.todos.map((todo) => (
						<li
							key={todo.id}
							className={`list-group-item d-flex justify-content-between align-items-center ${
								todo.done ? "todo-done" : "todo"
							}`}
						>
							<span className="todo-span" onClick={() => onToggleTodo(todo.id)}>
								{todo.text}
							</span>
							<button
								className="btn"
								onClick={() => onDeleteTodo(list.id, todo.id)}
							>
								X
							</button>
						</li>
					))}
					<li className="list-group-item d-flex">
						<input
							type="text"
							className="form-control me-2 task-input"
							placeholder="Add new todo"
							value={newTodoText || ""}
							onChange={(e) => setNewTodoText(e.target.value)}
						></input>
						<button className="btn" onClick={handleAddTodoClick}>
							<MagicWandIcon></MagicWandIcon>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TodoList;
