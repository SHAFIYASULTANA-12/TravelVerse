const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const placesRoutes = require("./routes/placesroutes");
const transportRoutes = require("./routes/transportRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------------
// API ROUTES
// -----------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/transport", transportRoutes);

// -----------------------------------
// SERVE REACT FRONTEND
// -----------------------------------

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// -----------------------------------
// HOME PAGE
// -----------------------------------

app.get("/", (req, res, next) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// -----------------------------------
// REACT ROUTING FALLBACK
// -----------------------------------

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// -----------------------------------
// 404
// -----------------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// -----------------------------------
// GLOBAL ERROR HANDLER
// -----------------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong on the server."
        : err.message || "Internal server error",
  });
});

// -----------------------------------
// SERVER
// -----------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TravelVerse server running on port ${PORT}`);
});