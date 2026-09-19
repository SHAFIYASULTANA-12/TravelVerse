const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

dotenv.config();

connectDB();

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to TravelVerse API",
        status: "Running"
    });
});


// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);


// 404 ROUTE
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TravelVerse server running on port ${PORT}`);
});