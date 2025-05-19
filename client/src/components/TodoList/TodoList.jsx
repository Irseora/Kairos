import "./TodoList.css";

const TodoList = ({ list, onToggleTodo }) => {
	return (
		<div className="card todo-card h-100 mt-3">
			<div className="card-body">
				<h5 className="card-title">{list.title}</h5>
				<ul className="list-group list-group-flush">
					{list.todos.map((todo) => (
						<li
							key={todo.id}
							className={`list-group-item ${todo.done ? "todo-done" : "todo"}`}
							onClick={() => onToggleTodo(todo.id)}
						>
							{todo.text}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TodoList;
