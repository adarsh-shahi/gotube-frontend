import { useContext, useEffect, useState } from "react";
import { ACTION_TYPE, UserContext } from "../context/UserContext";

export default function Setting() {
	const { state, dispatch } = useContext(UserContext);

	const [userData, setUserData] = useState({
		profileUrl: "",
		title: "",
		channelUrl: "",
		description: "",
	});

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("http://localhost:8001/profile", {
					headers: {
						Authorization: `Bearer ${state.user.jwtToken}`,
					},
				});
				const data = await response.json();
				setUserData({
					profileUrl: data.data.profileImage,
					title: data.data.title,
					channelUrl: data.data.channelUrl,
					description: data.data.description,
				});
			} catch (err) {
				alert(err);
			}
		})();
	}, []);

	return (
		<div>
			<div>
				<img
					src={userData.profileUrl}
					alt="user profile"
					width="200px"
					height="200px"
				/>
				<div>
					<div>{userData.title}</div>
					<div>{userData.channelUrl}</div>
					<div>{userData.description}</div>
				</div>
			</div>
			<button
				onClick={() => {
					localStorage.removeItem("jwtToken");
					localStorage.removeItem("email");
					localStorage.removeItem("refreshToken");
					localStorage.removeItem("uType");
					dispatch({
						type: ACTION_TYPE.REMOVE_USER,
						payload: {
							user: { email: "", jwtToken: "", uType: "", refreshToken: "" },
						},
					});
				}}
			>
				Logout
			</button>
		</div>
	);
}
