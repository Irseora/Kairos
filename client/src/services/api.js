import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../../../.env" });

const baseApiUrl = process.env.API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
	const res = await fetch(`${baseApiUrl}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message || "An error occured");
	}

	return res.json();
}
