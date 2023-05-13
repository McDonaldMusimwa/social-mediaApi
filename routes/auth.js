const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res, next) => {
  res.send("login");
});
//llogout
router.get("/logout", (req, res) => {
  //handle with passport
  res.send("logout out");
});
//google
router.get(
  "/google",
  passport.authenticate("google", {
    //what we want from the user
    scope: ["profile"],
  })
);
//call back router for google to redirect
//call back router for google to redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/graphql");
});

module.exports = router;
