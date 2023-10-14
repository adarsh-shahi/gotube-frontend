import { useContext } from "react";
import { ACTION_TYPE, UserContext } from "../context/UserContext";

export default function Setting() {
	const { dispatch } = useContext(UserContext);
	return (
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
	);
}
