const jwt = require('jsonwebtoken');
const secret = "secret123";

exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ status: "error", message: "Token tidak ada" });

  const token = header.split(" ")[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ status: "error", message: "Token tidak valid" });
    req.user = decoded;
    next();
  });
};
