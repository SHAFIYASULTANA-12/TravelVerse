const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const placesRoutes = require("./routes/placesRoutes");
const transportRoutes = require("./routes/transportRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------------
// HOME
// -----------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TravelVerse API",
    status: "Running",
    features: [
      "Authentication",
      "Trip Management",
      "Places",
      "Transport Planner",
    ],
  });
});

// -----------------------------------
// API ROUTES
// -----------------------------------

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/places", placesRoutes);

// NEW: FLIGHTS AND TRANSPORT
app.use("/api/transport", transportRoutes);

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

app.listen(PORT, () => {
  console.log(
    `TravelVerse server running on port ${PORT}`
  );
});