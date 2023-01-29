const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt")


const User = require("./models/user");
const userExistsError = new Error("User already exists")

function initialize(passport) {
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true,
      },
      async (req, email, password, done) => {
        try {
          // check if user exists
          const userExists = await User.findOne({ email: email });
          if (userExists) {
            return done(null, false,{message: "email already exists"});
          } // Create a new user with the user data provided
          const user = await User.create({ email:email, password:password, username: req.body.username, avatar_url: req.body.avatar_url });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) return done(null, false);
          const isMatch = await user.matchPassword(password);
          if (!isMatch) return done(null, false);
          // if passwords match return user
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload.user;
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}


function isAdmin(req) {
  if (req.user.role === "admin") {
      return true
  }
  return false
}

function isModerator(req) {
  if (req.user.role === "moderator") {
      return true
  }
  return false
}

module.exports = { initialize, isAdmin, isModerator };
