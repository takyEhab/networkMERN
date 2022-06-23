import { Fragment } from "react";
import { useSelector } from "react-redux";
import AddPost from "../components/AddPost";
import Posts from "../components/Posts";

export default function Home() {
  // add side bar for chats and make them pop up from the bottom of the screen
  // const myInfo = useSelector((state) => state.myInfoState);

  return (
    <Fragment>
      <AddPost />
      <Posts />
    </Fragment>
  );
}
