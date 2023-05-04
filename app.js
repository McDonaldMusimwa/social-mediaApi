const express = require("express");
const app = express();
const PORT =3000;

//Mongoose

const mongoose = require("mongoose");
require("dotenv").config();
const DATABASEURL = process.env.DATABASEURL;
//GrapghQl
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true // Enable GraphiQL UI
  })
);

let database;
mongoose
  .connect(DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true ,dbName:'socialmedia'})
  .then((result) => {
    app.listen(PORT)
    database = result;
    console.log('connection to database successfull')
  })
  .catch((err) => {
    console.log(err);
  });