import React, { useState } from "react";
import API from "../services/api";
import "./TransportPlanner.css";

function TransportPlanner({ trip }) {
  const [activeTab, setActiveTab] = useState("flights");

  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: trip?.destination || "",
    departureDate: trip?.startDate
      ? String(trip.startDate).slice(0, 10)
      : "",
    returnDate: trip?.endDate
      ? String(trip.endDate).slice(0, 10)
      : "",
    adults: 1,
  });

  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState("");
  const [flightMessage, setFlightMessage] = useState("");

  const [bookingOptions, setBookingOptions] = useState({});
  const [bookingLoading, setBookingLoading] = useState("");

  const [budget, setBudget] = useState({
    transport: "",
    accommodation: "",
    food: "",
    localTransport: "",
    activities: "",
  });

  const [savedBudget, setSavedBudget] = useState("");

  // =====================================
  // UPDATE FLIGHT FORM
  // =====================================

  function handleFlightChange(event) {
    const { name, value } = event.target;

    setFlightForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =====================================
  // SEARCH FLIGHTS
  // =====================================

  async function searchFlights(event) {
    event.preventDefault();

    setFlightResults([]);
    setFlightError("");
    setFlightMessage("");
    setBookingOptions({});
    setFlightLoading(true);

    try {
      const response = await API.post(
        "/transport/flights",
        {
          origin: flightForm.origin.trim().toUpperCase(),
          destination: flightForm.destination
            .trim()
            .toUpperCase(),
          departureDate: flightForm.departureDate,
          returnDate: flightForm.returnDate || undefined,
          adults: Number(flightForm.adults),
          market: "IN",
        }
      );

      const results = Array.isArray(
        response.data?.itineraries
      )
        ? response.data.itineraries
        : [];

      setFlightResults(results);

      if (results.length === 0) {
        setFlightMessage(
          "No flight offers were returned. Try different airports or dates."
        );
      }
    } catch (error) {
      setFlightError(
        error.response?.data?.message ||
          "Unable to search flights. Check your connection and API configuration."
      );
    } finally {
      setFlightLoading(false);
    }
  }

  // =====================================
  // GET BOOKING LINKS
  // =====================================

  async function getBookingLinks(flight, index) {
    const flightId =
      flight.ignav_id ||
      flight.ignavId ||
      flight.id;

    if (!flightId) {
      setFlightError(
        "This flight does not provide a booking identifier."
      );
      return;
    }

    setBookingLoading(String(index));
    setFlightError("");

    try {
      const response = await API.post(
        "/transport/booking-links",
        {
          ignavId: String(flightId),
        }
      );

      const options = Array.isArray(
        response.data?.booking_options
      )
        ? response.data.booking_options
        : [];

      setBookingOptions((previous) => ({
        ...previous,
        [index]: options,
      }));

      if (options.length === 0) {
        setFlightMessage(
          "No booking links are available for this flight."
        );
      }
    } catch (error) {
      setFlightError(
        error.response?.data?.message ||
          "Could not retrieve booking links."
      );
    } finally {
      setBookingLoading("");
    }
  }

  // =====================================
  // BUDGET CALCULATOR
  // =====================================

  function handleBudgetChange(event) {
    const { name, value } = event.target;

    setBudget((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const budgetItems = [
    {
      key: "transport",
      label: "Transport",
    },
    {
      key: "accommodation",
      label: "Accommodation",
    },
    {
      key: "food",
      label: "Food",
    },
    {
      key: "localTransport",
      label: "Local transport",
    },
    {
      key: "activities",
      label: "Activities",
    },
  ];

  const totalBudget = budgetItems.reduce(
    (total, item) =>
      total + Math.max(0, Number(budget[item.key]) || 0),
    0
  );

  const plannedTripBudget = Number(
    trip?.budget || trip?.totalBudget || 0
  );

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function saveBudgetEstimate() {
    setSavedBudget(
      `Your estimated trip cost is ${formatCurrency(
        totalBudget
      )}.`
    );
  }

  // =====================================
  // SAFE DISPLAY HELPERS
  // =====================================

  function getFlightPrice(flight) {
    const price =
      flight.price ??
      flight.total_price ??
      flight.amount;

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "Price not provided";
    }

    if (typeof price === "object") {
      const amount = price.amount ?? price.value;
      const currency = price.currency || "";

      if (amount === undefined) {
        return "Price not provided";
      }

      return `${currency} ${amount}`.trim();
    }

    return String(price);
  }

  function getFlightTitle(flight, index) {
    return (
      flight.airline ||
      flight.airline_name ||
      flight.name ||
      `Flight option ${index + 1}`
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (
    <section className="tv-transport">
      <div className="tv-transport-heading">
        <div>
          <span className="tv-transport-eyebrow">
            TRAVEL SMARTER
          </span>

          <h2>Transport & Budget Planner</h2>

          <p>
            Compare available flight offers, find train
            booking options, and estimate your trip costs.
          </p>
        </div>
      </div>

      {/* TABS */}

      <div className="tv-transport-tabs">
        <button
          type="button"
          className={
            activeTab === "flights" ? "active" : ""
          }
          onClick={() => setActiveTab("flights")}
        >
          ✈️ Flights
        </button>

        <button
          type="button"
          className={
            activeTab === "trains" ? "active" : ""
          }
          onClick={() => setActiveTab("trains")}
        >
          🚆 Trains
        </button>

        <button
          type="button"
          className={
            activeTab === "budget" ? "active" : ""
          }
          onClick={() => setActiveTab("budget")}
        >
          💰 Budget
        </button>
      </div>

      {/* =================================
          FLIGHTS
      ================================== */}

      {activeTab === "flights" && (
        <div className="tv-transport-panel">
          <h3>Find flights</h3>

          <p className="tv-transport-muted">
            Enter three-letter airport codes, such as MAA
            for Chennai or DEL for Delhi.
          </p>

          <form
            className="tv-flight-form"
            onSubmit={searchFlights}
          >
            <label>
              From airport
              <input
                name="origin"
                value={flightForm.origin}
                onChange={handleFlightChange}
                placeholder="MAA"
                maxLength={3}
                required
              />
            </label>

            <label>
              To airport
              <input
                name="destination"
                value={flightForm.destination}
                onChange={handleFlightChange}
                placeholder="DEL"
                maxLength={3}
                required
              />
            </label>

            <label>
              Departure date
              <input
                type="date"
                name="departureDate"
                value={flightForm.departureDate}
                onChange={handleFlightChange}
                min={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>

            <label>
              Return date (optional)
              <input
                type="date"
                name="returnDate"
                value={flightForm.returnDate}
                onChange={handleFlightChange}
                min={flightForm.departureDate || undefined}
              />
            </label>

            <label>
              Passengers
              <select
                name="adults"
                value={flightForm.adults}
                onChange={handleFlightChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  )
                )}
              </select>
            </label>

            <button
              className="tv-transport-primary"
              type="submit"
              disabled={flightLoading}
            >
              {flightLoading
                ? "Searching..."
                : "Search Flights"}
            </button>
          </form>

          {flightError && (
            <div className="tv-transport-error">
              {flightError}
            </div>
          )}

          {flightMessage && (
            <div className="tv-transport-notice">
              {flightMessage}
            </div>
          )}

          {flightResults.length > 0 && (
            <div className="tv-flight-results">
              <h3>
                Available offers ({flightResults.length})
              </h3>

              {flightResults.map((flight, index) => (
                <article
                  className="tv-flight-card"
                  key={
                    flight.ignav_id ||
                    flight.id ||
                    index
                  }
                >
                  <div className="tv-flight-info">
                    <h4>
                      {getFlightTitle(flight, index)}
                    </h4>

                    <p>
                      {flight.origin || flightForm.origin}
                      {" → "}
                      {flight.destination ||
                        flightForm.destination}
                    </p>

                    <strong>
                      {getFlightPrice(flight)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="tv-transport-secondary"
                    onClick={() =>
                      getBookingLinks(flight, index)
                    }
                    disabled={
                      bookingLoading === String(index)
                    }
                  >
                    {bookingLoading === String(index)
                      ? "Loading..."
                      : "View Booking Links"}
                  </button>

                  {bookingOptions[index] && (
                    <div className="tv-booking-links">
                      {bookingOptions[index].map(
                        (option, optionIndex) => (
                          <div key={optionIndex}>
                            <strong>
                              {option.provider ||
                                option.name ||
                                "Booking provider"}
                            </strong>

                            {option.links.map(
                              (link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.label ||
                                    link.text ||
                                    "Continue to provider"}
                                </a>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================
          TRAINS
      ================================== */}

      {activeTab === "trains" && (
        <div className="tv-transport-panel">
          <h3>Search Indian trains</h3>

          <p className="tv-transport-muted">
            Continue to the official IRCTC website to
            check train schedules, fares, and availability.
          </p>

          <div className="tv-train-details">
            <div>
              <span>Departure city</span>

              <strong>
                {trip?.origin ||
                  trip?.departureCity ||
                  "Choose your departure city"}
              </strong>
            </div>

            <div>
              <span>Destination</span>

              <strong>
                {trip?.destination ||
                  "Your destination"}
              </strong>
            </div>
          </div>

          <a
            className="tv-transport-primary tv-transport-link"
            href="https://www.irctc.co.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Search on IRCTC ↗
          </a>

          <p className="tv-transport-disclaimer">
            Train fares and seat availability are not
            retrieved directly inside TravelVerse.
          </p>
        </div>
      )}

      {/* =================================
          BUDGET
      ================================== */}

      {activeTab === "budget" && (
        <div className="tv-transport-panel">
          <h3>Estimate your trip budget</h3>

          <p className="tv-transport-muted">
            Enter your expected expenses in Indian rupees.
            These are your estimates, not live market prices.
          </p>

          <div className="tv-budget-form">
            {budgetItems.map((item) => (
              <label key={item.key}>
                {item.label} (₹)

                <input
                  type="number"
                  name={item.key}
                  value={budget[item.key]}
                  onChange={handleBudgetChange}
                  min="0"
                  step="1"
                  placeholder="0"
                />
              </label>
            ))}
          </div>

          <div className="tv-budget-total">
            <span>Estimated total</span>

            <strong>
              {formatCurrency(totalBudget)}
            </strong>
          </div>

          {plannedTripBudget > 0 && (
            <div className="tv-budget-comparison">
              <div>
                <span>Your saved trip budget</span>

                <strong>
                  {formatCurrency(plannedTripBudget)}
                </strong>
              </div>

              <div>
                <span>
                  {totalBudget > plannedTripBudget
                    ? "Amount over budget"
                    : "Remaining budget"}
                </span>

                <strong>
                  {formatCurrency(
                    Math.abs(
                      plannedTripBudget - totalBudget
                    )
                  )}
                </strong>
              </div>

              <p>
                {totalBudget > plannedTripBudget
                  ? "Your estimate exceeds your saved trip budget."
                  : "Your estimate is within your saved trip budget."}
              </p>
            </div>
          )}

          <button
            type="button"
            className="tv-transport-primary"
            onClick={saveBudgetEstimate}
          >
            Calculate Budget
          </button>

          {savedBudget && (
            <div className="tv-transport-notice">
              {savedBudget}
            </div>
          )}

          <p className="tv-transport-disclaimer">
            This calculator does not save expenses to your
            database. It calculates an estimate in this
            component only.
          </p>
        </div>
      )}
    </section>
  );
}

export default TransportPlanner;