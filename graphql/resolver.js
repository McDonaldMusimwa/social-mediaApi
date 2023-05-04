const bcryptjs = require("bcryptjs");
const User = require("../models/user");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User already existing ");
      throw error;
    }
    const hashedPassword = await bcryptjs.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser.toString() };
  },

  getAllUsers: async function() {
    try {
      const users = await User.find();
      return users.map((user) => {
        return { ...user._doc, _id: user._doc._id.toString() };
      });
    } catch (error) {
      throw error;
    }
  },

  getUser: async function ({ userId }, req) {
    const user = await User.findOne({ _id: userId.id });
    return user;
  },
};
