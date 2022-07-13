import { CssBaseline } from "@mui/material";
import { Fragment, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddPost from "../components/AddPost";
import Posts from "../components/Posts";
import { funcContext } from "../context";
import { logOut, removePosts } from "../store/actions";
import Login from "./Login";
import api from "../axios";

export default function Home() {
  // add side bar for chats and make them pop up from the bottom of the screen
  // const myInfo = useSelector((state) => state.myInfoState);
  const { getPosts } = useContext(funcContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removePosts());
    getPosts();
    return () => dispatch(removePosts());
  }, []);
  return (
    <Fragment>
      <CssBaseline />
      <AddPost />
      <Posts />
    </Fragment>
  );
}
