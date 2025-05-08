import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import TodoPage from "./pages/TodoPage";
import "./App.css";

function App() {
	return (
		<>
			<Navbar />
			<TodoPage />
		</>
	);
}

export default App;
