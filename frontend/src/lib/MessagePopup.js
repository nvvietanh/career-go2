import { Snackbar, Slide, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
// import { Typography } from "@material-ui/core";

const MessagePopup = (props) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };
  return (
    <Snackbar open={props.open} onClose={handleClose} autoHideDuration={2000}>
      <Alert onClose={handleClose} severity={props.severity} style={{ fontSize: '20px'}}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
