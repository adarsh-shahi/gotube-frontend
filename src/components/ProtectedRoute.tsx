import { ReactElement, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
	children,
}: {
	children: ReactElement;
}) {
	const { state } = useContext(UserContext);
	if (state.user.token) {
		return children;
	}
	return <Navigate to="/login" />;
}
