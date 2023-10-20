const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function validateJWT(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET);
    req.role = decodeToken.role;
    req.userDBId = decodeToken.id;
    next();
  } catch (error) {
    return res.status(401).send({ error: error });
  }
};
