const db = require('../config/db');
const md5 = require('md5');

// 🔹 Tambah user baru
exports.createUser = (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role)
    return res.status(400).json({ status: "error", message: "Semua field harus diisi" });

  const hash = md5(password);

  db.query(
    "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)",
    [name, username, hash, role],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Gagal menambah user" });
      }

      res.json({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          id: result.insertId,
          name,
          username,
          role
        }
      });
    }
  );
};

// 🔹 Update user berdasarkan ID
exports.updateUser = (req, res) => {
  const { name, username, role, password } = req.body;
  const id = req.params.id;

  const hash = password ? md5(password) : null;
  const sql = password
    ? "UPDATE users SET name=?, username=?, role=?, password=? WHERE id=?"
    : "UPDATE users SET name=?, username=?, role=? WHERE id=?";

  const params = password
    ? [name, username, role, hash, id]
    : [name, username, role, id];

  db.query(sql, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Gagal mengupdate user" });
    }

    db.query("SELECT id, name, username, role FROM users WHERE id=?", [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Gagal mengambil data user" });
      }

      if (result.length === 0) {
        return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
      }

      return res.json({
        status: "success",
        message: "Pengguna berhasil diubah",
        data: result[0]
      });
    });
  });
};

// 🔹 Ambil user berdasarkan ID
exports.getUser = (req, res) => {
  const id = req.params.id;

  db.query("SELECT id, name, username, role FROM users WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Gagal mengambil data user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    return res.json({
      status: "success",
      data: result[0]
    });
  });
};
