import React, { useContext, useState } from "react";
import { ACTION_TYPE, UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface IInputType {
	email: string;
	password: string;
	isCreator?: boolean;
}

const initialValue: IInputType = {
	email: "",
	password: "",
	isCreator: false,
};

export default function Login() {
	const { dispatch } = useContext(UserContext);
	const [input, setInput] = useState(initialValue);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const uType = input.isCreator ? "owner" : "user";
			delete input.isCreator;
			const response = await fetch("http://localhost:8001/login", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...input,
					utype: uType,
				}),
			});
			const data = await response.json();
			console.log(data);

			if (data.error) {
				alert(data.message);
				return;
			}
			const { token, utype } = data.data;

			localStorage.setItem("userToken", token);
			localStorage.setItem("uType", data.data.utype);
			dispatch({
				type: ACTION_TYPE.ADD_USER,
				payload: {
					user: {
						email: input.email,
						token,
						utype,
					},
				},
			});
			navigate("/");
		} catch (err) {}
	};

	return (
		<div className="w-screen h-screen relative">
			<form
				onSubmit={handleLogin}
				className="flex flex-col border-2 px-14 py-24 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-10"
			>
				<input
					className="border-2 px-6 py-3"
					type="email"
					value={input.email}
					onChange={(e) => {
						setInput({ ...input, email: e.target.value });
					}}
					placeholder="Email"
				/>
				<input
					className="border-2 px-6 py-3"
					type="password"
					value={input.password}
					onChange={(e) => {
						setInput({ ...input, password: e.target.value });
					}}
					placeholder="Password"
				/>
				<div className="flex gap-5">
					<input
						type="checkbox"
						checked={input.isCreator}
						onChange={(e) => {
							console.log(e.target.value);
							setInput({ ...input, isCreator: !input.isCreator });
						}}
					/>
					<h2>Are you creator</h2>
				</div>
				<button className="bg-cyan-600 text-white px-4 py-2">LOGIN</button>
			</form>
		</div>
	);
}
