const mongoose = require("mongoose");

// ===============================
// ITINERARY
// ===============================

const itinerarySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: false,
    },

    time: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    activity: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);


// ===============================
// EXPENSE
// ===============================

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Other",
    },

    amount: {
      type: Number,
      default: 0,
    },

    date: {
      type: Date,
      required: false,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);


// ===============================
// HOTEL / ACCOMMODATION
// ===============================

const accommodationSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    checkIn: {
      type: Date,
      required: false,
    },

    checkOut: {
      type: Date,
      required: false,
    },

    roomType: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    bookingReference: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);


// ===============================
// TRIP SCHEMA
// ===============================

const tripSchema = new mongoose.Schema(
  {
    // Trip name
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Keep name also for compatibility
    name: {
      type: String,
      default: "",
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    budget: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    // ===============================
    // USER / COLLABORATION
    // ===============================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ===============================
    // TRIP STATUS
    // ===============================

    status: {
      type: String,
      enum: [
        "Planned",
        "Ongoing",
        "Completed",
        "Cancelled",
      ],
      default: "Planned",
    },

    image: {
      type: String,
      default: "",
    },

    // ===============================
    // ITINERARY
    // ===============================

    itinerary: {
      type: [itinerarySchema],
      default: [],
    },

    // ===============================
    // EXPENSES
    // ===============================

    expenses: {
      type: [expenseSchema],
      default: [],
    },

    // ===============================
    // HOTEL
    // ===============================

    accommodation: {
      type: accommodationSchema,
      default: null,
    },

    // Also support multiple hotels
    hotels: {
      type: [accommodationSchema],
      default: [],
    },

    // ===============================
    // TRAVEL DETAILS
    // ===============================

    travelers: {
      type: Number,
      default: 1,
    },

    notes: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);


// ===============================
// AUTOMATIC NAME COMPATIBILITY
// ===============================

tripSchema.pre("validate", function (next) {
  if (!this.title && this.name) {
    this.title = this.name;
  }

  if (!this.name && this.title) {
    this.name = this.title;
  }

  next();
});


module.exports = mongoose.model("Trip", tripSchema);