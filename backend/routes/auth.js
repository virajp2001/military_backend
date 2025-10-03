const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/mysqlConnection");

// User login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  db.execute(sql, [username])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const user = rows[0];
      bcrypt.compare(password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key_here");
        res.json({ token, user: { name: user.username, role: user.role } });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

// User registration (signup)
router.post("/signup", (req, res) => {
  const { username, password, role, name, email } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }
  const checkUserSql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.execute(checkUserSql, [username, email])
    .then(([rows]) => {
      if (rows.length > 0) {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const insertSql = "INSERT INTO users (username, password, role, name, email) VALUES (?, ?, ?, ?, ?)";
        db.execute(insertSql, [username, hashedPassword, role, name || null, email || null])
          .then(() => {
            res.status(201).json({ message: "User registered successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Database error", error: err.message });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

module.exports = router;
