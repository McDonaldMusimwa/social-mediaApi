const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const CLIENTID = process.env.GOOGLE_CLIENT_ID;
const CLIENTSECRET = process.env.GOOGLE_CLIENT_SECRET;
//from models
const UserModel = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  UserModel.User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      //OPTIONS FOR GOOGLE STRATEGY
      callbackURL: "/auth/google/redirect",
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      //passport call back function
      UserModel.OAuthUser.findOne({ googleId: profile.id }).then(
        (currentUser) => {
          if (currentUser) {
            //already in database
            console.log("user is ", currentUser);
            done(null, currentUser);
          } else {
            //if not create user
            new UserModel.OAuthUser({
              name: profile.displayName,
              googleId: profile.id,
            })
              .save()
              .then((newUser) => {
                console.log(`new user ${profile.displayName} is saved`);
                done(null, newUser);
              });
          }
        }
      );
    }
  )
);
