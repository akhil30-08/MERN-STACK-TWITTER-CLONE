const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_STR } = require("../config");

//API for user to sign up
router.post("/signup", async (req, res) => {
  const {
    Name,
    Username,
    Email,
    Password,
    Profile_Picture,
    Location,
    DateOfBirth,
  } = req.body;

  if (!Name || !Username || !Email || !Password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  //to check whether same email exists in database
  const EmailExists = await UserModel.findOne({ Email: Email });
  if (EmailExists) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  //to check whether same username exists in database
  const UsernameExists = await UserModel.findOne({ Username: Username });
  if (UsernameExists) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  //Creating a salt and hashing it to store the hashed password in the database
  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(Password, salt);

  //Creating a New User to be stored in the database
  const newUser = new UserModel({ ...req.body, Password: hashedPassword });
  await newUser
    .save() //saving user with save function
    .then((newUser) => {
      res.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    })
    .catch((err) => console.log(err));
});

//API for user to Log In
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  //check whether the user exists in the database or not
  const user = await UserModel.findOne({ Username: Username });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  //check whether the password is correct or not by using compare method of bcrypt
  const isMatch = bcryptjs.compareSync(Password, user.Password);

  //when the password is not correct
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid Password",
    });
  }

  //when the password is correct
  else {
    // generating a token for the logged in user when email and password matches in DB
    const token = jwt.sign({ _id: user._id }, JWT_STR);
    res.status(200).json({
      message: "Login Successful",
      token: token,
      user: user,
    });
  }
});

module.exports = router;
