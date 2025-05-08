import { NavLink } from "react-router-dom";
import BunnyIcon from "../../assets/icons/BunnyIcon";
import "./Navbar.css";

const navItems = [
	{ label: "To-Do Lists", path: "/todos" },
	{ label: "Calendar", path: "/calendar" },
	{ label: "Pomodoro", path: "/pomodoro" },
	{ label: "Stats", path: "/stats" },
];

const Navbar = () => {
	return (
		<nav className="navbar navbar-expand fixed-top">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="/">
					<BunnyIcon />
				</NavLink>

				<div className="navbar-nav ms-auto d-flex flex-row gap-4">
					{navItems.map(({ label, path }) => (
						<NavLink
							className="nav-link"
							key={path}
							to={path}
							// Highlight if its current active page
							style={({ isActive }) => ({
								backgroundColor: isActive ? "#FFC6C6" : "",
							})}
						>
							{label}
						</NavLink>
					))}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
