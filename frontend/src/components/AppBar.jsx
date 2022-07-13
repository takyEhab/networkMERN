import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { Avatar, Button, Modal } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatIcon from '@mui/icons-material/Chat';
import SearchModal from "./SearchUser";
import { useHistory } from "react-router-dom";
import AccountAvatar from "./AccountAvatar";
import { useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openModel, setOpenModel] = React.useState(false);
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.myInfoState.isLoggedIn);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleCloseModel = () => setOpenModel(false);

  const handleClick = () => {
    setOpenModel(true);
  }
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => history.push("/chats")}>
        <IconButton size="large" aria-label="show new chats" color="inherit">
            <ChatIcon />
        </IconButton>
        <p>Chats</p>
      </MenuItem>
      <MenuItem onClick={() => history.push("/following")}>
        <IconButton
          size="large"
          aria-label="following"
          color="inherit"
        >
            <PeopleAltIcon />
        </IconButton>
        <p>Following</p>
      </MenuItem>
      <Box sx={{textAlign:'center'}}>
        {isLoggedIn && <AccountAvatar />}
      </Box>

    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Modal
        open={openModel}
        onClose={handleCloseModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Search for a USER
          </Typography>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            <SearchModal closeModel={handleCloseModel} />
          </div>
        </Box>
      </Modal>

      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}

          {/* <Avatar style={{
  marginRight: "auto",
  color: "black",
  backgroundColor: "white",
  borderRadius: 0,
  height: 30,
  width: 100,
  border: "2px solid gray",
  borderLeft: "12px solid transparent",
  borderRight: "12px solid transparent",
}}>Network</Avatar> */}

          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            sx={{
              display: { xs: "none", sm: "block" },
              textDecoration: "none",
              boxShadow: "none",
              color: "white",
              fontVariantCaps: "all-small-caps"
            }}
            to="/"
          >
            Network
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              // placeholder="Search for a user…"
              value="Search for a user…"
              style={{color:'lightgray'}}
        onClick={handleClick}

              readOnly={true}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isLoggedIn ?
              <>
                <IconButton
                  size="large"
                  aria-label="show new chats"
                  color="inherit"
                  onClick={() => history.push("/chats")}
                >
                  <ChatIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="following"
                  color="inherit"
                  onClick={() => history.push("/following")}
                >
                  <PeopleAltIcon />
                </IconButton>
                <AccountAvatar />
                {/* {isLoggedIn && <AccountAvatar />} */}
              </>
              : <>
              <Button onClick={() => history.push("/login")} color="inherit">Login</Button>
              <Button onClick={() => history.push("/register")} color="inherit">Register</Button>
              </>
              // {/* <IconButton
              //   size="large"
              //   edge="end"
              //   aria-label="account of current user"
              //   aria-controls={menuId}
              //   aria-haspopup="true"
              //   onClick={handleProfileMenuOpen}
              //   color="inherit"
              // >
              //   <AccountCircle />
              // </IconButton> */}

            }
          </Box>
            
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
