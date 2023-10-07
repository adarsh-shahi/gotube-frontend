import React, { createContext, useReducer } from "react";

interface IStateType {
	user: {
		email: string;
		token: string;
		utype: string;
	};
}

const initialValue: IStateType = {
	user: {
		email: "",
		token: "",
		utype: "",
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
		default:
			throw new Error("unhandled action type");
	}
};

export default function Provider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialValue);
	const token = localStorage.getItem("userToken");
	if (token) state.user.token = token;
	UserContextValue.state = state;
	UserContextValue.dispatch = dispatch;

	return (
		<UserContext.Provider value={UserContextValue}>
			{children}
		</UserContext.Provider>
	);
}

export { UserContext };
