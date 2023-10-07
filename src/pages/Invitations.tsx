import { useContext, useEffect, useState } from "react";
import Roles from "../contants/roles";
import { UserContext } from "../context/UserContext";

interface IInviteType {
	email: string;
	role: string;
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
				Authorization: `Bearer ${state.user.token}`,
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
					Authorization: `Bearer ${state.user.token}`,
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

	const handleDeleteInvite = async (list: { email: string; role: string }) => {
		const resposne = await fetch("http://localhost:8001/invite", {
			method: "delete",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${state.user.token}`,
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

	const renderedList = invitations.map((list) => {
		return (
			<div key={list.email + list.role} className="flex justify-between">
				<div className="w-min font-medium text-lg">{list.email}</div>
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
				<button
					onClick={() => {
						handleDeleteInvite(list);
					}}
					className="w-min bg-red-700 text-white px-2 py-1 rounded-2xl"
				>
					Cancel
				</button>
			</div>
		);
	});

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("http://localhost:8001/invite", {
					headers: {
						Authorization: `Bearer ${state.user.token}`,
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
			<section className="flex flex-col border-2 border-gray-700 px-6 py-8 gap-5 w-3/4">
				<h1>Invitatins Sent.</h1>
				<section className="flex flex-col justify-around gap-3">
					{renderedList}
				</section>
			</section>
		</div>
	);
}
