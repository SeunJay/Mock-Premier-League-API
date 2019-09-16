const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Please provide a password"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
