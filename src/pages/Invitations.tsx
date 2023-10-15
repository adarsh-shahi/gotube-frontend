import { useContext, useEffect, useState } from "react";
import Roles from "../contants/roles";
import { UserContext } from "../context/UserContext";

interface IInviteType {
	email: string;
	role: string;
	channelName?: string;
}

export default function Invitation() {
	const { state } = useContext(UserContext);
	const [sendInvite, setSendInvite] = useState({
		email: "",
		role: "thumbnail",
	});

	const [invitations, setInvitations] = useState<IInviteType[]>([]);

	const handleSendInvite = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const resposne = await fetch("http://localhost:8001/invite", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
			body: JSON.stringify(sendInvite),
		});
		const data = await resposne.json();
		if (data.error) {
			alert("failed");
			return;
		}
		setInvitations([
			...invitations,
			{ email: sendInvite.email, role: sendInvite.role },
		]);
	};

	const roleOptions = Roles.map((role) => {
		return <option value={role.toLowerCase()}>{role}</option>;
	});

	const handleUpdateRole = async (email: string, role: string) => {
		try {
			const response = await fetch("http://localhost:8001/invite", {
				method: "put",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${state.user.jwtToken}`,
				},
				body: JSON.stringify({ email, role }),
			});
			const data = await response.json();
			if (data.error) {
				alert(data.data.error);
				return;
			}
			const updatedList = invitations.map((invite) => {
				if (invite.email === email) {
					return { email, role };
				}
				return invite;
			});
			setInvitations(updatedList);
		} catch (err) {
			alert(err);
		}
	};

	const handleDeleteInviteOwner = async (list: {
		email: string;
		role: string;
	}) => {
		const resposne = await fetch("http://localhost:8001/invite", {
			method: "delete",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
			body: JSON.stringify({ email: list.email }),
		});
		const data = await resposne.json();
		if (data.error) {
			alert(data.data.message);
			return;
		}
		const updatedList = invitations.filter((invite) => {
			return !(invite.email === list.email && invite.role === list.role);
		});
		console.log("after deleting");
		console.log(updatedList);
		setInvitations(updatedList);
	};

	const handleDeleteInviteUser = async (
		accept: boolean,
		email: string,
		role: string
	) => {
		const response = await fetch("http://localhost:8001/invite", {
			method: "delete",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${state.user.jwtToken}`,
			},
			body: JSON.stringify({ email, accept, role }),
		});
		const data = await response.json();
		if (data.error) {
			alert(data.error);
			return;
		}
		const updatedList = invitations.filter((invite) => {
			return !(invite.email === email && invite.role === role);
		});
		setInvitations(updatedList);
	};

	const renderedList = invitations?.map((list) => {
		return (
			<div key={list.email + list.role} className="flex justify-between">
				<div className="w-min font-medium text-lg">{list.email}</div>
				{state.user.uType === "user" && (
					<div className="w-max font-medium text-lg">{list.channelName}</div>
				)}
				{state.user.uType === "owner" ? (
					<select
						className="w-min"
						name="roles"
						id="roles"
						value={list.role}
						onChange={(e) => {
							handleUpdateRole(list.email, e.target.value);
						}}
					>
						{roleOptions}
					</select>
				) : (
					<div>{list.role.toUpperCase()}</div>
				)}
				{state.user.uType === "owner" ? (
					<button
						onClick={() => {
							handleDeleteInviteOwner(list);
						}}
						className="w-min bg-red-700 text-white px-2 py-1 rounded-2xl"
					>
						Cancel
					</button>
				) : (
					<div className="flex gap-5">
						<button
							onClick={() => {
								handleDeleteInviteUser(true, list.email, list.role);
							}}
							className="bg-green-600 px-3 rounded-2xl"
						>
							Accept
						</button>
						<button
							onClick={() => {
								handleDeleteInviteUser(false, list.email, list.role);
							}}
							className="bg-red-700 px-3 rounded-2xl"
						>
							Reject
						</button>
					</div>
				)}
			</div>
		);
	});

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("http://localhost:8001/invite", {
					headers: {
						Authorization: `Bearer ${state.user.jwtToken}`,
					},
				});
				const data = await response.json();
				if (data.error) {
					return;
				}
				const { data: lists } = data;
				setInvitations(lists);
			} catch (err) {
				alert("failed");
			}
		})();
	}, []);

	return (
		<div className="w-screen h-screen flex flex-col items-center pt-10 gap-40">
			{state.user.uType === "owner" && (
				<form onSubmit={handleSendInvite} className={` flex gap-5`}>
					<input
						type="email"
						className="border-2 border-gray-700 px-4 py-2"
						placeholder="send invitations"
						value={sendInvite.email}
						onChange={(e) => {
							setSendInvite({ ...sendInvite, email: e.target.value });
						}}
					/>
					<select
						name="roles"
						value={sendInvite.role}
						id="roles"
						className="px-4 rounded-2xl"
						onChange={(e) => {
							setSendInvite({ ...sendInvite, role: e.target.value });
						}}
					>
						{roleOptions}
					</select>
					<button className="bg-cyan-700 text-white rounded-2xl px-3">
						Search
					</button>
				</form>
			)}
			<section className="flex flex-col border-2 border-gray-700 px-6 py-8 gap-5 w-3/4">
				<h1>Invitations {state.user.uType === "owner" ? "Sent." : ""}</h1>
				<section className="flex flex-col justify-around gap-3">
					{renderedList}
				</section>
			</section>
		</div>
	);
}
