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
    graphiql: true, // Enable GraphiQL UI
    customFormatErrorFn(err){
      if(!err.originalError){
        return err
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.cade || 500;
      return{message:message,status:code,data:data}
    }
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