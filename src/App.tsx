import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SideNavigation from "./components/SideNavigation";
import Teams from "./pages/Teams";
import Invitations from "./pages/Invitations";
import Setting from "./pages/Settings";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";

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
						<Route index element={<div>Home Page</div>} />
						<Route path="/teams/:id" element={<Projects />} />
						<Route path="/invitations" element={<Invitations />} />
						<Route path="/settings" element={<Setting />} />
					</Route>
					<Route path="/auth" element={<Auth />} />
					<Route path="*" element={<div>Page not found</div>} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
