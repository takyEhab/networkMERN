import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  Fragment,
} from "react";
import Button from "@mui/material/Button";
import { api } from "./axios";
import Card from "./Card";
import Pagination from "@mui/material/Pagination";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { funcContext } from "./funcContext";
import Posts from "./Posts";
import { error, setData } from "./store/actions";

export default function User({ match }) {
  const { follow } = useContext(funcContext);
  const dispatch = useDispatch();
  const myInfoState = useSelector((state) => state.myInfoState);
  const [user, setUser] = useState("loading");
  const [isFollowed, setFollowed] = useState(false);
  const [isSame, setIsSame] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/user/${match.params.name}/`)
      .then((res) => {
        setUser(res.data.user);
        dispatch(setData(res.data.userPosts));
      })
      .catch((err) => dispatch(error(err.response.data ? err.response.data : null)));
  }, [match.params.name]);

  useEffect(() => {
    if (myInfoState.isLoggedIn) {
      if (myInfoState.myInfo.username === match.params.name) setIsSame(true);
      myInfoState.myInfo.following.forEach((item) => {
        if (item.user === match.params.name) setFollowed(true);
      });
    }
  }, [myInfoState.myInfo, match.params.name]);

  const handleClick = async (user_id) => {
    const data = await follow(user_id);
    setUser(data.user);
    setFollowed(!isFollowed);
  };

  return (
    <Fragment>
      {user !== "loading" ? (
        <>
          <h1>{user && user.username}</h1>
          <h1>followers :{user && user.followers.length}</h1>
          <h1>following :{user && user.following.length}</h1>
        </>
      ) : (
        <CircularProgress />
      )}
      {!isSame && (
        <Button onClick={() => handleClick(user._id)} variant="contained">
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      )}

      <br />
      <Posts />

    </Fragment>
  );
}
