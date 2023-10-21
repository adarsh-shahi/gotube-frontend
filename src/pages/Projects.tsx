import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useLocation } from "react-router-dom";
import { ACTION_TYPE, TeamContext } from "../context/TeamContext";

export default function Projects() {
	const [projects, setProjects] = useState<{ name: string; id: number }[]>([]);
	const { state } = useContext(UserContext);
	const { state: teamState } = useContext(TeamContext);
	console.log(projects);

	const [projectName, setProjectName] = useState("");
	const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const response = await fetch(`http://localhost:8001/content`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
			body: JSON.stringify({ name: projectName }),
		});
		const { error } = await response.json();
		if (error) {
			return;
		}
		setProjectName("");
		const response2 = await fetch(`http://localhost:8001/contents`, {
			headers: {
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
		});
		const { error: error2, data } = await response2.json();
		if (error2) return;
		setProjects([...data]);
	};

	const renderProjects = projects.map((project) => {
		return (
			<Link
				to={`/team/${
					window.location.href.split("/")[
						window.location.href.split("/").length - 1
					]
				}/content/${project.id}`}
				key={Math.random()}
				className="flex flex-col gap-5 bg-slate-800 text-slate-100 px-4 py-2 rounded-md w-40 items-center"
			>
				<div>{project.name}</div>
			</Link>
		);
	});

	useEffect(() => {
		let URL = `http://localhost:8001/contents`;
		if (state.user.uType === "user") {
			URL = `http://localhost:8001/contents?id=${
				window.location.href.split("/")[
					window.location.href.split("/").length - 1
				]
			}`;
		}

		(async () => {
			const response = await fetch(URL, {
				headers: {
					Authorization: `Bearer ${state.user.jwtToken}`,
				},
			});
			const { error, data } = await response.json();
			if (error) return;
			setProjects(data);
		})();
	}, [teamState && window.location.href]);

	return (
		<div className="flex flex-col mx-auto gap-52 mt-20 px-40">
			<div>Projects</div>
			{state.user.uType === "owner" && (
				<form
					onSubmit={handleCreateProject}
					className="bg-slate-700 py-4 px-4 flex gap-5 mx-auto rounded-sm"
				>
					<input
						type="text"
						value={projectName}
						onChange={(e) => {
							setProjectName(e.target.value);
						}}
						placeholder="Project Name"
						className="px-4"
					/>
					<button className="bg-slate-300 px-2 py-1 font-semibold rounded-xl">
						Create Project
					</button>
				</form>
			)}
			<div className="flex gap-10 flex-wrap">{renderProjects}</div>
		</div>
	);
}
