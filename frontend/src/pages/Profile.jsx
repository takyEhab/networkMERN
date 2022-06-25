import { useEffect, useState, useContext, Fragment } from "react";
import Button from "@mui/material/Button";
import api from "../axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { funcContext } from "../context";
import Posts from "../components/Posts";
import { error, removePosts, setData } from "../store/actions";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

export default function Profile({ match }) {
  const { follow } = useContext(funcContext);
  const dispatch = useDispatch();
  const myInfoState = useSelector((state) => state.myInfoState);
  const [user, setUser] = useState("loading");
  const [isFollowed, setFollowed] = useState(false);
  const [isSame, setIsSame] = useState(false);
  const [isConversation, setIsConversation] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

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
      api
        .get(`/conversation/mine`, myInfoState.CONFIG)
        .then((res) => {
          res.data.length === 0 && setIsConversation(false);
          res.data.forEach((item) => {
            setIsConversation(item.participants.includes(match.params.name));
          });
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    }
  }, [myInfoState.myInfo, match.params.name]);

  const handleClick = async (user_id) => {
    const data = await follow(user_id);
    setUser(data.user);
    setFollowed(!isFollowed);
  };

  const startConversation = async () => {
    api
      .post(`/conversation`, { receiver: user?.username }, myInfoState.CONFIG)
      .then((res) => history.push("/chats"))
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };
  return (
    <Fragment>
      {user !== "loading" ? (
        user && (
          <>
            <Typography variant="h4" component="div" p={1}>
              {user.username}
              <br />
              Followers :{user.followers.length}
              <br />
              Following :{user.following.length}
            </Typography>
            {!isSame && (
              <>
                <Button
                  onClick={() => handleClick(user._id)}
                  sx={{ marginRight: "20px" }}
                  variant="contained"
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </Button>
                {!isConversation && (
                  <Button onClick={startConversation} variant="contained">
                    Start a conversation
                  </Button>
                )}
              </>
            )}
          </>
        )
      ) : (
        <CircularProgress />
      )}

      <Posts />
    </Fragment>
  );
}
