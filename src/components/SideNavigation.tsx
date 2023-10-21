import { NavLink, Outlet } from "react-router-dom";
import {
	IoMailUnreadSharp,
	IoMenu,
	IoPeopleSharp,
	IoSettingsSharp,
	IoChevronDown,
	IoChevronForwardSharp,
} from "react-icons/io5";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ACTION_TYPE, TeamContext } from "../context/TeamContext";

export default function SideNavigation() {
	const [isNavigationClosed, setIsNavigationClosed] = useState(false);
	const [isTeamsTabOpen, setIsTeamsTabOpen] = useState(false);
	const [teamsList, setTeamsList] = useState<
		{ profileImage: string; channelName: string; ownerId: string }[]
	>([]);
	const { state } = useContext(UserContext);
	const { dispatch: teamDispatch } = useContext(TeamContext);

	const handleNavigationClose = () => {
		setIsNavigationClosed((value) => !value);
	};

	const handleTeamDetails = async () => {
		const response = await fetch("http://localhost:8001/teams", {
			headers: {
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
		});
		const data = await response.json();
		if (data.error) {
			return;
		}
		setTeamsList(data.data);
	};

	const renderTeamList = teamsList.map((team) => {
		return (
			<NavLink
				onClick={() => {
					teamDispatch({
						type: ACTION_TYPE.CHANGE_TEAM,
						payload: { team: { ownerId: Number(team.ownerId) } },
					});
				}}
				to={"/team/" + team.ownerId}
				className="flex gap-3"
				key={team.ownerId}
			>
				<img
					src={team.profileImage}
					alt=""
					width="40px"
					height="40px"
					className="rounded-full object-cover"
				/>
				<div className="text-xl font-bold">{team.channelName}</div>
			</NavLink>
		);
	});

	return (
		<>
			<aside
				className={`bg-gray-800 sticky w-min top-0 text-white px-4 h-screen text-2xl pt-10 flex flex-col gap-10`}
			>
				<IoMenu className="cursor-pointer" onClick={handleNavigationClose} />
				{!isNavigationClosed && (
					<div className=" flex flex-col gap-5 px-6">
						{state.user.uType === "user" && (
							<div className="flex flex-col gap-3">
								<div
									className="flex gap-3 items-center cursor-pointer"
									onClick={() => {
										if (!isTeamsTabOpen) {
											handleTeamDetails();
										}
										setIsTeamsTabOpen(!isTeamsTabOpen);
									}}
								>
									<IoPeopleSharp />
									<h1>Teams</h1>
									{isTeamsTabOpen ? (
										<IoChevronDown className="w-6 h-6" />
									) : (
										<IoChevronForwardSharp />
									)}
								</div>
								{isTeamsTabOpen && renderTeamList}
							</div>
						)}
						{state.user.uType === "owner" && (
							<NavLink to="/team/-1" className={`flex gap-3 items-center`}>
								<IoPeopleSharp />
								<h1>Teams</h1>
							</NavLink>
						)}
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
