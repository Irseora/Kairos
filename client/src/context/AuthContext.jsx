import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true); // So page doesnt load before useEffect can happen

	// Load user from localStorage on first load
	useEffect(() => {
		try {
			const storedUser = localStorage.getItem("user");

			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		} catch (err) {
			console.error("Failed to parse stored user:", err);
			localStorage.removeItem("user");
		}

		setLoading(false);
	}, []);

	// Save to localStorage when user changes
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user)); // Log in
		} else {
			localStorage.removeItem("user"); // Log out
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
