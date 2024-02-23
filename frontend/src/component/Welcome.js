import { Grid, Typography } from "@material-ui/core";
import "../styles/welcomeStyles.css";


const Welcome = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  Welcome to CareerGo
                  <span></span>
                </h1>
                <br />
                <br />
                <p>Ready for amazing jobs</p>
                <button className="button-29">
                  <a
                    href="/home"
                    className="btn btn-custom btn-lg page-scroll"
                  >
                    Get started
                  </a>{" "}
                </button>
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
        <Typography variant="h2">Lỗi 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
