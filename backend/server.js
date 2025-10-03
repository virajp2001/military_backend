require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const purchasesRoutes = require("./routes/purchases");
const transfersRoutes = require("./routes/transfers");
const assignmentsRoutes = require("./routes/assignments");
const { authenticateToken } = require("./middleware/auth");


const db = require("./db/mysqlConnection");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/purchases", authenticateToken, purchasesRoutes);
app.use("/api/transfers", authenticateToken, transfersRoutes);
app.use("/api/assignments", authenticateToken, assignmentsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
