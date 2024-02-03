const { Router } = require("express");
const router = Router();
const { Admin, User, db } = require("../db/index");
const userMiddleware = require("../middleware/user");
const adminMiddleware = require("../middleware/admin");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

function addUserOrAdmin(name, password, userType) {
  if (userType === "customer") {
    const newUser = new User({ name, password });
    return newUser.save();
  } else if (userType === "employee") {
    const newAdmin = new Admin({ name, password });
    return newAdmin.save();
  } else {
    return Promise.reject("Invalid user type");
  }
}

async function signinUserOrAdmin(name, password, userType) {
  if (userType === "customer") {
    try {
      const user = await User.findOne({ name, password });

      if (user) {
        const token = jwt.sign(
          { _id: user._id, username: name, password: password, userType: userType },
          jwtPassword
        );
        return token;
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (userType === "employee") {
    try {
      const admin = await Admin.findOne({ name, password });

      if (admin) {
        const token = jwt.sign(
          { username: name, password: password, userType: userType },
          jwtPassword
        );
        return token;
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return Promise.reject("Invalid user type");
  }
}

router.post("/signup", (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let userType = req.body.userType;
  //   let password = req.body.password;
  console.log(userName);
  addUserOrAdmin(userName, password, userType)
    .then((result) => {
      console.log("User/Admin added successfully:", result);
      res.json({
        message: "User account created",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

});

router.post("/signin", (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let userType = req.body.userType;

  signinUserOrAdmin(userName, password, userType)
    .then((result) => {
      res.json({
        msg: "Authentication successful",
        token: result,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

});

router.get("/customers", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/employees", adminMiddleware, async (req, res) => {
  try {
    const admin = await Admin.find();
    res.json(admin);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
