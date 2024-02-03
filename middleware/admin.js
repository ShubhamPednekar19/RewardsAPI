const jwt = require("jsonwebtoken");
const jwtPassword = "123456";


function adminMiddleware(req, res, next) {
  console.log("Headers:", req.headers);

  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];

  console.log(tokenHeader);
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.verify(token, jwtPassword);
    if (decoded.userType === "employee") {
      next(); // Continue to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Forbidden. Not an employee." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }

}

module.exports = adminMiddleware;
