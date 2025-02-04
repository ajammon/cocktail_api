const admin = require("firebase-admin");
const logger = require("../libraries/logger/LoggerManager");

// Middleware for authenticating access token
const authenticationToken = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const accessToken = req.headers.authorization;

  const validApiKeys = require("../../valid_api_keys.json");
  if (!validApiKeys.keys.contains(apiKey)) {
    return res.status(401).json({ error: "Unauthorized - Api Key missing or invalid." });
  }

  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Access Token missing or invalid" });
  }

  const idToken = accessToken.split("Bearer ")[1];

  try {
    // Verify the access token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user information to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error authenticating user:", error);
    logger.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticationToken;
