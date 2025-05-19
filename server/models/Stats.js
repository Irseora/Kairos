import mongoose from "mongoose";

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
		tasksDoneCount: {
			type: Number,
			default: 0,
		},
		taskIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Todo",
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
