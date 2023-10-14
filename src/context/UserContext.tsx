import React, { createContext, useReducer } from "react";

interface IStateType {
	user: {
		email: string;
		jwtToken: string;
		uType: string;
		refreshToken: string;
	};
}

const initialValue: IStateType = {
	user: {
		email: "",
		jwtToken: "",
		uType: "",
		refreshToken: "",
	},
};

interface IUserContextType {
	state: IStateType;
	dispatch: (action: IActionType) => void;
}

const UserContextValue: IUserContextType = {
	state: initialValue,
	dispatch: (action: IActionType) => {},
};

export const enum ACTION_TYPE {
	ADD_USER,
	REMOVE_USER,
}

interface IActionType {
	type: ACTION_TYPE;
	payload: IStateType;
}

const UserContext = createContext<IUserContextType>(UserContextValue);

const reducer = (state: IStateType, action: IActionType): IStateType => {
	switch (action.type) {
		case ACTION_TYPE.ADD_USER:
			return action.payload;
		case ACTION_TYPE.REMOVE_USER:
			// console.log(action.payload);
			return action.payload;
		default:
			throw new Error("unhandled action type");
	}
};

export default function Provider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialValue);

	const jwtToken = localStorage.getItem("jwtToken");
	const uType = localStorage.getItem("uType");
	const refreshToken = localStorage.getItem("refreshToken");
	const email = localStorage.getItem("email");
	console.log(jwtToken, uType, refreshToken, email);

	if (jwtToken !== null) state.user.jwtToken = jwtToken!;
	if (uType !== null) state.user.uType = uType!;
	if (refreshToken !== null) state.user.refreshToken = refreshToken!;
	if (email !== null) state.user.email = email!;
	console.log(state);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			{children}
		</UserContext.Provider>
	);
}

export { UserContext };
