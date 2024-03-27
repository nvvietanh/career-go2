import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import Axios from "axios";

import { SetPopupContext } from "../App";
import axios from "axios";
import apiList from "./apiList";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);

  const { uploadTo, identifier, handleInput, acceptedTypes } = props;

  const [file, setFile] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = () => {
    console.log("This is file" + file);
    const data = new FormData();
    data.append("file", file);
    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    })
      .then((response) => {
        console.log(response.data);
        handleInput(identifier, response.data.url);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.statusText,
          //   message: err.response.data
          //     ? err.response.data.message
          //     : err.response.statusText,
        });
      });
  };

  // upload to cloundinary
  const handleUpload1 = async () => {
    const fdata = new FormData();
    let fURL = "";
    fdata.append("file", file);
    fdata.append("upload_preset", "ngvvanh261");
    fdata.append("cloud_name", "ngvvanh261");
    await fetch("https://api.cloudinary.com/v1_1/ngvvanh261/image/upload", {
        method: "post",
        body: fdata,
        // mode: "cors",
      })
        .then(async (res) => res.json())
        .then(async (dat) => {
          // setPic(dataf.url.toString());
          console.log(dat.url.toString());
          // setPicLoading(false); 
          fURL = dat.url.toString();

          Axios
            .put(uploadTo, {
                type: identifier,
                content: fURL,
              }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
            )
            .then((res) => {
              setPopup({
                open: true,
                severity: "success",
                message: "Cập nhật thành công",
              });
            })
            .catch((err) => {
              setPopup({
                open: true,
                severity: "error",
                message: "Có lỗi xảy ra",
              });
            });
          console.log("save file ok");
          setFile("");
        })
        .catch((err) => {
          console.log(err);
          setPopup({
            open: true,
            severity: "error",
            message: "Có lỗi xảy ra",
          });
        });
  }

  return (
    <Grid container item xs={12} direction="column" className={props.className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {props.icon}
            <input
              type="file"
              accept={acceptedTypes}
              style={{ display: "none" }}
              onChange={(event) => {
                console.log("F1" + event.target.files[0]);
                setUploadPercentage(1);
                setFile(event.target.files[0]);
                console.log(file);
              }}
              // onChange={onChange}
              // onChange={
              //   (e) => {}
              //   //   setSource({ ...source, place_img: e.target.files[0] })
              // }
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name || "" : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", height: "100%" }}
            onClick={() => handleUpload1()}
            disabled={file ? false : true}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>
      {/* {uploadPercentage !== 0 ? (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      ) : null} */}
    </Grid>
  );
};

export default FileUploadInput;
