import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Box
  // Link,
} from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import "../styles/navBarStyles.css";
import { useState } from "react";

import isAuth, { userType } from "../lib/isAuth";
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import MenuIcon from  "@material-ui/icons/MenuIcon";
// import CloseIcon from  "@material-ui/icons/CloseIcon";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  mobile: {
    '& i': {
      color: "#fff",
    }

  }
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };
  
  const [clicked, setClicked] = useState(false);
  const handleClickState = () => {
    setClicked(!clicked);
  }

  return (
    <AppBar position="fixed"> {/* <header> */}
        
      <Toolbar> {/* <div> */}
        <Box zIndex={3} width={200}>
        {/* <div> */}
          <Link to="/" underline="none" textDecoration="none" boxShadow="none">
                {/* Job Portal */}
          
          <div>
            <Typography 
              variant="h6" className={classes.title}
              // component={Link}
              // sx={{ textDecoration: 'none', underline: 'none' }}
              color="white"
              // to="/"
              textDecoration="none" boxShadow="none"
              // noWrap
              // underline="none"
              // display="none"
              >
                Job Portal
            </Typography>
          </div>
          </Link>
        {/* </div> */}
        </Box>
        {/* <Link to="/"> */}
        
        {/* </Link> */}
        <div justifyContent="right" id="menuBar" className={clicked ? "menuBar active" : "menuBar"}>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}> {/* <button> */}
                Trang chủ
              </Button>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
                Thêm việc làm
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myjobs")}>
                Việc làm của tôi
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
                Nhân viên
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Hồ sơ
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                Trang chủ
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/applications")}
              >
                Đơn ứng tuyển
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Hồ sơ
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Đăng xuất
              </Button>
            </>
          )
        ) : (
          <>
            <Button color="inherit" onClick={() => handleClick("/login")}>
              Đăng nhập
            </Button>
            <Button color="inherit" onClick={() => handleClick("/signup")}>
              Đăng ký
            </Button>
          </>
        )}
        </div>
        <div id = "mobile" onClick={handleClickState}>
          <i>
          {
            clicked ? <CloseIcon/> : <MenuIcon/>
          }
          </i>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
