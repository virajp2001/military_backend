const express = require("express");
const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const db = require("../db/mysqlConnection");

router.get("/", authorizeRoles(["Admin", "Base Commander", "Logistics Officer"]), (req, res) => {
  // Calculate values from database
  const result = {};

  // Example queries - these should be adjusted based on actual business logic
  const openingBalanceSql = "SELECT SUM(quantity) as total FROM purchases";
  const expendedSql = "SELECT SUM(quantity) as total FROM assignments WHERE expended = 1";
  const assignedSql = "SELECT SUM(quantity) as total FROM assignments";
  const transfersSql = "SELECT SUM(quantity) as total FROM transfers";

  Promise.all([
    db.execute(openingBalanceSql).then(([rows]) => rows[0].total || 0),
    db.execute(expendedSql).then(([rows]) => rows[0].total || 0),
    db.execute(assignedSql).then(([rows]) => rows[0].total || 0),
    db.execute(transfersSql).then(([rows]) => rows[0].total || 0),
  ])
    .then(([openingBalance, expended, assigned, transfers]) => {
      result.openingBalance = openingBalance;
      result.expended = expended;
      result.assigned = assigned;
      result.closingBalance = openingBalance - expended - transfers;
      result.netMovement = transfers;
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
});

module.exports = router;
