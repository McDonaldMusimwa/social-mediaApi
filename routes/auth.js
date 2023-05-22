const router = require("express").Router();
const passport = require("passport");


//google
router.get(
  "/google",
  passport.authenticate("google", {
    //what we want from the user
    scope: ["profile"],
  })
);

//call back router for google to redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/graphql");
});

module.exports = router;
