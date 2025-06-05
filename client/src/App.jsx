import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/AuthPage/AuthPage";
import TodoPage from "./pages/TodoPage/TodoPage";
import WeeklyCalendarPage from "./pages/WeeklyCalendarPage/WeeklyCalendarPage";
import MonthlyCalendarPage from "./pages/MonthlyCalendarPage/MonthlyCalendarPage";
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

				<Route
					path="/calendar/week"
					element={
						<PrivateRoute>
							<WeeklyCalendarPage />
						</PrivateRoute>
					}
				/>

				<Route
					path="/calendar/month"
					element={
						<PrivateRoute>
							<MonthlyCalendarPage />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
