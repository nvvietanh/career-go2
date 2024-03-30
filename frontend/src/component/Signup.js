import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  Input,
  Box
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
  },
  inputBox: {
    width: "500px",
    // paddingTop: "5px",
    // paddingBottom: "5px"
    "@media (max-width: 1000px)": {
      width: "400px",
    },
    "@media (max-width: 720px)": {
      width: "300px",
    }
  },
  submitButton: {
    // width: "400px",
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <>
        <Box item xs={8} className={classes.inputBox}>
          <TextField
            label={`Tên cơ sở giáo dục/nghiên cứu #${key + 1}`}
            value={education[key].institutionName}
            onChange={(event) => {
              const newEdu = [...education];
              newEdu[key].institutionName = event.target.value;
              setEducation(newEdu);
            }}
            variant="outlined"
            // style={{ fontSize:"20px"}}
            style={{ width: "100%"}}
          />
        </Box>
        <Grid
          item
          container
          className={classes.inputBox}
          alignContent="center"
          justifyContent="center"
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 , paddingTop: 10, paddingBottom: 5}}
        >
          
          <Grid item xs={3}>
            <TextField
              label="Năm bắt đầu"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Năm kết thúc"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
        </>
      ))}
      <Grid item style={{ paddingTop : 0, paddingBottom : 0}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
          
        >
          Thêm thông tin học vấn
        </Button>
      </Grid>
    </>
  );
};

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    console.log(education);

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đăng nhập thành công",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Đầu vào không hợp lệ",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} là bắt buộc`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đăng nhập thành công",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Đầu vào không hợp lệ",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Paper elevation={3} className={classes.body} >
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2" >
            Đăng ký
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            select
            // label="Category"
            label="Đối tượng"
            variant="outlined"
            className={classes.inputBox}
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
            // style={{width: "500px"}}
          >
            <MenuItem value="applicant">Ứng viên</MenuItem>
            <MenuItem value="recruiter">Nhà tuyển dụng</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Họ tên"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.name.error}
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Họ tên là bắt buộc");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
            required={true}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.password.error}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Mật khẩu là bắt buộc");
              } else {
                handleInputError("password", false, "");
              }
            }}
          />
        </Grid>
        {signupDetails.type === "applicant" ? (
          <>
            <MultifieldInput
              education={education}
              setEducation={setEducation}
            />
            <Grid item>
              <ChipInput
                className={classes.inputBox}
                label="Kỹ năng"
                variant="outlined"
                helperText="Bấm Enter để thêm kỹ năng"
                onChange={(chips) =>
                  setSignupDetails({ ...signupDetails, skills: chips })
                }
              />
            </Grid>
            <Grid item style={{paddingTop : 5, paddingBottom : 5}}>
              <FileUploadInput
                className={classes.inputBox}
                label="Resume (.pdf)"
                icon={<DescriptionIcon />}
                // value={files.resume}
                // onChange={(event) =>
                //   setFiles({
                //     ...files,
                //     resume: event.target.files[0],
                //   })
                // }
                uploadTo={apiList.uploadResume}
                handleInput={handleInput}
                identifier={"resume"}
              />
            </Grid>
            <Grid item style={{paddingTop : 5, paddingBottom : 5}}>
              <FileUploadInput
                className={classes.inputBox}
                label="Ảnh hồ sơ (.jpg/.png)"
                icon={<FaceIcon />}
                // value={files.profileImage}
                // onChange={(event) =>
                //   setFiles({
                //     ...files,
                //     profileImage: event.target.files[0],
                //   })
                // }
                uploadTo={apiList.uploadProfileImage}
                handleInput={handleInput}
                identifier={"profile"}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item style={{ width: "100%" }}>
              <TextField
                label="Tiểu sử (tối đa 250 từ)"
                multiline
                rows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={signupDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                // defaultErrorMessage="Số điện thoại không hợp lệ"
              />
            </Grid>
          </>
        )}

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              signupDetails.type === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
            className={classes.submitButton}
            style={{ fontSize: '18px'}}
          >
            Đăng ký
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Signup;

// {/* <Grid item>
//           <PasswordInput
//             label="Re-enter Password"
//             value={signupDetails.tmpPassword}
//             onChange={(event) => handleInput("tmpPassword", event.target.value)}
//             className={classes.inputBox}
//             labelWidth={140}
//             helperText={inputErrorHandler.tmpPassword.message}
//             error={inputErrorHandler.tmpPassword.error}
//             onBlur={(event) => {
//               if (event.target.value !== signupDetails.password) {
//                 handleInputError(
//                   "tmpPassword",
//                   true,
//                   "Passwords are not same."
//                 );
//               }
//             }}
//           />
//         </Grid> */}
