import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/AuthPage/AuthPage";
import TodoPage from "./pages/TodoPage/TodoPage";
import WeeklyCalendarPage from "./pages/WeeklyCalendarPage/WeeklyCalendarPage";
import MonthlyCalendarPage from "./pages/MonthlyCalendarPage/MonthlyCalendarPage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import PomodoroPage from "./pages/PomodoroPage/PomodoroPage";

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

				{/* <Route
					path="/calendar/month"
					element={
						<PrivateRoute>
							<MonthlyCalendarPage />
						</PrivateRoute>
					}
				/> */}

				<Route
					path="/pomodoro"
					element={
						<PrivateRoute>
							<PomodoroPage />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
