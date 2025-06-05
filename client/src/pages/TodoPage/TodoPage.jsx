import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import TodoList from "../../components/TodoList/TodoList.jsx";
import ContextMenu from "../../components/ContextMenu/ContextMenu.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import QuillIcon from "../../assets/icons/QuillIcon.jsx";
import "./TodoPage.css";

const TodoPage = () => {
	const { user } = useAuth();

	// ------------------------ STATES ------------------------

	const [lists, setLists] = useState([]);
	const [loading, setLoading] = useState(true);

	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		listId: null,
	});

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [listIdToDelete, setListIdToDelete] = useState(null);

	const [showRenameModal, setShowRenameModal] = useState(false);
	const [listIdToRename, setListIdToRename] = useState(null);
	const [newTitle, setNewTitle] = useState("");

	const [showAddModal, setShowAddModal] = useState(false);
	const [newListTitle, setNewListTitle] = useState("");

	// --------------------------------------------------------

	// ------------------------ ACTIONS -----------------------

	// Load lists for current user from db when user changes
	useEffect(() => {
		const fetchLists = async () => {
			if (!user?._id) return;

			try {
				const res = await fetch(
					`http://localhost:3000/api/todo-lists/user/${user._id}`
				);
				const data = await res.json();
				setLists(data);
			} catch (err) {
				console.error("Failed to fetch lists:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchLists();
	}, [user]);

	const handleToggleTodo = async (listId, todoId) => {
		const currentList = lists.find((list) => list._id === listId);
		const currentTodo = currentList?.todos.find((todo) => todo._id === todoId);

		if (!currentTodo) return;

		const newDone = !currentTodo.done;

		try {
			await fetch(`http://localhost:3000/api/todos/${todoId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ done: newDone }),
			});

			setLists((prev) =>
				// Go through lists
				prev.map((list) =>
					list._id === listId
						? {
								...list,
								// Go through items in the rigth list
								todos: list.todos.map((todo) =>
									todo._id === todoId ? { ...todo, done: newDone } : todo
								),
						  }
						: list
				)
			);
		} catch (err) {
			console.error("Failed to toggle todo:", err);
		}
	};

	const handleAddTodo = async (listId, todoText) => {
		if (!todoText.trim()) return;

		try {
			const res = await fetch("http://localhost:3000/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					todoListId: listId,
					text: todoText,
				}),
			});

			const newTodo = await res.json();

			setLists((prev) =>
				// Go through lists
				prev.map((list) =>
					list._id === listId
						? {
								...list,
								// Add at end of correct list
								todos: [...list.todos, newTodo],
						  }
						: list
				)
			);
		} catch (err) {
			console.error("Failed to add todo:", err);
		}
	};

	const handleDeleteTodo = async (listId, todoId) => {
		try {
			await fetch(`http://localhost:3000/api/todos/${todoId}`, {
				method: "DELETE",
			});

			setLists((prev) =>
				// Go through lists
				prev.map((list) =>
					list._id === listId
						? {
								...list,
								// Remove specified todo
								todos: list.todos.filter((todo) => todo._id !== todoId),
						  }
						: list
				)
			);
		} catch (err) {
			console.error("Failed to delete todo:", err);
		}
	};

	const handleDeleteList = async (listId) => {
		try {
			await fetch(`http://localhost:3000/api/todo-lists/${listId}`, {
				method: "DELETE",
			});

			setLists((prev) => prev.filter((list) => list._id !== listId));
		} catch (err) {
			console.error("Failed to delete list:", err);
		} finally {
			setShowDeleteModal(false);
		}
	};

	const handleRenameList = async (listId) => {
		if (!newTitle.trim()) return;

		try {
			const res = await fetch(
				`http://localhost:3000/api/todo-lists/${listId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ title: newTitle }),
				}
			);

			const updatedList = await res.json();

			setLists((prev) =>
				prev.map((list) =>
					list._id === listId ? { ...list, title: newTitle } : list
				)
			);
		} catch (err) {
			console.error("Failed to rename list:", err);
		} finally {
			setShowRenameModal(false);
			setNewTitle("");
		}
	};

	const handleAddList = async () => {
		if (!newListTitle.trim()) return;

		try {
			const res = await fetch("http://localhost:3000/api/todo-lists", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user._id,
					title: newListTitle,
				}),
			});

			const createdList = await res.json();
			if (!createdList.todos) createdList.todos = [];

			setLists((prev) => [...prev, createdList]);
		} catch (err) {
			console.error("Failed to create list:", err);
		} finally {
			setShowAddModal(false);
			setNewListTitle("");
		}
	};

	// Close context menu by clicking outside
	useEffect(() => {
		const handleClick = () => {
			if (contextMenu.visible) {
				setContextMenu({ ...contextMenu, visible: false });
			}
		};
		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [contextMenu]);

	// -------------------------------------------------------

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="container">
					<div className="row">
						{lists.map((list) => (
							<div className="col-md-4 mb-4" key={list._id}>
								<TodoList
									list={list}
									onToggleTodo={(todoId) => handleToggleTodo(list._id, todoId)}
									onAddTodo={(listId, newTodoText) =>
										handleAddTodo(listId, newTodoText)
									}
									onDeleteTodo={(listId, todoId) =>
										handleDeleteTodo(listId, todoId)
									}
									onRightClick={(e) => {
										e.preventDefault();
										setContextMenu({
											visible: true,
											x: e.pageX,
											y: e.pageY,
											listId: list._id,
										});
									}}
								/>
							</div>
						))}
						<div className="col-md-4 mb-4">
							<div
								className="card new-todo-card mt-3 d-flex align-items-center justify-content-center"
								style={{ cursor: "pointer" }}
								onClick={() => setShowAddModal(true)}
							>
								<div className="card-body d-flex align-items-center justify-content-center">
									<span>
										<QuillIcon size="64" color="#011627" />
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{contextMenu.visible && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					onClose={() => setContextMenu({ ...contextMenu, visible: false })}
					options={[
						{
							label: "Delete List",
							onClick: () => {
								setListIdToDelete(contextMenu.listId);
								setShowDeleteModal(true);
								setContextMenu({ ...contextMenu, visible: false });
							},
						},
						{
							label: "Rename List",
							onClick: () => {
								const target = lists.find(
									(list) => list._id === contextMenu.listId
								);
								setListIdToRename(target._id);
								setNewTitle(target.title);
								setShowRenameModal(true);
								setContextMenu({ ...contextMenu, visible: false });
							},
						},
					]}
				/>
			)}

			{/* Delete list modal */}
			<Modal
				isOpen={showDeleteModal}
				title="Delete List?"
				onCancel={() => setShowDeleteModal(false)}
				onConfirm={() => handleDeleteList(listIdToDelete)}
				confirmText="Delete"
			>
				<p>Are you sure you want to delete this list?</p>
			</Modal>

			{/* Rename list modal */}
			<Modal
				isOpen={showRenameModal}
				title="Rename List?"
				onCancel={() => setShowRenameModal(false)}
				onConfirm={() => handleRenameList(listIdToRename)}
				confirmText="Rename"
			>
				<input
					className="form-control"
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					autoFocus
				/>
			</Modal>

			{/* Add new list modal */}
			<Modal
				isOpen={showAddModal}
				title="Create New List?"
				onCancel={() => {
					setShowAddModal(false);
					setNewListTitle("");
				}}
				onConfirm={() => handleAddList()}
				confirmText="Create"
			>
				<input
					className="form-control"
					type="text"
					value={newListTitle}
					onChange={(e) => setNewListTitle(e.target.value)}
					autoFocus
				/>
			</Modal>
		</>
	);
};

export default TodoPage;
