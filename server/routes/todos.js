import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Create todo
router.post("/", async (req, res) => {
	try {
		const todo = new Todo(req.body);
		const savedTodo = await todo.save();
		res.status(201).json(savedTodo);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Get all todos from list
router.get("/list/:id", async (req, res) => {
	try {
		const todos = await Todo.find({ todoListId: req.params.id });
		res.json(todos);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update todo
router.put("/:id", async (req, res) => {
	try {
		const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updatedTodo);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Delete todo
router.delete("/", async (req, res) => {
	try {
		await Todo.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
