import mongoose from "mongoose";

// Generated daily, kept for a week then deleted
// Updated every time a todo / pomodoro is done

const statsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		todosDoneCount: {
			type: Number,
			default: 0,
		},
		todoListsIds: [
			// TODO: Make lists ids unique
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "TodoList",
			},
		],
		pomodorosDoneCount: {
			type: Number,
			default: 0,
		},
		focusMinutes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

statsSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Stats", statsSchema, "daily_stats");
