import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostitIcon from "../../assets/icons/PostitIcon";
import "./Navbar.css";

const navItems = [
	{ label: "To-Do Lists", path: "/todos" },
	{ label: "Calendar", path: "/calendar" },
	{ label: "Pomodoro", path: "/pomodoro" },
	{ label: "Stats", path: "/stats" },
];

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const { user, setUser } = useAuth();

	const isLoginPage = location.pathname === "/";

	return (
		<nav className="navbar navbar-expand fixed-top">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="/">
					<PostitIcon size="36" color="#2a272c" />
				</NavLink>

				{/* Show if not on login page & user loged in */}
				{!isLoginPage && user && (
					<div className="navbar-nav ms-auto d-flex flex-row gap-4">
						{navItems.map(({ label, path }) => (
							<NavLink
								className="nav-link"
								key={path}
								to={path}
								// Highlight if its current active page
								style={({ isActive }) => ({
									backgroundColor: isActive ? "var(--accent30)" : "",
									borderRadius: isActive ? "0.8rem" : "",
								})}
							>
								{label}
							</NavLink>
						))}
						<NavLink
							className="nav-link"
							to="#"
							onClick={(e) => {
								e.preventDefault();
								setUser(null);
								navigate("/");
							}}
						>
							Log Out
						</NavLink>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
