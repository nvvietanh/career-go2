import { Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import "../styles/welcomeStyles.css";
import isAuth from "../lib/isAuth";

const Welcome = (props) => {
  const history = useHistory();
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  Chào mừng đến CareerGo
                  <span></span>
                </h1>
                <br />
                <br />
                <p>Chọn đúng công việc, khai sáng tương lai</p>
                {!isAuth() && <button className="button-29" onClick={() => history.push("/login")}>
                  {/* <a
                    href="/login"
                    className="btn btn-custom btn-lg page-scroll"
                  > */}
                    Bắt đầu
                  {/* </a>{" "} */}
                </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">404<br/> Không tìm thấy</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
