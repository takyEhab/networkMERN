import { Fragment, useEffect } from "react";
import api from "../axios";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../components/Posts";
import { error, removePosts, setData } from "../store/actions";
import { CssBaseline } from "@mui/material";

function Following() {
  const dispatch = useDispatch();
  const CONFIG = useSelector((state) => state.myInfoState.CONFIG);

  useEffect(() => {
    dispatch(removePosts());
    api
      .get(`/posts/following/`, CONFIG)
      .then((res) => {
        dispatch(setData(res.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(error(err.response.data ? err.response.data : null));
      });
    return () => dispatch(removePosts());
  }, []);
  return (
    <Fragment>
      <CssBaseline />
      <Posts />
    </Fragment>
  );
}
export default Following;
