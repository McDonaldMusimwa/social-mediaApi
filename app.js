const express = require("express");
const app = express();
const PORT = 3000;

//Mongoose
const mongoose = require("mongoose");
require("dotenv").config();
const DATABASEURL = process.env.DATABASEURL;
//GrapghQl
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");
//Oauth
const passportSetUp = require("./services/passport");

//save Oauth user
//const User = require('./models/user');
const authRoutes = require('./routes/auth')

app.use('/auth',authRoutes)

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true, // Enable GraphiQL UI
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.cade || 500;
      return { message: message, status: code, data: data };
    },
  })
);


// initialize passport middleware
app.use(passport.initialize());

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/graphql",
    session: false,
  }),
  (req, res) => {
    // User has been authenticated, redirect to original URL or a default URL
    const redirectUrl = req.query.redirect || "/";
    res.redirect(redirectUrl);
  }
);

let database;
mongoose
  .connect(DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "socialmedia",
  })
  .then((result) => {
    app.listen(PORT);
    database = result;
    console.log("connection to database successfull");
  })
  .catch((err) => {
    console.log(err);
  });
