const { Router } = require("express");
const router = Router();
const { Prize, Payment, Admin, User, db } = require("../db/index");
const adminMiddleware = require("../middleware/admin");
const mongoose = require("mongoose");

router.post("/", adminMiddleware, async (req, res) => {
  const { customerID, paymentID, statusOfPrize, costOfPrize } = req.body;
  try {
    const newPrize = new Prize({
      customerID: customerID,
      paymentID: paymentID,
      status: statusOfPrize,
      costOfPrize: costOfPrize,
    });

    const savedPrize = await newPrize.save();

    res.json({
      message: "newPrize added successfully",
      payment: savedPrize,
    });
  } catch (error) {
    console.error("Error adding prize:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", adminMiddleware, async (req, res) => {
  const { customerId } = req.params;
  try {
    const prizes = await Prize.find({ customerID: customerId });
    res.json({
        msg : `prizes fetched with customer id ${customerID}`,
        prizes: prizes,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
