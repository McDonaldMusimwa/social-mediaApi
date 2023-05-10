const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const CLIENTID = process.env.GOOGLE_CLIENT_ID;
const CLIENTSECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy({
    //OPTIONS FOR GOOGLE STRATEGY
    callbackURL:'/auth/google/redirect',
    clientID: CLIENTID,
    clientSecret: CLIENTSECRET,
  },(accessToken, refreshToken, profile, done)=>{
    //passport call back function 
    console.log(profile)
  })
);
