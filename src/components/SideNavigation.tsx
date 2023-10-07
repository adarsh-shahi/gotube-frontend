import { NavLink, Outlet } from "react-router-dom";
import {
	IoMailUnreadSharp,
	IoMenu,
	IoPeopleSharp,
	IoSettingsSharp,
} from "react-icons/io5";
import { useState } from "react";

export default function SideNavigation() {
	const [isNavigationClosed, setIsNavigationClosed] = useState(false);

	const handleNavigationClose = () => {
		setIsNavigationClosed((value) => !value);
	};
	return (
		<>
			<aside
				className={`bg-gray-800 sticky w-min top-0 text-white px-4 h-screen text-2xl pt-10 flex flex-col gap-10`}
			>
				<IoMenu className="cursor-pointer" onClick={handleNavigationClose} />
				{!isNavigationClosed && (
					<div className=" flex flex-col gap-5 px-6">
						<NavLink to="/" className={`flex gap-3 items-center`}>
							<IoPeopleSharp />
							<h1>Teams</h1>
						</NavLink>
						<NavLink to="/invitations" className={`flex gap-3 items-center`}>
							<IoMailUnreadSharp />
							<h1>Invitations</h1>
						</NavLink>
						<NavLink to="/settings" className={`flex gap-3 items-center`}>
							<IoSettingsSharp />
							<h1>Settings</h1>
						</NavLink>
					</div>
				)}
			</aside>
			<Outlet />
		</>
	);
}
