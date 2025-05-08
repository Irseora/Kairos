import { apiFetch } from "./api.js";

export function getTodos() {
	return apiFetch("/todos");
}

export function addTodo(todo) {
	return apiFetch("/todos", {
		method: "POST",
		body: JSON.stringify(todo),
	});
}

export function deleteTodo(id) {
	return apiFetch(`/todos/${id}`, {
		method: "DELETE",
	});
}
