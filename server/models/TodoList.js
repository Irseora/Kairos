import mongoose from "mongoose";

const todoListSchema = new mongoose.Schema(
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
		color: {
			type: String,
			default: "#ffffff",
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for fetching all todos inside list
todoListSchema.virtual("todos", {
	ref: "Todo",
	localField: "_id",
	foreignField: "todoListId",
});

export default mongoose.model("TodoList", todoListSchema, "todo_lists");
