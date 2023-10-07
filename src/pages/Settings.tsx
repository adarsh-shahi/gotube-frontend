export default function Setting() {
	return (
		<button
			onClick={() => {
				localStorage.removeItem("userToken");
			}}
		>
			Logout
		</button>
	);
}
