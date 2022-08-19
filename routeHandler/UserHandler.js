const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

router.post("/signup", async (req, res) => {
  // check validation
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const hasUser = await User.find({ username: req.body.username });

    if (!hasUser[0]) {
      const newUser = new User({
        username: req.body.username,
        password: hashPassword,
        status: req.body.status,
      });
      await newUser.save();

      res.status(200).json({
        message: "User sign up successfully",
      });
    } else {
      res.status(500).json({ error: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({
      error: "Sign up failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const hasUser = await User.find({ username: req.body.username });
    if (hasUser) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        hasUser[0].password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: hasUser[0].username,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1hr",
          }
        );
        res.status(200).json({
          "access-token": token,
          message: "Log in sucessfully",
        });
      }
    } else {
      res.status(500).json({ error: "Authentication error" });
    }
  } catch (err) {
    res.status(500).json({ error: "Authentication error" });
  }
});
module.exports = router;
