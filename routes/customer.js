const { Router } = require("express");
const router = Router();
const { Prize, User, db } = require("../db/index");
const userMiddleware = require("../middleware/user");

router.post("/prizes/claim", userMiddleware, async (req, res) => {
  const { prizeID } = req.body;
  const { userId } = req;

  try {
    const prize = await Prize.findById(prizeID);

    if (!prize) {
      return res.status(404).json({ message: "Prize not found." });
    }

    if (prize.status === "claimed") {
      return res.status(400).json({ message: "Prize is already claimed." });
    }

    const user = await User.findById(userId);

    console.log(user.points);
    console.log(prize.costOfPrize);
    if (user.points >= prize.costOfPrize) {
      user.points -= prize.costOfPrize;

      await user.save();

      prize.status = "claimed";
      await prize.save();

      return res.json({ message: "Prize claimed successfully." });
    } else {
      return res
        .status(403)
        .json({ message: "Not enough points to avail the prize." });
    }
  } catch (error) {
    console.error("Error claiming prize:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
