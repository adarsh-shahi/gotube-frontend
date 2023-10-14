import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ACTION_TYPE, UserContext } from "../context/UserContext";

const handleCreatorOauthSignup = () => {
	const ROOT_URL = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI as string,
		client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/youtube",
			"https://www.googleapis.com/auth/youtube.channel-memberships.creator",
			"https://www.googleapis.com/auth/youtube.force-ssl",
			"https://www.googleapis.com/auth/youtube.readonly",
			"https://www.googleapis.com/auth/youtube.upload",
			"https://www.googleapis.com/auth/youtubepartner",
			"https://www.googleapis.com/auth/youtubepartner-channel-audit",
		].join(" "),
		state: "owner",
	};

	const queryString = new URLSearchParams(options);
	const finalSearch = `${ROOT_URL}?${queryString.toString()}`;
	console.log(finalSearch);
	return finalSearch;
};

const handleUserOauthSignup = () => {
	const ROOT_URL = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI as string,
		client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
		state: "user",
	};

	const queryString = new URLSearchParams(options);
	const finalSearch = `${ROOT_URL}?${queryString.toString()}`;
	console.log(finalSearch);
	return finalSearch;
};

export default function Auth() {
	const data = useContext(UserContext);
	const navigate = useNavigate();

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const reponseJSON = queryParams.get("jsonData");
	console.log(reponseJSON);
	if (reponseJSON) {
		const { data: userData } = JSON.parse(reponseJSON);
		console.log(userData);
		localStorage.setItem("jwtToken", userData.jwtToken);
		localStorage.setItem("refreshToken", userData.refreshToken);
		localStorage.setItem("uType", userData.uType);
		localStorage.setItem("email", userData.email);

		data.dispatch({
			type: ACTION_TYPE.ADD_USER,
			payload: {
				user: userData,
			},
		});
		navigate("/");
	}

	const [isCreatorOpen, setIsCreatorOpen] = useState(true);
	const [isSignin, setIsSignin] = useState(false);
	return (
		<div className="relative w-screen h-screen">
			<div
				className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/3 h-2/4 rounded-2xl text-white ${
					isCreatorOpen ? "bg-slate-900" : "bg-slate-700"
				}`}
			>
				<div className="flex h-1/5">
					<div
						className={`cursor-pointer bg-slate-900 font-semibold ${
							isCreatorOpen ? "text-2xl" : "text-xl"
						}  grow text-center flex items-center justify-center`}
						onClick={() => {
							setIsCreatorOpen(true);
						}}
					>
						Creator
					</div>
					<div
						className={`cursor-pointer bg-slate-700 font-semibold ${
							isCreatorOpen ? "text-xl" : "text-2xl"
						}  grow text-center flex items-center justify-center`}
						onClick={() => {
							setIsCreatorOpen(false);
						}}
					>
						User
					</div>
				</div>
				<div className={`flex justify-center items-center py-2 h-full`}>
					{isCreatorOpen && isSignin && (
						<section className="flex flex-col items-center gap-5">
							<button className="bg-slate-200 text-slate-800 rounded-xl px-4 py-1 font-bold text-xl">
								Sign In with Youtube
							</button>
							<div className="text-lg">--------OR---------</div>
							<form className="flex flex-col gap-3 items-center">
								<input
									type="email"
									placeholder="Email"
									className="px-3 py-2 rounded-lg"
								/>
								<input
									type="password"
									placeholder="Password"
									className="px-3 py-2 rounded-lg"
								/>
								<button className="bg-slate-50 text-slate-700 px-3 py-1 rounded-2xl font-bold">
									Sign In
								</button>
							</form>
							<div className="flex text-lg">
								<h1>Don't have an accout ?&nbsp;</h1>
								<button
									className="text-blue-500 font-semibold"
									onClick={() => {
										setIsSignin(false);
									}}
								>
									Signup
								</button>
							</div>
						</section>
					)}
					{isCreatorOpen && !isSignin && (
						<section className="flex flex-col gap-5">
							<a
								href={handleCreatorOauthSignup()}
								className="bg-slate-200 text-slate-700 px-3 py-1 rounded-2xl font-bold text-2xl"
							>
								Sign up with Youtube
							</a>
							<div className="text-xl">
								Already have an account ? &nbsp;
								<button
									className="text-blue-500 font-semibold"
									onClick={() => {
										setIsSignin(true);
									}}
								>
									Signin
								</button>
							</div>
						</section>
					)}
					{!isCreatorOpen && isSignin && (
						<section className="flex flex-col items-center gap-5">
							<button className="bg-slate-200 text-slate-800 rounded-xl px-4 py-1 font-bold text-xl">
								Sign In with Google
							</button>
							<div className="text-lg">--------OR---------</div>
							<form className="flex flex-col gap-3 items-center">
								<input
									type="email"
									placeholder="Email"
									className="px-3 py-2 rounded-lg"
								/>
								<input
									type="password"
									placeholder="Password"
									className="px-3 py-2 rounded-lg"
								/>
								<button className="bg-slate-50 text-slate-700 px-3 py-1 rounded-2xl font-bold">
									Sign In
								</button>
							</form>
							<div className="flex text-lg">
								<h1>Don't have an accout ?&nbsp;</h1>
								<button
									className="text-blue-500 font-semibold"
									onClick={() => {
										setIsSignin(false);
									}}
								>
									Signup
								</button>
							</div>
						</section>
					)}
					{!isCreatorOpen && !isSignin && (
						<section className="flex flex-col gap-5">
							<a
								href={handleUserOauthSignup()}
								className="bg-slate-200 text-slate-700 px-3 py-1 rounded-2xl font-bold text-2xl"
							>
								Sign up with Google
							</a>
							<div className="text-xl">
								Already have an account ? &nbsp;
								<button
									className="text-blue-500 font-semibold"
									onClick={() => {
										setIsSignin(true);
									}}
								>
									Signin
								</button>
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
