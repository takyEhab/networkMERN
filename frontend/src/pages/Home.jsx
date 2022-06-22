import { Fragment } from "react";
import { useSelector } from "react-redux";
import AddPost from "../components/AddPost";
import Posts from "../components/Posts";

export default function Home() {
  
  return (
    <Fragment>
      <AddPost />
      <Posts />
    </Fragment>
  );
}
