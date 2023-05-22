const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKENSECRET = process.env.TOKENSECRET;

const authCheck = (req) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, TOKENSECRET);
  } catch (err) {
    throw new Error("Not authenticated");
  }
  if (!decodedToken) {
    throw new Error("Not authenticated");
  }
  req.userId = decodedToken.userId;
};

module.exports = authCheck;
