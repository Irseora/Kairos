import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
		category: {
			type: String,
			trim: true,
		},
		color: {
			type: String,
			default: "#ffffff",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Event", eventSchema, "events");
