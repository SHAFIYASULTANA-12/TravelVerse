const express = require("express");

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addItinerary,
  addExpense,
} = require("../controllers/tripcontroller");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GUEST + LOGGED-IN USERS
// ==========================================

// Create a trip
router.post("/", createTrip);

// View all trips
router.get("/", getTrips);


// ==========================================
// VIEW SINGLE TRIP
// ==========================================

router.get("/:id", getTripById);


// ==========================================
// DELETE TRIP
// ==========================================

// No login required for the current demo version
router.delete("/:id", deleteTrip);


// ==========================================
// LOGGED-IN USERS ONLY
// ==========================================

// Update trip
router.put("/:id", protect, updateTrip);

// Add itinerary
router.post("/:id/itinerary", protect, addItinerary);

// Add expense
router.post("/:id/expenses", protect, addExpense);


module.exports = router;