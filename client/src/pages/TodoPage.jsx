import { use, useState } from "react";
import TodoList from "../components/TodoList/TodoList.jsx";
import { mockLists } from "../mockdata.js";
import QuillIcon from "../assets/icons/QuillIcon.jsx";
import "./TodoPage.css";

const TodoPage = () => {
	const [lists, setLists] = useState(mockLists);

	const toggleTodo = (listId, todoId) => {
		setLists((prev) =>
			// go through lists
			prev.map((list) =>
				list.id === listId
					? {
							...list,
							// go through items in the rigth list
							todos: list.todos.map((todo) =>
								todo.id === todoId ? { ...todo, done: !todo.done } : todo
							),
					  }
					: list
			)
		);
	};

	return (
		<div className="container">
			<div className="row">
				{lists.map((list) => (
					<div className="col-md-4 mb-4" key={list.id}>
						<TodoList
							list={list}
							onToggleTodo={(todoId) => toggleTodo(list.id, todoId)}
						/>
					</div>
				))}
				<div className="col-md-4 mb-4">
					<div
						className="card todo-card h-100 mt-3 d-flex align-items-center justify-content-center"
						style={{ cursor: "pointer" }}
						onClick={() => alert("Add new list")}
					>
						<div className="card-body d-flex align-items-center justify-content-center">
							<span>
								<QuillIcon />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TodoPage;
