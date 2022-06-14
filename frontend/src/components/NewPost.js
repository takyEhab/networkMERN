import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { funcContext } from "./funcContext";
import { useSnackbar } from "notistack";
import { api } from "./axios";
import { useDispatch, useSelector } from "react-redux";
import {  setData } from "./store/actions"

export default function NewPost(props) {
  const dispatch = useDispatch()

  const [post, setPost] = useState("");
  // const [isErr, setErr] = useState(false);

  const [error, setError] = React.useState({
    message: "",
    isError: false,
    close: false,
  });

  const { refresh } = useContext(funcContext);
  const CONFIG = useSelector((state) => state.myInfoState.CONFIG);
  const posts = useSelector(state => state.postsState.posts)


  const { enqueueSnackbar } = useSnackbar();

  // fix this
  const AddPost = (post) => {
    setError({ isError: false, message: "", close: true });

    api
      .post("posts/add/", { post }, CONFIG)
      .then((res) => {
        // add the post to store
        dispatch(setData([...posts, res.data]))

        // close the modal
        props.setOpen(false);
        // snackbar
        enqueueSnackbar("Posted", { variant: "success" });
      })
      .catch((err) => {
        // console.log(err.response.data);
        setError({
          close: false,
          isError: true,
          message: err.response.data,
        });
      });
  };

  const HandelChange = (event) => {
    setPost(event.target.value);
  };

  // const HandleClick = () => {
  //   // if (post.length > 5) {
  //     AddPost(post)

  //     enqueueSnackbar('Posted', { variant: 'success' });

  //   //   props.setOpen(false);
  //   // } else { setErr(true) }
  // }

  return (
    <div>
      <TextField
        id="outlined-multiline-static"
        label="Write New Post..."
        multiline
        rows={5}
        style={{ width: "100%", marginTop: "2%" }}
        onChange={HandelChange}
      />

      <br />
      <Button disabled={error.close} onClick={() => AddPost(post)}>
        Post
      </Button>

      <Slide direction="up" in={error.isError} mountOnEnter unmountOnExit>
        <Alert severity="warning">{error.message}</Alert>
      </Slide>
    </div>
  );
}
