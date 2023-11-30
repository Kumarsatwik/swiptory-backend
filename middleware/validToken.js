const jwt = require("jsonwebtoken");

const validToken = (req, res, next) => {
  try {
    const loginToken = req.headers.token;
    // console.log(loginToken);
    if (!loginToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const user = jwt.verify(loginToken, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ message: "Expired Token" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "User unauthorized" });
  }
};

module.exports = validToken;
