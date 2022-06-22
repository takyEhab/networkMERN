import { ActionTypes } from "./actionTypes";
import { combineReducers } from "redux";

const postsStateInitial = {
  posts: null,
  isLoading: true,
  error: "",
};

const myInfoStateInitial = {
  infoIsLoading: true,
  myInfo: null,
  isLoggedIn: false,
  CONFIG: JSON.parse(localStorage.getItem("CONFIG")),
};

const postsReducer = (state = postsStateInitial, action) => {
  switch (action.type) {
    case ActionTypes.ADD_POSTS:
      return {
        ...state,
        isLoading: false,
        posts: action.payload,
        error: "",
      };
    case ActionTypes.Remove_POSTS:
      return postsStateInitial;
    case ActionTypes.ERROR:
      return {
        ...state,
        isLoading: false,
        posts: null,
        error: action.payload
          ? action.payload
          : "Something went wrong ,Can't Load Posts",
      };
    default:
      return { ...state };
  }
};
const myInfoReducer = (state = myInfoStateInitial, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        infoIsLoading: false,
        myInfo: action.payload.info,
        CONFIG: action.payload.CONFIG,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        myInfo: null,
        infoIsLoading: false,
        CONFIG: {},
      };
    default:
      return { ...state };
  }
};

const reducers = combineReducers({
  postsState: postsReducer,
  myInfoState: myInfoReducer,
});
export default reducers;
