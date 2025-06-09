import express from "express";
import TodoList from "../models/TodoList.js";
import Todo from "../models/Todo.js";

const router = express.Router();

// Create new list
router.post("/", async (req, res) => {
	try {
		const todoList = new TodoList({
			...req.body,
			todos: [],
		});
		const savedList = await todoList.save();
		res.status(201).json(savedList);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Get all lists for user
router.get("/user/:id", async (req, res) => {
	try {
		const lists = await TodoList.find({ userId: req.params.id })
			.populate("todos")
			.exec();

		res.status(200).json(lists);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch todo lists" });
	}
});

// Update list
router.put("/:id", async (req, res) => {
	try {
		const updatedList = await TodoList.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json(updatedList);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Delete list
router.delete("/:id", async (req, res) => {
	try {
		await TodoList.findByIdAndDelete(req.params.id);
		await Todo.deleteMany({ todoListId: req.params.id });
		res.status(200).json({ message: "List & associated todos deleted" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
