const bcryptjs = require("bcryptjs");
const UserModel = require("../models/user");
const PostModel = require("../models/posts");
const validator = require("validator");
const passport = require("passport");
const authCheck = require("../services/authCheck");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKENSECRET = process.env.TOKENSECRET;

module.exports = {
  createUser: async function ({ userInput }, req) {
    //authentication

    //validate email
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Please provide password." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await UserModel.User.findOne({
      email: userInput.email,
    });
    if (existingUser) {
      const error = new Error("User already existing ");
      throw error;
    }
    const hashedPassword = await bcryptjs.hash(userInput.password, 12);
    const user = new UserModel.User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser.toString() };
  },

  updateUser: async function ({ userId, userInput }, req) {
    // check if user is authenticated

    if (!req.isAuth) {
      const error = new Error("User is not authenticated");
      error.code = 401;
      throw error;
    }

    //validate email
    try {
      const errors = [];
      if (!validator.isEmail(userInput.email)) {
        errors.push({ message: "Email is invalid" });
      }
      if (
        validator.isEmpty(userInput.password) ||
        !validator.isLength(userInput.password, { min: 5 })
      ) {
        errors.push({ message: "Please provide password." });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input");
        error.data = errors;
        throw error;
      }

      const hashedPassword = await bcryptjs.hash(userInput.password, 12);

      const user = await UserModel.User.findOneAndUpdate(
        { _id: userId.id },
        {
          $set: {
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword,
          },
        },
        { new: true }
      );

      if (!user) {
        const error = new Error("User not found");
        throw error;
      }

      return { ...user._doc, _id: user.id };
    } catch (err) {
      throw err;
    }
  },

  getAllUsers: async function () {
    try {
      const users = await UserModel.User.find();
      return users.map((user) => {
        return { ...user._doc, _id: user._doc._id.toString() };
      });
    } catch (error) {
      throw error;
    }
  },

  getUser: async function ({ userId }, req) {
    const user = await UserModel.User.findOne({ _id: userId.id });
    return user;
  },

  deleteUser: async function ({ userId }, req) {
    // check if user is authenticated
    const isAuthenticated = authCheck(req);
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    } else {
      try {
        await UserModel.User.deleteOne({ _id: userId.id });
        return "user deleted";
      } catch (error) {
        throw error;
      }
    }
  },

  login: async function ({ email, password }) {
    console.log(email);
    console.log(password);
    try {
      const user = await UserModel.User.findOne({ email: email });
      if (!user) {
        const error = new Error("User not found ");
        error.code = 401;
        throw error;
      }

      const isEqual = await bcryptjs.compare(password, user.password);
      if (!isEqual) {
        const error = new Error("Password in incorrect");
        error.code = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: user.email.toString(),
          userId: user._id.toString(),
        },
        TOKENSECRET,
        { expiresIn: "1h" }
      );

      return { token: token, userId: user._id.toString() };
    } catch (error) {
      throw error;
    }
  },
  createPost: async function ({ userPost }, req) {
    console.log(userPost);
    const errors = [];
    if (
      validator.isEmpty(userPost.title) ||
      !validator.isLength(userPost.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid" });
    }
    if (
      validator.isEmpty(userPost.content) ||
      !validator.isLength(userPost.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.code = 422;
      throw error;
    }
    const fetcheduser = await UserModel.User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid input");
     
      error.code = 422;
      throw error;
    }
    const post = new PostModel({
      title: userPost.title,
      content: userPost.content,
      imageUrl: userPost.imageUrl,
      creator: fetcheduser,
    });
    const createdPost = await post.save();
    //add post to users
    fetcheduser.posts.push(createdPost);
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString,
      createdAt: createdPost.createdAt.toISOString(),
      updateAt: createdPost.updatedAt.toISOString(),
    };
  },
};
