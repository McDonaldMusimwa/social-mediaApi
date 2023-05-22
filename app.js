const express = require("express");
const app = express();
const PORT = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

//autho imports
const authRoutes = require("./routes/auth");

//session and cookie imports
const session = require("express-session");
const passport = require("passport");
//const cookieparser = require('cookie-parser');
require("dotenv").config();
const cookiesessionkey = process.env.SESSIONKEY;

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
const authCheck = require("./services/authCheck");


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//session

//const profileRoutes = require('./routes/profile');
//set up session cookies

//app.use(cookieparser())
app.use(
  session({
    secret: cookiesessionkey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
//app.use('/profile',profileRoutes)
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,PUT,POST,GET,DELETE,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  }
  next();
});
//app.use(authCheck)
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
//app.use(passport.initialize());

/*
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
*/

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
