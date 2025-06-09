import bodyParser from "body-parser";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Import extra routes
import authRoutes from "./routes/googleAuth.js";
import todoRoutes from "./routes/todos.js";
import todoListRoutes from "./routes/todoLists.js";
import eventRoutes from "./routes/events.js";

// Load environment variables
dotenv.config({ path: "../.env" });

// __dirname alternative
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT;

// Body parser
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());
app.use(express.json());

// Cross-Origin Resource Sharing (for diff ports during dev)
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// Static files path
app.use(express.static(path.join(__dirname, "../client/dist")));

// Use extra routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/todo-lists", todoListRoutes);
app.use("/api/events", eventRoutes);

// Index
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Connect to mongo & run
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(port, () => {
			console.log(`Running on http://localhost:${port}`);
		});
	})
	.catch((err) => console.error("MongoDB connection error: ", err));
