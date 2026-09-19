const Trip = require("../models/Trip");


// ==========================================
// CREATE TRIP
// Guest + Logged-in users
// ==========================================

const createTrip = async (req, res) => {
    try {

        const {
            title,
            name,
            destination,
            startDate,
            endDate,
            budget
        } = req.body;

        const tripName = title || name;

        if (!tripName || !destination || !startDate || !endDate) {
            return res.status(400).json({
                message:
                    "Please provide trip name, destination, start date and end date"
            });
        }

        const trip = await Trip.create({
            name: tripName,
            destination,
            startDate,
            endDate,
            budget: budget || 0
        });

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });

    } catch (error) {

        console.error("Create trip error:", error);

        res.status(500).json({
            message: "Failed to create trip",
            error: error.message
        });

    }
};


// ==========================================
// GET ALL TRIPS
// Guest + Logged-in users
// ==========================================

const getTrips = async (req, res) => {
    try {

        const trips = await Trip.find()
            .sort({ startDate: 1 });

        res.json(trips);

    } catch (error) {

        console.error("Get trips error:", error);

        res.status(500).json({
            message: "Failed to fetch trips",
            error: error.message
        });

    }
};


// ==========================================
// GET SINGLE TRIP
// ==========================================

const getTripById = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json(trip);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch trip",
            error: error.message
        });

    }
};


// ==========================================
// UPDATE TRIP
// ==========================================

const updateTrip = async (req, res) => {
    try {

        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            message: "Trip updated successfully",
            trip
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update trip",
            error: error.message
        });

    }
};


// ==========================================
// DELETE TRIP
// ==========================================

const deleteTrip = async (req, res) => {
    try {

        const trip = await Trip.findByIdAndDelete(
            req.params.id
        );

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            message: "Trip deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete trip",
            error: error.message
        });

    }
};


// ==========================================
// PLACEHOLDER FOR FUTURE FEATURES
// ==========================================

const addItinerary = async (req, res) => {

    res.status(501).json({
        message: "Itinerary feature will be added next"
    });

};


const addExpense = async (req, res) => {

    res.status(501).json({
        message: "Expense feature will be added next"
    });

};


module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    addItinerary,
    addExpense
};