const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://shubhamp190502:apjiiti@cluster0.6fx3nu9.mongodb.net/rewardsAPI"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const SupervisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
});

const paymentSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cost: { type: Number, required: true },
  points: {
    type: Number,
    default: function () {
      return this.cost * 0.05; 
    },
    required: true,
  },
});

paymentSchema.pre("save", async function (next) {
  try {

    const user = await mongoose.model("User").findById(this.customerID);
    if (user) {
      user.points += this.points; 
      await user.save(); 
    }
    next();
  } catch (error) {
    next(error);
  }
});

const prizeSchema = new mongoose.Schema({
  paymentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "claimed"],
    default: "Pending",
  },

  costOfPrize: {
    type: Number,
    default: 0,
  },
});

const Supervisor = mongoose.model("Supervisor", SupervisorSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Prize = mongoose.model("Prize", prizeSchema);

module.exports = {
  Supervisor,
  Admin,
  User,
  Payment,
  Prize,
  db,
};
