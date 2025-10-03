const express = require("express");
const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const db = require("../db/mysqlConnection");

router.get("/", authorizeRoles(["Admin", "Logistics Officer"]), (req, res) => {
  const sql = "SELECT * FROM purchases";
  db.execute(sql)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

router.post("/", authorizeRoles(["Admin", "Logistics Officer"]), (req, res) => {
  const { base, equipmentType, quantity, date, status } = req.body;
  const sql = "INSERT INTO purchases (base, equipmentType, quantity, date, status) VALUES (?, ?, ?, ?, ?)";
  db.execute(sql, [base, equipmentType, quantity, date, status || "Pending"])
    .then(([result]) => {
      res.json({ id: result.insertId, base, equipmentType, quantity, date, status: status || "Pending" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

module.exports = router;
