const express = require("express");
const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const db = require("../db/mysqlConnection");

router.get("/", authorizeRoles(["Admin", "Logistics Officer"]), (req, res) => {
  const sql = "SELECT * FROM transfers";
  db.execute(sql)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

router.post("/", authorizeRoles(["Admin", "Logistics Officer"]), (req, res) => {
  const { fromBase, toBase, equipmentType, quantity, date } = req.body;
  const sql = "INSERT INTO transfers (fromBase, toBase, equipmentType, quantity, date) VALUES (?, ?, ?, ?, ?)";
  db.execute(sql, [fromBase, toBase, equipmentType, quantity, date])
    .then(([result]) => {
      res.json({ id: result.insertId, fromBase, toBase, equipmentType, quantity, date });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

module.exports = router;
