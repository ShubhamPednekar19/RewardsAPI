const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://shubhamp190502:lwyD0SpnwwdeP6wH@cluster0.6fx3nu9.mongodb.net/rewardsAPI"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define schemas
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Schema definition here
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   type: { type: String, required: true },
  // Schema definition here
});

// Define Payment Schema
const paymentSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Define Prize Schema
const prizeSchema = new mongoose.Schema({
  paymentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Prize = mongoose.model("Prize", paymentSchema);


module.exports = {
  Admin,
  User,
  Payment,
  Prize,
  db,
};
