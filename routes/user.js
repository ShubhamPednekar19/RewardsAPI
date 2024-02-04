const { Router } = require("express");
const router = Router();
const { Admin, User, db, Supervisor } = require("../db/index");
const userMiddleware = require("../middleware/user");
const adminMiddleware = require("../middleware/admin");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supervisorMiddleware = require("../middleware/supervisor");
const jwtPassword = "123456";

function addUserOrAdmin(name, password, userType) {
  if (userType === "customer") {
    const newUser = new User({ name, password });
    return newUser.save();
  } else if (userType === "employee") {
    const newAdmin = new Admin({ name, password });
    return newAdmin.save();
  } else if (userType === "supervisor") {
    const newSupervisor = new Supervisor({ name, password });
    return newSupervisor.save();
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
          {
            _id: user._id,
            username: name,
            password: password,
            userType: userType,
          },
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
  } else if (userType === "supervisor") {
    try {
      const supervisor = await Supervisor.findOne({ name, password });

      if (supervisor) {
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
        message: `${userType} created successfully`,
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
      res.status(500).json({
        msg: "Something went wrong",
      });
      // console.error("Error:", error);
    });
});


router.delete("/delete", supervisorMiddleware, async (req, res) => {
  const { id, userType } = req.body;
  const Id = new mongoose.Types.ObjectId(id);
  try {
    if (userType === "customer") {
      const deletedUser = await User.findOneAndDelete({ _id: Id });

      if (deletedUser) {
        res.json({
          message: "User deleted successfully",
          deletedUser: deletedUser,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else if (userType === "employee") {
      const deletedEmployee = await Admin.findOneAndDelete({ _id: Id });

      if (deletedEmployee) {
        res.json({
          message: "Employee deleted successfully",
          deletedEmployee: deletedEmployee,
        });
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Supervisor can delete only employee or customer" });
    }
  } catch (error) {
    // console.error("Error deleting user or employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/add", supervisorMiddleware, async(req, res) => {
  const { userName, password, userType } = req.body;

  addUserOrAdmin(userName, password, userType)
    .then((result) => {
      console.log("User/Admin added successfully:", result);
      res.json({
        message: `${userType} created successfully`,
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
    // console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/employees", adminMiddleware, async (req, res) => {
  try {
    const admin = await Admin.find();
    res.json(admin);
  } catch (error) {
    // console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
