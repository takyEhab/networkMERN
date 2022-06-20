import React, {
  lazy,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { funcContext } from "./components/funcContext";
import { api } from "./components/axios";
import "./App.css";
import Header from "./components/Header";
import Loading from "./components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { logIn, error, logOut, setData } from "./components/store/actions";
import { useSnackbar } from "notistack";

const Register = lazy(() => import("./components/SignUp"));
const Login = lazy(() => import("./components/SignIn"));
const Following = lazy(() => import("./components/following"));
const SpringModal = lazy(() => import("./components/basicmodal"));
const User = lazy(() => import("./components/User"));
const Posts = lazy(() => import("./components/Posts"));

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postsState.posts);
  const CONFIG = useSelector((state) => state.myInfoState.CONFIG);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    api
      .get("posts/get-all")
      .then((posts) => {
        dispatch(setData(posts.data));
      })
      .catch((err) => {
        dispatch(error(err.response.data ? err.response.data : null));
      });
    api
      .get("user/profile/", CONFIG)
      .then((info) => {
        dispatch(logIn(info.data, CONFIG));
      })
      .catch(() => {
        dispatch(logOut());
      });
    // remove posts from state

    // return (
    // )
  }, []);

  const follow = async (user_id) => {
    try {
      let res = await api
        .patch(`user/follow/${user_id}/`, {}, CONFIG)
        .then((res) => res.data);
      enqueueSnackbar(`You ${res.operation} ${res.user.username}!`, {
        variant: "info",
      });
      return res;
    } catch (err) {
      if (err.response.status === 403) {
        enqueueSnackbar("You have to be logged in", { variant: "info" });
      } else {
        enqueueSnackbar(`${err.message}!`, { variant: "error" });
      }
    }
  };

  const ProviderValue = { follow };

  return (
    <Router>
      <funcContext.Provider value={ProviderValue}>
        <Header />

        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/">
              <SpringModal />

              <Posts />
            </Route>

            <Route exact path="/profile/:name" component={User} />
            <Route exact path="/following" component={Following} />
            <Route exact path="/register">
              <Register />
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>
          </Switch>
        </Suspense>
      </funcContext.Provider>
    </Router>
  );
}
