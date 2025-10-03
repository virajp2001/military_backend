const express = require("express");
const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const db = require("../db/mysqlConnection");

router.get("/", authorizeRoles(["Admin", "Base Commander"]), (req, res) => {
  const sql = "SELECT * FROM assignments";
  db.execute(sql)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

router.post("/", authorizeRoles(["Admin", "Base Commander"]), (req, res) => {
  const { base, personnel, equipmentType, quantity, expended, date } = req.body;
  const sql = "INSERT INTO assignments (base, personnel, equipmentType, quantity, expended, date) VALUES (?, ?, ?, ?, ?, ?)";
  db.execute(sql, [base, personnel, equipmentType, quantity, expended ? 1 : 0, date])
    .then(([result]) => {
      res.json({ id: result.insertId, base, personnel, equipmentType, quantity, expended, date });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

module.exports = router;
