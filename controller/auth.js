const jwt = require("jsonwebtoken");
// const env = require("../config/env");
// const jwtSecret = env.jwtSecret;
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  try {
    if (!req.headers["authorization"]) throw new Error("JWT Token missing!");

    let token = req.headers["authorization"].split(" ")[1];
    var decoded = jwt.verify(token, jwtSecret);
    if (decoded) {
      req.body._id = decoded.id;
      req.body.accountType = decoded.type;
      req._id = decoded.id;
      req.accountType = decoded.type;
      next();
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(401)
      .json({ status: "Error", message: "Unauthorized access", data: {} });
  }
};