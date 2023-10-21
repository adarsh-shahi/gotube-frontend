import { createContext, useReducer } from "react";

interface IStateType {
	team: {
		ownerId: number;
	};
}

const initialValue: IStateType = {
	team: {
		ownerId: -1,
	},
};

interface IUserContextType {
	state: IStateType;
	dispatch: (action: IActionType) => void;
}

export const enum ACTION_TYPE {
	CHANGE_TEAM,
}

interface IActionType {
	type: ACTION_TYPE;
	payload: IStateType;
}

const initialTeamContextValue: IUserContextType = {
	state: initialValue,
	dispatch(action) {},
};

export const TeamContext = createContext<IUserContextType>(initialTeamContextValue);

const reducer = (state: IStateType, action: IActionType): IStateType => {
	switch (action.type) {
		case ACTION_TYPE.CHANGE_TEAM:
			return action.payload;
		default:
			throw new Error("unhandled case");
	}
};

export default function Provider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialValue);

	return (
		<TeamContext.Provider value={{ state, dispatch }}>
			{children}
		</TeamContext.Provider>
	);
}
