import { ActionTypes } from "./actionTypes";

const logIn = (info, CONFIG) => {
	return {
		type: ActionTypes.LOGIN,
		payload: {info, CONFIG}
	}
}

const logOut = () => {
	localStorage.removeItem('CONFIG')
	return { type: ActionTypes.LOGOUT }
}

const setData = (data) => {
	return { type: ActionTypes.ADD_POSTS, payload: data }
}

const error = (message) => {
	return { type: ActionTypes.ERROR, payload:message }
}

export {logIn, logOut, setData, error}