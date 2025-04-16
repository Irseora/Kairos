//const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";

// Load environment variables
//require("dotenv").config({ path: "../.env" });
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const uri = process.env.MONGO_URI;

// Connect to database
const client = new MongoClient(uri);

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		// Send a ping to confirm a successful connection
		const collection = await client.db("sample_mflix").collection("movies");
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!",
			collection.collectionName
		);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
