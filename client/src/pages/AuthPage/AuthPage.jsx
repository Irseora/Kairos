import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// import BunnyIcon from "../../assets/icons/BunnyIcon";
import "./AuthPage.css";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
	const navigate = useNavigate();
	const { setUser } = useAuth();

	return (
		<>
			<div className="container">
				<h3 className="text-center">Sign In</h3>

				{/* <div className="d-flex justify-content-center">
					<button
						className="btn auth-button d-flex gap-2 align-items-center"
						onClick={handleLogin}
					>
						<BunnyIcon size="32" color="#2a272c" />
						Sign in with Google
					</button>
				</div> */}

				<GoogleLogin
					onSuccess={async (credentialResponse) => {
						const id_token = credentialResponse.credential;

						const res = await fetch("http://localhost:3000/api/auth/google", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ token: id_token }),
						});

						const data = await res.json();
						setUser(data.user);
						navigate("/todos");
					}}
					onError={() => {
						console.log("Login failed!");
					}}
				/>
			</div>
		</>
	);
};

export default AuthPage;
