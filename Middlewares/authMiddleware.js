const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
module.exports = protect;
