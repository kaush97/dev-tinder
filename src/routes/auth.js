const express = require("express");
const User = require("../models/user");

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
authRouter.post("/user", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      skills,
      photoUrl,
      about,
    } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const encryptPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      age: age,
      gender: gender,
      email: email,
      password: encryptPassword,
      skills: skills,
      photoUrl: photoUrl,
    });
    await user.save();
    res.send({
      data: user,
      message: "SignUp successfully",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).send("Invalid credentials");
    }
      if (!password) {
      return res.status(400).send("Password required");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: existingUser._id }, "Kaushal");
      
      res.cookie("token", token);
      res.send({
        data: existingUser,
        message: "Login successfully",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.put("/user", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { firstName: "kaushal" },
    { lastName: "new" },
    {
      returnDocument: "after",
    },
  );

  res.send(user);
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token",null,{
      expires: new Date(Date.now())
    });

    res.status(200).send({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = authRouter;
