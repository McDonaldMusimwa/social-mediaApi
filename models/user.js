const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },

  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const oauthUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");
const OAuthUser = mongoose.model("OAuthUser", oauthUserSchema, "users");

module.exports = {
  User,
  OAuthUser,
};
