const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const usersRouter = require("./routes/user");
const paymentsRouter = require("./routes/payments");
const prizesRouter = require("./routes/prizes");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/prizes", prizesRouter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
