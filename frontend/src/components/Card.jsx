import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Link } from "react-router-dom";
import api from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../store/actions";
import { useSnackbar } from "notistack";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import Zoom from "@mui/material/Zoom";
import generateProfileColor from "../generateProfileColor";

const cardStyle = {
  textAlign: "center",
  width: "auto",
  margin: "auto",
  marginTop: "2%",
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));


export default function PostsCard(props) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postsState.posts);
  const myInfoState = useSelector((state) => state.myInfoState);
  const [isLike, setLike] = useState(null);
  const [edit, setEdit] = useState("");
  const [error, setError] = React.useState({
    message: "",
    isError: false,
    close: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    props.post.UsersLikes.includes(
      myInfoState.isLoggedIn && myInfoState.myInfo.username
    )
      ? setLike(true)
      : setLike(false);
  }, [myInfoState.isLoggedIn, props.post]);
  const like = (id) => {
    api
      .patch(`posts/like/${id}/`, {}, myInfoState.CONFIG)
      .then((res) => {
        if (res.data.message === "unlike") {
          setLike(false);
        } else {
          setLike(true);
        }
        const newPostsArr = posts.map((obj) => {
          if (obj._id === res.data.post._id) {
            return { ...obj, UsersLikes: res.data.post.UsersLikes };
          }
          return obj;
        });
        dispatch(setData(newPostsArr));
      })
      .catch((err) => {
        err.response.status === 403
          ? enqueueSnackbar("You have to be logged in to like this post", {
              variant: "info",
            })
          : enqueueSnackbar(
              "Error! \nwhile adding like!\n try to Refresh the page and try again",
              { variant: "error" }
            );
      });
  };
  const editPost = (post, id) => {
    setError({ isError: false, message: "", close: true });
    api
      .patch(`posts/${id}/`, { post }, myInfoState.CONFIG)
      .then((res) => {
        const newPostsArr = posts.map((obj) => {
          if (obj._id === res.data.post._id) {
            return { ...obj, post: res.data.post.post };
          }
          return obj;
        });
        dispatch(setData(newPostsArr));
        enqueueSnackbar("Post Edited!", { variant: "info" });
        setIsEdit(false);
      })
      .catch((err) => {
        setError({
          close: false,
          isError: true,
          message: err.response.data,
        });
      });
  };
  const deletePost = (id) => {
    api
      .delete(`posts/${id}/`, myInfoState.CONFIG)
      .then((res) => {
        // remove post from store
        const newPostsArr = posts.filter(
          (obj) => obj._id !== res.data.post._id
        );
        dispatch(setData(newPostsArr));

        enqueueSnackbar("Post Deleted!", { variant: "info" });
      })
      .catch(() => {
        enqueueSnackbar(
          "Error while deleting the post!\n try to Refresh the page and try again",
          { variant: "error" }
        );
      });
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
    handleClose();
    setEdit(props.post.post);
    setError({ ...error, close: false });
  };

  const HandelChange = (event) => {
    setEdit(event.target.value);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Zoom in={true}>
      <Card style={cardStyle} sx={{ maxWidth: 550 }}>
        <CardHeader
          avatar={
            <Link
              style={{ textDecoration: "initial" }}
              to={`/profile/${props.post.writer}`}
            >
              <Avatar
                sx={{ bgcolor: generateProfileColor(props.post.writer) }}
                aria-label="recipe"
              >
                {props.post.writer.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          }
          action={
            myInfoState.isLoggedIn &&
            (myInfoState.myInfo.username === props.post.writer ? (
              isEdit ? (
                <IconButton onClick={() => setIsEdit(false)}>
                  <ClearIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
              )
            ) : (
              ""
            ))
          }
          title={props.post.writer}
          subheader={props.post.created_at}
        />
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleEdit} disableRipple>
            <EditIcon />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              deletePost(props.post._id);
            }}
            disableRipple
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        </StyledMenu>
        <CardContent>
          {isEdit ? (
            <>
              <TextField
                id="outlined-multiline-static"
                value={edit}
                multiline
                rows={5}
                style={{ width: "100%", marginTop: "1%" }}
                onChange={HandelChange}
              />
              <Button
                disabled={error.close}
                onClick={() => editPost(edit, props.post._id)}
              >
                Save
              </Button>

              <Slide
                direction="up"
                in={error.isError}
                mountOnEnter
                unmountOnExit
              >
                <Alert severity="warning">{error.message}</Alert>
              </Slide>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {props.post.post}
            </Typography>
          )}
        </CardContent>

        <CardActions disableSpacing>
          <IconButton
            onClick={() => like(props.post._id)}
            style={{ color: isLike ? "red" : "gray" }}
            aria-label="add to favorites"
          >
            <FavoriteIcon />
            {props.post.UsersLikes.length === 0
              ? ""
              : props.post.UsersLikes.length}
          </IconButton>
        </CardActions>
      </Card>
    </Zoom>
  );
}
