import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
	{
		todoListId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TodoList",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		dueDate: Date,
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Todo", todoSchema, "todos");
