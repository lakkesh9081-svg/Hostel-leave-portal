const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db.js");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Connect to database
connectDB().catch(err => console.error("DB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/outpass", require("./routes/outpassRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/complaint", require("./routes/complaintRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/leave", leaveRoutes);

// ---- React SPA Hosting Fix ----
// If you build the frontend (client/dist), this serves it and supports deep links like /student
const fs = require("fs");
const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}
// --------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
