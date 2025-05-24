import { useState } from "react";
import TodoList from "../components/TodoList/TodoList.jsx";
import { mockLists } from "../mockdata.js";
import QuillIcon from "../assets/icons/QuillIcon.jsx";
import "./TodoPage.css";

const TodoPage = () => {
	const [lists, setLists] = useState(mockLists);

	const handleToggleTodo = (listId, todoId) => {
		setLists((prev) =>
			// Go through lists
			prev.map((list) =>
				list.id === listId
					? {
							...list,
							// Go through items in the rigth list
							todos: list.todos.map((todo) =>
								todo.id === todoId ? { ...todo, done: !todo.done } : todo
							),
					  }
					: list
			)
		);
	};

	const handleAddTodo = (listId, todoText) => {
		setLists((prev) =>
			// Go through lists
			prev.map((list) =>
				list.id === listId
					? {
							...list,
							// Add at end of correct list
							todos: [...list.todos, { text: todoText, done: false }],
					  }
					: list
			)
		);
	};

	const handleDeleteTodo = (listId, todoId) => {
		setLists((prev) =>
			// Go through lists
			prev.map((list) =>
				list.id === listId
					? {
							...list,
							// Remove specified todo
							todos: list.todos.filter((todo) => todo.id !== todoId),
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
							onToggleTodo={(todoId) => handleToggleTodo(list.id, todoId)}
							onAddTodo={(listId, newTodoText) =>
								handleAddTodo(listId, newTodoText)
							}
							onDeleteTodo={(listId, todoId) =>
								handleDeleteTodo(listId, todoId)
							}
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
