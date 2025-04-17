import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import extra routes
import todoRoutes from "./routes/todos.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: "../.env" });

// __dirname alternative
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT;

// Static files path
app.use(express.static(path.join(__dirname, "../client/dist")));

// Index
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Extra routes
app.use("/api/todos", todoRoutes);

// Connect to mongo & run
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(port, () => {
			console.log(`Running on http://localhost:${port}`);
		});
	})
	.catch((err) => console.error("MongoDB connection error: ", err));
