const db = require("../config/db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secret = "secret123";

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: "Server error" });
    if (result.length === 0) return res.json({ status: "error", message: "User tidak ditemukan" });

    const user = result[0];

    if (md5(password) !== user.password)
      return res.json({ status: "error", message: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1h" });

    return res.json({
      status: "success",
      message: "Login berhasil",
      token
    });
  });
};
