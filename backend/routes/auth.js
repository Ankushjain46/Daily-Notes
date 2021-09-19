const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const { application } = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const jwtToken = "ankushIsGood";

// This is used to createuser /api/auth/createuser

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  // This is a async and await process by the return the data is fullfil or not
  // Validator express is use
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check the user is exist or note
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "This email is already registered" });
      }

      // this is use for generating hashing password

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const password = await bcrypt.hash(req.body.password, salt);

      // check the users name or email?
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      var authtoken = jwt.sign(data, jwtToken);
      // console.log(authtoken);

      // res.json(user);
      success = true;
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server Error");
    }
  }
);

// Authentication a user by using post req api/auth/login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be null").exists(),
  ],

  // This is a async and await process by the return the data is fullfil or not
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with a correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwtToken);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 Get logged user details by using post req api/auth/getuser

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
