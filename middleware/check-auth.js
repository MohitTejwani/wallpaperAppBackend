const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(process.env.JWT_KEY);
     jwt.verify(token, "the_secret_key_of_my_api");
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};