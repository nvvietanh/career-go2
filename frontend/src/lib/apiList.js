export const server = "http://localhost:5000";
// export const server = "https://career-go-api.vercel.app"\
// export const server = "https://career-go.onrender.com";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/api/user/resume`,
  uploadProfileImage: `${server}/api/user/profile`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
};

export default apiList;
