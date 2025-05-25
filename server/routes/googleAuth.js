import express from "express";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "../.env" });

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
	const { token } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const { sub, email, name } = payload;

		let user = await User.findOne({ googleId: sub });

		if (!user) {
			user = await User.create({
				googleId: sub,
				email,
				name,
			});
		}

		res.status(200).json({
			message: "Login sucessful!",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(401).json({ error: "Invalid token!" });
	}
});

export default router;
