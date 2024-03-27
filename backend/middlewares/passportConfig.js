const passport = require("passport");
const Strategy = require("passport-local").Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../models/User");

require("dotenv").config();

// lọc các trường không cần thiết trong 1 bản ghi json
const filterJson = (obj, unwantedKeys) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (unwantedKeys.indexOf(key) === -1) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

// thêm chiến lược xác thực bằng tài khoản mật khẩu
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req, email, password, done, res) => {
      // console.log(email, password);
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Người dùng không tồn tại",
          });
        }

        user
          .comparePassword(password)
          .then(() => {
            user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
            return done(null, user);
          })
          .catch((err) => {
            return done(err, false, {
              message: "Mật khẩu không đúng",
            });
          });
      });
    }
  )
);

// thêm chiến lược xác thực sử dụng Json Web Token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then((user) => {
          console.log(Object.keys(jwt_payload));
          if (!user) {
            return done(null, false, {
              message: "Token không tồn tại",
            });
          }
          user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, {
            message: "Token không đúng",
          });
        });
    }
  )
);

module.exports = passport;
