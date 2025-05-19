import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		googleId: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
