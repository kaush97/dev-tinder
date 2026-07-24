const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: Number,
    },
    //  membershipValidity: {
    //   type: Number,
    // },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw Error("gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    skills: {
      type: Array,
    },
    about: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true, // 👈 add this
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
