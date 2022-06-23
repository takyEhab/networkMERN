import { useEffect, useState, useContext, Fragment } from "react";
import Button from "@mui/material/Button";
import api from "../axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { funcContext } from "../context";
import Posts from "../components/Posts";
import { error, removePosts, setData } from "../store/actions";

export default function Profile({ match }) {
  const { follow } = useContext(funcContext);
  const dispatch = useDispatch();
  const myInfoState = useSelector((state) => state.myInfoState);
  const [user, setUser] = useState("loading");
  const [isFollowed, setFollowed] = useState(false);
  const [isSame, setIsSame] = useState(false);

  useEffect(() => {
    dispatch(removePosts());
    api
      .get(`/posts/user/${match.params.name}/`)
      .then((res) => {
        setUser(res.data.user);
        dispatch(setData(res.data.userPosts));
      })
      .catch((err) => {
        setUser(null);
        dispatch(error(err.response.data ? err.response.data : null));
      });
    return () => dispatch(removePosts());
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
  console.log(user);
  return (

    <Fragment>
      {user !== "loading" ? (
        user &&
        <>
          <h1>{user.username}</h1>
          <h1>followers :{user.followers.length}</h1>
          <h1>following :{user.following.length}</h1>
          {!isSame && (
            <Button onClick={() => handleClick(user._id)} variant="contained">
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </>
      ) : (
        <CircularProgress />
      )}

      <br />
      <Posts />
    </Fragment>
  );
}