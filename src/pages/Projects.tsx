import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const initialProjects = [
	{ name: "vlog 99", id: 1 },
	{ name: "code with me", id: 2 },
	{ name: "my first interview", id: 3 },
	{ name: "day in a life", id: 4 },
	{ name: "benchmark test", id: 5 },
	{ name: "unboxing", id: 6 },
	{ name: "vlog 99", id: 7 },
	{ name: "code with me", id: 8 },
	{ name: "my first interview", id: 9 },
	{ name: "day in a life", id: 10 },
	{ name: "benchmark test", id: 11 },
	{ name: "unboxing", id: 12 },
];

export default function Projects() {
	const [projects, setProjects] = useState<{ name: string }[]>([]);
	const { state } = useContext(UserContext);
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
		projects.push({ name: projectName });
		setProjects([...projects]);
		setProjectName("");
	};

	const renderProjects = projects.map((project) => {
		return (
			<div
				key={Math.random()}
				className="flex flex-col gap-5 bg-slate-800 text-slate-100 px-4 py-2 rounded-md w-40 items-center"
			>
				<div>{project.name}</div>
			</div>
		);
	});

	useEffect(() => {
		(async () => {
			const response = await fetch("http://localhost:8001/content", {
				headers: {
					Authorization: `Bearer ${state.user.jwtToken}`,
				},
			});
			const { error, data } = await response.json();
			if (error) return;
			setProjects(data);
		})();
	}, []);

	return (
		<div className="flex flex-col mx-auto gap-52 mt-20 px-40">
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
			<div className="flex gap-10 flex-wrap">{renderProjects}</div>
		</div>
	);
}
