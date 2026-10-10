const express = require("express");

const router = express.Router();

const IGNAV_BASE_URL = "https://ignav.com/api";

// ========================================
// HELPER: CHECK API KEY
// ========================================

function getApiKey(res) {
  const apiKey = process.env.IGNAV_API_KEY;

  if (!apiKey) {
    res.status(503).json({
      success: false,
      message:
        "Flight search is not configured yet. Please add IGNAV_API_KEY to the backend environment variables.",
    });

    return null;
  }

  return apiKey;
}

// ========================================
// HELPER: CALL IGNAV API
// ========================================

async function callIgnav(endpoint, apiKey, body) {
  const response = await fetch(
    `${IGNAV_BASE_URL}${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },

      body: JSON.stringify(body),
    }
  );

  const responseText = await response.text();

  let data;

  try {
    data = responseText
      ? JSON.parse(responseText)
      : {};
  } catch {
    data = {
      message: "The flight provider returned an invalid response.",
    };
  }

  if (!response.ok) {
    const error = new Error(
      data.detail ||
        data.message ||
        "Flight provider request failed."
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

// ========================================
// HELPER: VALIDATE FLIGHT SEARCH
// ========================================

function validateFlightSearch(body) {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
  } = body;

  if (
    typeof origin !== "string" ||
    typeof destination !== "string"
  ) {
    return "Origin and destination are required.";
  }

  const from = origin.trim().toUpperCase();
  const to = destination.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(from)) {
    return "Enter a valid three-letter departure airport code.";
  }

  if (!/^[A-Z]{3}$/.test(to)) {
    return "Enter a valid three-letter destination airport code.";
  }

  if (from === to) {
    return "Departure and destination airports must be different.";
  }

  if (
    typeof departureDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)
  ) {
    return "Enter a valid departure date.";
  }

  const parsedDeparture = new Date(
    `${departureDate}T00:00:00Z`
  );

  if (
    Number.isNaN(parsedDeparture.getTime()) ||
    parsedDeparture.toISOString().slice(0, 10) !== departureDate
  ) {
    return "The departure date is invalid.";
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (parsedDeparture < today) {
    return "Departure date cannot be in the past.";
  }

  if (returnDate) {
    if (
      typeof returnDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(returnDate)
    ) {
      return "Enter a valid return date.";
    }

    const parsedReturn = new Date(
      `${returnDate}T00:00:00Z`
    );

    if (
      Number.isNaN(parsedReturn.getTime()) ||
      parsedReturn.toISOString().slice(0, 10) !== returnDate
    ) {
      return "The return date is invalid.";
    }

    if (parsedReturn < parsedDeparture) {
      return "Return date must be on or after the departure date.";
    }
  }

  const passengerCount =
    adults === undefined ? 1 : Number(adults);

  if (
    !Number.isInteger(passengerCount) ||
    passengerCount < 1 ||
    passengerCount > 9
  ) {
    return "Passengers must be between 1 and 9.";
  }

  return null;
}

// ========================================
// POST /api/transport/flights
//
// Search one-way or return flights.
// ========================================

router.post("/flights", async (req, res) => {
  try {
    const validationError = validateFlightSearch(
      req.body || {}
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const apiKey = getApiKey(res);

    if (!apiKey) {
      return;
    }

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
      market = "IN",
    } = req.body;

    const from = origin.trim().toUpperCase();
    const to = destination.trim().toUpperCase();

    const passengerCount = Number(adults);

    const allowedMarkets = [
      "IN",
      "US",
      "GB",
      "AU",
      "CA",
      "SG",
      "AE",
      "DE",
      "FR",
      "JP",
    ];

    const selectedMarket =
      typeof market === "string" &&
      allowedMarkets.includes(market.toUpperCase())
        ? market.toUpperCase()
        : "IN";

    let endpoint;
    let requestBody;

    if (returnDate) {
      endpoint = "/fares/round-trip";

      requestBody = {
        origin: from,
        destination: to,
        departure_date: departureDate,
        return_date: returnDate,
        adults: passengerCount,
        market: selectedMarket,
      };
    } else {
      endpoint = "/fares/one-way";

      requestBody = {
        origin: from,
        destination: to,
        departure_date: departureDate,
        adults: passengerCount,
        market: selectedMarket,
      };
    }

    const data = await callIgnav(
      endpoint,
      apiKey,
      requestBody
    );

    // Do not invent fares if the provider returns no results.
    const itineraries = Array.isArray(data.itineraries)
      ? data.itineraries
      : [];

    return res.status(200).json({
      success: true,

      origin: from,
      destination: to,

      departureDate,
      returnDate: returnDate || null,

      currencyNote:
        "Prices and availability can change. Confirm the final fare with the booking provider.",

      itineraries,
    });
  } catch (error) {
    console.error(
      "Flight search error:",
      error.message
    );

    const status =
      error.status === 400 ? 400 :
      error.status === 401 || error.status === 403 ? 502 :
      error.status === 429 ? 503 :
      502;

    return res.status(status).json({
      success: false,

      message:
        status === 503
          ? "Flight search is temporarily unavailable. Please try again later."
          : "Unable to retrieve flight results. Please check your details and try again.",
    });
  }
});

// ========================================
// POST /api/transport/booking-links
//
// Get redirect links for a selected flight.
// ========================================

router.post("/booking-links", async (req, res) => {
  try {
    const { ignavId } = req.body || {};

    if (
      typeof ignavId !== "string" ||
      ignavId.trim().length === 0 ||
      ignavId.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid flight selection is required.",
      });
    }

    const apiKey = getApiKey(res);

    if (!apiKey) {
      return;
    }

    const data = await callIgnav(
      "/fares/booking-links",
      apiKey,
      {
        ignav_id: ignavId.trim(),
      }
    );

    const bookingOptions = Array.isArray(
      data.booking_options
    )
      ? data.booking_options
      : [];

    // Only return actual HTTP/HTTPS links.
    const safeBookingOptions = bookingOptions
      .map((option) => ({
        ...option,

        links: Array.isArray(option.links)
          ? option.links.filter((link) => {
              if (
                !link ||
                typeof link.url !== "string"
              ) {
                return false;
              }

              try {
                const parsedUrl = new URL(link.url);

                return (
                  parsedUrl.protocol === "https:" ||
                  parsedUrl.protocol === "http:"
                );
              } catch {
                return false;
              }
            })
          : [],
      }))
      .filter((option) => option.links.length > 0);

    return res.status(200).json({
      success: true,
      booking_options: safeBookingOptions,
    });
  } catch (error) {
    console.error(
      "Booking link error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "Unable to retrieve booking links for this flight. Please try another flight.",
    });
  }
});

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;