const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

function userMiddleware(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    console.log("unauthorized");
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.verify(token, jwtPassword);
    if (decoded.userType === "customer") {
      req.userId = decoded._id;
      next(); // Continue to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Forbidden. Not an customer." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }

}

module.exports = userMiddleware;
