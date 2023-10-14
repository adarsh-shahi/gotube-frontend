import { ReactElement, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
	children,
}: {
	children: ReactElement;
}) {
	const { state } = useContext(UserContext);
	console.log(state.user);

	if (state.user.jwtToken !== "") {
		console.log("here");
		return children;
	}
	return <Navigate to="/auth" />;
}
