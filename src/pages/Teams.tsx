import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Team() {
	const { state, dispatch } = useContext(UserContext);
	return (
		<div className="m-5 border-2 border-gray-600 rounded-2xl grow grid grid-cols-2 p-4 gap-5 relative">
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl"
				type="text"
				placeholder="Title"
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 row-span-2 text-2xl rounded-xl"
				type="file"
				placeholder="Video File"
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl"
				type="text"
				placeholder="Description"
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl"
				type="text"
				placeholder="Tags"
				width="100px"
				height="100px"
			/>
			<div className="absolute right-10 bottom-10 flex gap-5">
				<button className="bg-green-500 text-white px-3 py-1 font-semibold text-lg rounded-2xl">
					Save Changes
				</button>
				{state.user.uType === "owner" && (
					<button className="bg-red-500 text-white px-3 py-1 font-semibold text-lg rounded-2xl">
						Upload To Youtube
					</button>
				)}
			</div>
		</div>
	);
}
