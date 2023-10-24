import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

interface IContentType {
	projectName: string;
	title: string;
	description: string;
	video: string;
	tags: string;
}
export default function Content() {
	const [content, setContent] = useState<IContentType>({
		projectName: "",
		title: "",
		description: "",
		video: "",
		tags: "",
	});
	const { state } = useContext(UserContext);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState("");
	const [file, setFile] = useState<null | File>(null);

	const [ownerId, setOwnerId] = useState("");
	const [contentId, setContentId] = useState("");

	const handleSaveChanges = async () => {
		console.log(file);
		console.log(typeof file);

		try {
			// send meta data to server and get pre signed urls to upload to s3
			const signedUrlResponse = await fetch(
				`http://localhost:8001/video?ownerId=${ownerId}&contentId=${contentId}`,
				{
					method: "put",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${state.user.jwtToken}`,
					},
					body: JSON.stringify({
						type: file?.type.split("/")[1],
						size: file?.size,
					}),
				}
			);
			const { data } = await signedUrlResponse.json();
			const { url, key } = data;
			const s3Upload = await fetch(url, {
				method: "put",
				body: file,
			});
			await s3Upload.json();

			//save key to DB
		} catch (err) {
			console.log(err);
		}

		// after successfull uploading send message to server
	};

	useEffect(() => {
		const contendId =
			window.location.href.split("/")[
				window.location.href.split("/").length - 1
			];
		const ownerId =
			window.location.href.split("/")[
				window.location.href.split("/").length - 3
			];
		setContentId(contendId);
		setOwnerId(ownerId);
		(async () => {
			const response = await fetch(
				`http://localhost:8001/content?ownerId=${ownerId}&contentId=${contendId}`,
				{
					headers: {
						Authorization: `Bearer ${state.user.jwtToken}`,
					},
				}
			);
			const { error, data } = await response.json();
			if (error) return;
			console.log(data);
		})();
	}, []);

	return (
		<div className="m-5 border-2 border-gray-600 rounded-2xl grow grid grid-cols-2 grid-rows-6 p-4 gap-5 relative">
			<div className="col-span-full">Project Name</div>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl row-span-1"
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl row-span-3"
				type="file"
				placeholder="Video File"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setFile(e.target!.files![0]);
				}}
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl"
				type="text"
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<input
				className="h-min border-2 border-gray-600 px-2 py-1 text-2xl rounded-xl"
				type="text"
				placeholder="Tags"
				width="100px"
				height="100px"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
			/>
			<div className="absolute right-10 bottom-10 flex gap-5">
				<button
					className="bg-green-500 text-white px-3 py-1 font-semibold text-lg rounded-2xl"
					onClick={handleSaveChanges}
				>
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
