import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import api from "../axios";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useHistory } from "react-router-dom";
import Zoom from "@mui/material/Zoom";
import { useSelector } from "react-redux";
import { funcContext } from "../context";

export default function Search(props) {
  const { follow } = useContext(funcContext);

  const [data, setData] = useState(null);
  const myInfoState = useSelector((state) => state.myInfoState);
  const history = useHistory();

  const search = (name) => {
    api.get(`user/users/${name}/`).then((users) => {
      setData(users.data);
    });
  };
  const redirect = (username) => {
    history.push(`/profile/${username}`);
    props.closeModel();
  };
  const HandelChange = (e) => {
    if (e.target.value === "") {
      setData(null);
    } else {
      search(e.target.value);
    }
  };
  const handleClick = async (e, user_id) => {
    e.stopPropagation();
    const res = await follow(user_id);
    e.target.textContent = res.operation === "follow" ? "unfollow" : "follow";
  };

  return (
    <div>
      <TextField
        id="outlined-multiline-static"
        label="Type Username..."
        autoComplete="off"
        rows={3}
        style={{ width: "100%", marginTop: "2%" }}
        onChange={HandelChange}
      />
      <Zoom in={data !== null}>
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 250 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableBody>
                {data &&
                  data.map((user) => {
                    return (
                      <TableRow
                        onClick={() => redirect(user.username)}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user._id}
                      >
                        <TableCell>{user.username}</TableCell>

                        {myInfoState.myInfo &&
                          myInfoState.myInfo._id !== user._id && (
                            <TableCell align="right">
                              <Button
                                onClick={(e) => handleClick(e, user._id)}
                                color="secondary"
                                variant="outlined"
                              >
                                {myInfoState.myInfo.following.filter(
                                  (following) =>
                                    following.user === user.username
                                ).length > 0
                                  ? "Unfollow"
                                  : "Follow"}
                              </Button>
                            </TableCell>
                          )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Zoom>
    </div>
  );
}
