import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Get list of all todos
router.get("/", async (req, res) => {
	try {
		const todos = await Todo.find().sort({ createdAt: -1 });
		res.status(200).json(todos);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch todos!" });
	}
});

// Add a new todo to list
router.post("/", async (req, res) => {
	try {
		const toAdd = new Todo({ text: req.body.text });
		const saved = await toAdd.save();
		res.status(201).json(saved);
	} catch (err) {
		res.status(400).json({ error: "Failed to create todo!" });
	}
});

// Toggle done-ness of a given todo
router.put("/:id", async (req, res) => {
	try {
		const toToggle = Todo.findById(req.params.id);
		if (!toToggle)
			return res.status(404).json({ error: "Could not find todo!" });

		toToggle.done = !toToggle.done;
		const saved = await toToggle.save();
		res.status(200).json(saved);
	} catch (err) {
		res.status(500).json({ error: "Failed to update todo!" });
	}
});

// Delete a todo
router.delete("/:id", async (req, res) => {
	try {
		await Todo.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Todo deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete todo!" });
	}
});

export default router;
