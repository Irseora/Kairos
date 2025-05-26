import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Create todo
router.post("/", async (req, res) => {
	try {
		const { todoListId, text } = req.body;

		const savedTodo = await Todo.create({
			todoListId,
			text,
		});

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

// Toggle todo done
router.patch("/:id", async (req, res) => {
	try {
		const { done } = req.body;

		const updatedTodo = await Todo.findByIdAndUpdate(
			req.params.id,
			{ done },
			{ new: true }
		);

		if (!updatedTodo)
			return res.status(404).status({ error: "Todo not found" });

		res.status(200).json(updatedTodo);
	} catch (err) {
		res.status(500).json({ error: "Failed to toggle todo" });
	}
});

// Delete todo
router.delete("/:id", async (req, res) => {
	try {
		const deleted = await Todo.findByIdAndDelete(req.params.id);

		if (!deleted) return res.status(404).json({ errror: "Todo not found" });

		res.status(200).json({ message: "Todo deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete todo" });
	}
});

export default router;
