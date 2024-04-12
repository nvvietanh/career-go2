import { useState, useContext } from "react";
import { Grid, Button, TextField } from "@material-ui/core";
import Axios from "axios";

import { SetPopupContext } from "../App";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);

  const { uploadTo, identifier, handleInput, acceptedTypes } = props;

  const [file, setFile] = useState("");

  // upload to Cloudinary
  const handleUpload = async () => {
    const fdata = new FormData();
    let fURL = "";
    fdata.append("file", file);
    fdata.append("upload_preset", "ngvvanh261");
    fdata.append("cloud_name", "ngvvanh261");
    await fetch("https://api.cloudinary.com/v1_1/ngvvanh261/image/upload", {
        method: "post",
        body: fdata,
      })
        .then(async (res) => res.json())
        .then(async (dat) => {
          console.log(dat.url.toString());
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
              handleInput(identifier, fURL);
              setPopup({
                open: true,
                severity: "success",
                message: "Tải tệp thành công",
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
                console.log("F1" + event.target.files[event.target.files.length - 1]);
                setFile(event.target.files[event.target.files.length - 1]);
                console.log(file);
              }}
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
            onClick={() => handleUpload()}
            disabled={file ? false : true}
          >
            Tải lên
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FileUploadInput;
