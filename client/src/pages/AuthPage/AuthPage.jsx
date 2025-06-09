import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "./AuthPage.css";

const AuthPage = () => {
	const navigate = useNavigate();
	const { setUser } = useAuth();

	return (
		<>
			<div className="container auth-container">
				<h3 className="text-center pb-2">Sign In</h3>

				<GoogleLogin
					shape="pill"
					onSuccess={async (credentialResponse) => {
						const id_token = credentialResponse.credential;

						const res = await fetch(
							`${import.meta.env.VITE_API_BASE_URL}/auth/google`,
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ token: id_token }),
							}
						);

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
