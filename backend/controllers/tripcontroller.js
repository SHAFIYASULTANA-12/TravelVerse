const Trip = require("../models/Trip");


// ==========================================
// CREATE TRIP
// ==========================================

const createTrip = async (req, res) => {
    try {

        const {
            title,
            name,
            destination,
            startDate,
            endDate,
            budget,
            description
        } = req.body;

        const tripName = title || name;

        if (!tripName || !destination || !startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide trip name, destination, start date and end date"
            });
        }

        const trip = await Trip.create({
            title: tripName,
            name: tripName,
            destination,
            startDate,
            endDate,
            budget: budget || 0,
            description: description || ""
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

        console.error("Get trip error:", error);

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

        console.error("Update trip error:", error);

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

        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            message: "Trip deleted successfully"
        });

    } catch (error) {

        console.error("Delete trip error:", error);

        res.status(500).json({
            message: "Failed to delete trip",
            error: error.message
        });
    }
};


// ==========================================
// ADD ITINERARY
// ==========================================

const addItinerary = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const {
            date,
            time,
            title,
            activity,
            location,
            description,
            duration
        } = req.body;

        const itineraryItem = {
            date,
            time: time || "",
            title: title || "",
            activity: activity || "",
            location: location || "",
            description: description || "",
            duration: duration || ""
        };

        trip.itinerary.push(itineraryItem);

        await trip.save();

        res.status(201).json({
            message: "Itinerary added successfully",
            trip
        });

    } catch (error) {

        console.error("Add itinerary error:", error);

        res.status(500).json({
            message: "Failed to add itinerary",
            error: error.message
        });
    }
};


// ==========================================
// ADD EXPENSE
// ==========================================

const addExpense = async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const {
            title,
            category,
            amount,
            date,
            description
        } = req.body;

        const expense = {
            title: title || "",
            category: category || "Other",
            amount: amount || 0,
            date,
            description: description || ""
        };

        trip.expenses.push(expense);

        await trip.save();

        res.status(201).json({
            message: "Expense added successfully",
            trip
        });

    } catch (error) {

        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Failed to add expense",
            error: error.message
        });
    }
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