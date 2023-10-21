import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SideNavigation from "./components/SideNavigation";
import Content from "./pages/Content";
import Invitations from "./pages/Invitations";
import Setting from "./pages/Settings";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import Provider from "./context/TeamContext";

function App() {
	return (
		<BrowserRouter>
			<Provider>
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
							<Route path="/team/:id" element={<Projects />} />
							<Route path="/team/:id/content/:id" element={<Content />} />
							<Route path="/invitations" element={<Invitations />} />
							<Route path="/settings" element={<Setting />} />
						</Route>
						<Route path="/auth" element={<Auth />} />
						<Route path="*" element={<div>Page not found</div>} />
					</Routes>
				</div>
			</Provider>
		</BrowserRouter>
	);
}

export default App;
