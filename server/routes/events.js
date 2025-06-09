import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Get all events for week
router.get("/user/:userId", async (req, res) => {
	const { userId } = req.params;
	const { weekStart } = req.query;

	try {
		const start = new Date(weekStart);
		const end = new Date(start);
		end.setDate(start.getDate() + 7);

		const events = await Event.find({
			userId,
			startTime: { $gte: start, $lt: end },
		}).sort({ startTime: 1 });

		res.json(events);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch events" });
	}
});

// Create event
router.post("/", async (req, res) => {
	try {
		const event = await Event.create(req.body);
		res.status(201).json(event);
	} catch (err) {
		res.status(400).json({ error: "Failed to create event" });
	}
});

// Update event
router.put("/:id", async (req, res) => {
	try {
		const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updated);
	} catch (err) {
		res.status(400).json({ error: "Failed to update event" });
	}
});

// Delete event
router.delete("/:id", async (req, res) => {
	try {
		await Event.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (err) {
		res.status(400).json({ error: "Failed to delete event" });
	}
});

export default router;
