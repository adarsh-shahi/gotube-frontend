import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SideNavigation from "./components/SideNavigation";
import Teams from "./pages/Teams";
import Invitations from "./pages/Invitations";
import Setting from "./pages/Settings";
import Login from "./pages/Login";

function App() {
	return (
		<BrowserRouter>
			<div className="flex">
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<SideNavigation />
							</ProtectedRoute>
						}
					>
						<Route index element={<Teams />} />
						<Route path="/invitations" element={<Invitations />} />
						<Route path="/settings" element={<Setting />} />
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
