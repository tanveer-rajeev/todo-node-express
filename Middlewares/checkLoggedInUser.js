const jwt = require("jsonwebtoken");

const checkLoggedInUser = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { username } = decoded;
    req.username = username;
    next();
  } catch (err) {
    next("Authentication failed: " + err.message);
  }
};

module.exports = checkLoggedInUser;
