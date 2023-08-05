import express from "express";
import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Registeration Api
router.post("/register", async (req, res) => {
  // request these data from user
  const { name, email, phone, work, password, cpassword } = req.body;
  // empty field is checked
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz filled the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();

      res.status(201).json({ message: "user registered successful" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Plz filled the data" });
    }
    // find from User
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      // Compare the password with user password and input password
      const isMatch = await bcrypt.compare(password, userLogin.password);

      //   call generateToken see the userschema
      let token = await userLogin.generateAuthToken();
      console.log(token);

      //  save the token in cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.status(200).json({ message: "user Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// About Page route

router.get("/about", authenticate, (req, res) => {
  console.log("Hello My About Page");
  res.send(req.rootUser);
});

// Get all data route

router.get("/getdata", authenticate, (req, res) => {
  console.log("Hello my About");
  res.send(req.rootUser);
});

// Contact us page route

router.post("/contact", authenticate, async (req, res) => {
  try {
    // get these details
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      console.log("error in contact form");
      return res.json({ error: "plzz filled the contact form" });
    }

    // find the user with req.userID which we get while authentication
    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      // when we find the user call the method of addMessage in userschema to add the message in schema (see userschema)
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      // then save the usercontact
      await userContact.save();

      res.status(201).json({ message: "user Contact Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Logout Page route

router.get("/logout", (req, res) => {
  console.log("hello my logout page");
  // clear the cookie for logout
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

export default router;
