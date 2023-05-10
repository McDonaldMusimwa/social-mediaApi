const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res, next) => {
  next();
});
//llogout
router.get("/logout", (req, res) => {
  //handle with passport
  res.send("logout out");
});
//google
router.get("/google", passport.authenticate("google"), {
  scope: ["profile"],
});

//call back router for google to redirect
router.get("/google/redirect", (req, res) => {
  res.send("you are authirised");
});

module.exports = router;
