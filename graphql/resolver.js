const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const validator = require("validator");

module.exports = {
  createUser: async function ({ userInput }, req) {
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
      //error.data=errors;
      throw error;
    }
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

  updateUser: async function ({ userId, userInput }, req) {
    //validate email
    const errors = []
    if(!validator.isEmail(userInput.email)){
      errors.push({message:"Email is invalid"});
    }
    if(validator.isEmpty(userInput.password) || !validator.isLength(userInput.password,{min:5})){
      errors.push({message:"Please provide password."})
    }
    if (errors.length > 0){
      const error = new Error('Invalid input')
      error.data = errors;
      throw error
    }
   
    const hashedPassword = await bcryptjs.hash(userInput.password, 12);
    
    const user = await User.findOneAndUpdate(
      { _id: userId.id },
      { $set: { email: userInput.email, name: userInput.name, password: hashedPassword } },
      { new: true }
    );
    
    if (!user) {
      const error = new Error('User not found');
      throw error;
    }
  
    return { ...user._doc, _id: user.id };
  },

  getAllUsers: async function () {
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

  deleteUser: async function ({ userId }, req) {
    try {
      await User.deleteOne({ _id: userId.id });
      return "user deleted";
    } catch (error) {
      throw error;
    }
  },
};
