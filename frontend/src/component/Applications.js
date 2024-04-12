import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import SingleChat from "./SingleChat";
import { socket } from "../service/socket";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);
  const [openChat, setOpenChat] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          // message: "Error",
          message: "Có lỗi xảy ra"
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          // message: "Rating updated successfully",
          message: "Cập nhật đánh giá thành công"
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  const stats = {
    applied: "đã ứng tuyển",
    shortlisted: "đã sơ tuyển",
    accepted: "đã chấp nhận",
    rejected: "đã từ chối",
    deleted: "đã xóa",
    cancelled: "đã hủy",
    finished: "đã hoàn thành",
  }

  const handleCloseChat = () => {
    setOpenChat(false);
  }

  const handleOpenChat = () => {
    if (["shortlisted", "accepted", "finished"].includes(application.status)){
      setOpenChat(true);
    }
    else {
      setPopup({
        open: true,
        severity: "error",
        message: "Đơn cần được sơ tuyển/chấp nhận để chat",
      });
    }
  }

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>Đăng bởi: {application.recruiter.name}</Grid>
          <Grid item>Loại hình : {application.job.jobType}</Grid>
          <Grid item>Lương : &#8363; {application.job.salary} mỗi tháng</Grid>
          <Grid item>
            Thời lượng :{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} tháng`
              : `Linh hoạt`}
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Ứng tuyển lúc: {appliedOn.toLocaleDateString()}</Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>Tham gia lúc: {joinedOn.toLocaleDateString()}</Grid>
          ) : null}
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Paper
              className={classes.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
              }}
            >
              {/* {application.status} */}
              {stats[application.status]}
            </Paper>
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.statusBlock}
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Đánh giá việc làm
              </Button>
            </Grid>
          ) : null}

          <Grid item container direction="row"
            style={{ paddingTop : "2px"}}
          >
            <Grid item style={{ paddingRight : "2px"}}>
              <a href={"mailto:" + application.recruiterMail.email} style={{ textDecoration : "none"}}>
                <Button
                variant="contained"
                className={classes.statusBlock}
                color="primary"
                textDecoration="none"
                style={{
                  background : "#09BCBA"
                }}
                >
                  Gửi email
                </Button>
              </a>
            </Grid>
            <Grid item >
              <Button
                variant="contained"
                className={classes.statusBlock}
                color="primary"
                onClick={() => handleOpenChat(application.jobApplicant)}
                // style={{ display : "flex"}}
                >
                Chat với nhà tuyển dụng
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Nộp
          </Button>
        </Paper>
      </Modal>
      <Modal
        open={openChat}
        onClose={handleCloseChat}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "15px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "300px",
            alignItems: "center",
            minHeight: "80%",
            height: "80%",
            width: "40%"
          }}
        >
          {/* <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Chat với {application.recruiter.name}
          </Typography> */}
          <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{width:"100%", maxWidth:"100%"}}>
            <Grid item xs>
              <Typography variant="h5" style={{ marginBottom: "10px" }}>
                Chat với {application.recruiter.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                // style={{ padding: "10px 50px" }}
                onClick={() => handleCloseChat()}
              >
                Đóng
              </Button>
            </Grid>
          </Grid>
          <SingleChat applicationId={application._id} rcvUser={application.recruiter}/>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Có lỗi xảy ra",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Đơn ứng tuyển</Typography>
      </Grid>
      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="stretch"
        justify="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            {/* No Applications Found */}
            Không tìm thấy đơn ứng tuyển nào
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
