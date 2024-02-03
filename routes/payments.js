const { Router } = require("express");
const router = Router();
const { Payment, db } = require("../db/index");
const userMiddleware = require("../middleware/user");
const adminMiddleware = require("../middleware/admin");
const mongoose = require("mongoose");


router.post("/", userMiddleware, async (req, res) => {
  const { cost } = req.body;
  const { userId } = req;
  try {
    const newPayment = new Payment({
      customerID: userId,
      cost: cost,
    });

    const savedPayment = await newPayment.save();

    res.json({
      message: "Payment added successfully",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", adminMiddleware, async (req, res) => {
  const customerId = req.params.id;
  console.log('customerId:', customerId);
  try {
    const payments = await Payment.find({ customerID: customerId });

    res.json({
      message: "Payments fetched successfully",
      payments: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id/points", adminMiddleware, async (req, res) => {
  const customerId  = req.params.id;

  try {
    const payments = await Payment.find({ customerID: customerId });
    const totalPoints = payments.reduce(
      (sum, payment) => sum + payment.points,
      0
    );

    res.json({
      message: "Payments fetched successfully",
      payments: payments,
      totalPoints: totalPoints,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
