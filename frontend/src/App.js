import React, { lazy, useEffect, useCallback, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { funcContext } from "./context";
import Header from "./components/Header";
import Loading from "./components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { logIn, error, logOut, setData, removePosts } from "./store/actions";
import { useSnackbar } from "notistack";
import api from "./axios";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Following = lazy(() => import("./pages/following"));
const Profile = lazy(() => import("./pages/Profile"));
const Home = lazy(() => import("./pages/Home"));

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postsState.posts);
  const CONFIG = useSelector((state) => state.myInfoState.CONFIG);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getPosts();
    api
      .get("user/profile/", CONFIG)
      .then((info) => {
        dispatch(logIn(info.data, CONFIG));
      })
      .catch(() => {
        dispatch(logOut());
      });
    return () => dispatch(removePosts());
  }, []);

  const getPosts = useCallback(() => {
    api
      .get("posts/get-all")
      .then((posts) => {
        dispatch(setData(posts.data));
      })
      .catch((err) => {
        dispatch(error(err.response.data ? err.response.data : null));
      });
  }, [posts]);

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

  const ProviderValue = { getPosts, follow };

  return (
    <Router>
      <funcContext.Provider value={ProviderValue}>
        <Header />

        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile/:name" component={Profile} />
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
