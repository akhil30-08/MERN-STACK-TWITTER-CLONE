const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const { JWT_STR } = require("../config");

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the authorization header is set
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Authentication failed: No token provided");
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, JWT_STR);
    const userId = decodedToken._id;
    const user = await UserModel.findById(userId);

    // If user not found, token is invalid
    if (!user) {
      return res.status(401).send("Authentication failed: Invalid token");
    }

    // Store user data in req.user for future use
    req.user = user;

    // Continue to the router function
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = authMiddleware;
