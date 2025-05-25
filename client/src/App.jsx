import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/AuthPage/AuthPage";
import TodoPage from "./pages/TodoPage/TodoPage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
	return (
		<>
			<Navbar />

			<Routes>
				<Route path="/" element={<AuthPage />} />

				<Route
					path="/todos"
					element={
						<PrivateRoute>
							<TodoPage />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
