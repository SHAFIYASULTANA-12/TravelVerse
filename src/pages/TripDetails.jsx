import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import "./TripDetails.css";

const destinationData = {
  delhi: {
    places: [
      {
        name: "India Gate",
        time: "8:00 AM – 10:00 AM",
        description: "Start the trip with a visit to the iconic India Gate and Kartavya Path.",
        type: "Landmark",
      },
      {
        name: "Humayun's Tomb",
        time: "10:30 AM – 12:30 PM",
        description: "Explore the beautiful Mughal-era architecture and gardens.",
        type: "Historical",
      },
      {
        name: "Qutub Minar",
        time: "2:00 PM – 4:00 PM",
        description: "Visit the UNESCO World Heritage monument and explore the surrounding complex.",
        type: "Historical",
      },
      {
        name: "Lotus Temple",
        time: "4:30 PM – 6:00 PM",
        description: "Relax at the famous lotus-shaped temple and its peaceful surroundings.",
        type: "Architecture",
      },
      {
        name: "Connaught Place",
        time: "6:30 PM – 9:00 PM",
        description: "Explore shopping streets, cafes and restaurants in central Delhi.",
        type: "Shopping & Food",
      },
      {
        name: "Red Fort",
        time: "9:00 AM – 11:30 AM",
        description: "Explore one of India's most important Mughal monuments.",
        type: "Historical",
      },
      {
        name: "Jama Masjid",
        time: "12:00 PM – 1:30 PM",
        description: "Visit the historic mosque and explore Old Delhi.",
        type: "Culture",
      },
      {
        name: "Chandni Chowk",
        time: "2:00 PM – 5:00 PM",
        description: "Experience Old Delhi's famous markets and street food.",
        type: "Market",
      },
    ],
    hotels: [
      {
        name: "The Lalit New Delhi",
        area: "Connaught Place",
        price: "₹6,000 – ₹10,000/night",
        rating: "4.4/5",
      },
      {
        name: "Bloomrooms @ Janpath",
        area: "Central Delhi",
        price: "₹3,000 – ₹5,000/night",
        rating: "4.3/5",
      },
      {
        name: "Hotel Hari Piorko",
        area: "Paharganj",
        price: "₹1,500 – ₹3,000/night",
        rating: "4.0/5",
      },
    ],
    foods: [
      "Butter Chicken",
      "Chole Bhature",
      "Delhi-style Paratha",
      "Momos",
      "Chaat",
    ],
  },

  munnar: {
    places: [
      {
        name: "Mattupetty Dam",
        time: "8:00 AM – 10:00 AM",
        description: "Enjoy the scenic reservoir surrounded by the Western Ghats.",
        type: "Nature",
      },
      {
        name: "Echo Point",
        time: "10:30 AM – 12:00 PM",
        description: "Enjoy mountain views and the famous echo phenomenon.",
        type: "Nature",
      },
      {
        name: "Tea Museum",
        time: "2:00 PM – 3:30 PM",
        description: "Learn about Munnar's tea history and production.",
        type: "Culture",
      },
      {
        name: "Tea Gardens",
        time: "4:00 PM – 6:00 PM",
        description: "Walk through Munnar's iconic green tea plantations.",
        type: "Scenic",
      },
      {
        name: "Top Station",
        time: "7:00 AM – 10:00 AM",
        description: "Enjoy panoramic views of the Western Ghats and surrounding valleys.",
        type: "Viewpoint",
      },
      {
        name: "Eravikulam National Park",
        time: "10:30 AM – 1:00 PM",
        description: "Explore the national park and its mountain ecosystem.",
        type: "Wildlife",
      },
      {
        name: "Attukad Waterfalls",
        time: "3:00 PM – 5:00 PM",
        description: "Relax near the beautiful waterfalls surrounded by hills.",
        type: "Nature",
      },
      {
        name: "Kundala Lake",
        time: "9:00 AM – 11:00 AM",
        description: "Enjoy the peaceful lake and surrounding tea plantations.",
        type: "Lake",
      },
    ],
    hotels: [
      {
        name: "Blanket Hotel & Spa",
        area: "Attukad",
        price: "₹7,000 – ₹12,000/night",
        rating: "4.5/5",
      },
      {
        name: "The Munnar Queen",
        area: "Chithirapuram",
        price: "₹4,000 – ₹7,000/night",
        rating: "4.3/5",
      },
      {
        name: "Zostel Munnar",
        area: "Anachal",
        price: "₹800 – ₹2,000/night",
        rating: "4.4/5",
      },
    ],
    foods: [
      "Kerala Parotta",
      "Appam & Stew",
      "Puttu & Kadala Curry",
      "Kerala Sadya",
      "Tea & Local Snacks",
    ],
  },

  paris: {
    places: [
      {
        name: "Eiffel Tower",
        time: "9:00 AM – 11:30 AM",
        description: "Visit Paris's most famous landmark and enjoy panoramic city views.",
        type: "Landmark",
      },
      {
        name: "Arc de Triomphe",
        time: "12:00 PM – 1:30 PM",
        description: "Explore the famous monument at the end of the Champs-Élysées.",
        type: "Landmark",
      },
      {
        name: "Champs-Élysées",
        time: "2:00 PM – 4:00 PM",
        description: "Walk along one of Paris's most famous avenues.",
        type: "Shopping",
      },
      {
        name: "Louvre Museum",
        time: "9:00 AM – 1:00 PM",
        description: "Explore one of the world's largest and most famous museums.",
        type: "Museum",
      },
      {
        name: "Notre-Dame Cathedral",
        time: "2:00 PM – 3:30 PM",
        description: "Visit the historic cathedral and explore the surrounding Île de la Cité.",
        type: "Architecture",
      },
      {
        name: "Seine River",
        time: "5:00 PM – 7:00 PM",
        description: "Take a relaxing walk or river cruise along the Seine.",
        type: "Scenic",
      },
      {
        name: "Montmartre",
        time: "9:00 AM – 12:00 PM",
        description: "Explore the artistic streets and Sacré-Cœur area.",
        type: "Culture",
      },
      {
        name: "Sacré-Cœur",
        time: "12:00 PM – 2:00 PM",
        description: "Visit the famous basilica and enjoy views across Paris.",
        type: "Landmark",
      },
    ],
    hotels: [
      {
        name: "Hôtel Malte – Astotel",
        area: "1st Arrondissement",
        price: "€120 – €220/night",
        rating: "4.4/5",
      },
      {
        name: "Novotel Paris Centre Tour Eiffel",
        area: "15th Arrondissement",
        price: "€130 – €250/night",
        rating: "4.1/5",
      },
      {
        name: "Generator Paris",
        area: "10th Arrondissement",
        price: "€50 – €100/night",
        rating: "4.0/5",
      },
    ],
    foods: [
      "Croissants",
      "Crêpes",
      "French Onion Soup",
      "Baguette Sandwiches",
      "Macarons",
    ],
  },
};

function getDestinationData(destination) {
  const key = String(destination || "")
    .trim()
    .toLowerCase();

  if (destinationData[key]) {
    return destinationData[key];
  }

  return {
    places: [
      {
        name: `${destination} City Centre`,
        time: "9:00 AM – 11:00 AM",
        description: `Explore the main attractions and landmarks around ${destination}.`,
        type: "Sightseeing",
      },
      {
        name: `${destination} Old Town`,
        time: "11:30 AM – 1:30 PM",
        description: `Discover the historical and cultural side of ${destination}.`,
        type: "Culture",
      },
      {
        name: `${destination} Main Market`,
        time: "3:00 PM – 5:00 PM",
        description: `Explore local shops, markets and regional food.`,
        type: "Shopping",
      },
      {
        name: `${destination} Viewpoint`,
        time: "5:30 PM – 7:00 PM",
        description: `Enjoy the city's scenic views during the evening.`,
        type: "Scenic",
      },
      {
        name: `${destination} Famous Landmark`,
        time: "9:00 AM – 12:00 PM",
        description: `Visit one of the most popular attractions in ${destination}.`,
        type: "Landmark",
      },
      {
        name: `${destination} Local Food Street`,
        time: "6:00 PM – 8:00 PM",
        description: `Try popular local dishes and experience the evening atmosphere.`,
        type: "Food",
      },
    ],
    hotels: [
      {
        name: `City Centre Hotel`,
        area: "Central ${destination}",
        price: "Check current rates",
        rating: "Recommended",
      },
      {
        name: `Grand ${destination} Hotel`,
        area: "Main Tourist Area",
        price: "Check current rates",
        rating: "Recommended",
      },
      {
        name: `Budget Stay ${destination}`,
        area: "Near City Centre",
        price: "Budget friendly",
        rating: "Recommended",
      },
    ],
    foods: [
      "Local Breakfast",
      "Regional Speciality",
      "Popular Street Food",
      "Traditional Dinner",
    ],
  };
}

function formatDate(date) {
  if (!date) return "Date not set";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, difference);
}

function getDateForDay(startDate, dayNumber) {
  const date = new Date(startDate);

  date.setDate(date.getDate() + dayNumber - 1);

  return date;
}

function TripDetails({ tripId, id, trip: providedTrip, onBack }) {
  const [trip, setTrip] = useState(providedTrip || null);
  const [loading, setLoading] = useState(!providedTrip);
  const [error, setError] = useState("");

  const actualTripId =
    tripId ||
    id ||
    providedTrip?._id ||
    providedTrip?.id;

  useEffect(() => {
    if (providedTrip) {
      setTrip(providedTrip);
      setLoading(false);
      return;
    }

    if (!actualTripId) {
      setError("No trip selected.");
      setLoading(false);
      return;
    }

    loadTrip();
  }, [actualTripId, providedTrip]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const response = await API.get(
        `/trips/${actualTripId}`,
        config
      );

      setTrip(response.data);
    } catch (err) {
      console.error("Trip details error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load this trip."
      );
    } finally {
      setLoading(false);
    }
  };

  const plan = useMemo(() => {
    if (!trip) return null;

    const destination =
      trip.destination ||
      trip.location ||
      trip.city ||
      "Your Destination";

    const data = getDestinationData(destination);

    const days = getDays(
      trip.startDate,
      trip.endDate
    );

    const generatedDays = [];

    for (let i = 0; i < days; i++) {
      const date = getDateForDay(
        trip.startDate,
        i
      );

      const startIndex =
        (i * 3) % data.places.length;

      const selectedPlaces = [
        data.places[startIndex],
        data.places[
          (startIndex + 1) % data.places.length
        ],
        data.places[
          (startIndex + 2) % data.places.length
        ],
      ];

      generatedDays.push({
        day: i + 1,
        date,
        places: selectedPlaces,
      });
    }

    return {
      destination,
      data,
      days,
      generatedDays,
    };
  }, [trip]);

  if (loading) {
    return (
      <div className="trip-loading-page">
        <div className="trip-loading-card">
          <div className="loading-plane">✈️</div>
          <h2>Preparing your trip...</h2>
          <p>
            Building your day-by-day itinerary.
          </p>
        </div>
      </div>
    );
  }

  if (!trip || error) {
    return (
      <div className="trip-error-page">
        <div className="trip-error-card">
          <div className="error-icon">🗺️</div>

          <h1>Trip not found</h1>

          <p>
            {error || "No trip selected."}
          </p>

          <button
            className="back-dashboard-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const budget = Number(trip.budget || 0);

  const accommodationBudget =
    Math.round(budget * 0.35);

  const foodBudget =
    Math.round(budget * 0.20);

  const travelBudget =
    Math.round(budget * 0.20);

  const activitiesBudget =
    Math.round(budget * 0.20);

  const emergencyBudget =
    Math.round(budget * 0.05);

  return (
    <div className="trip-details-page">

      {/* ================= HEADER ================= */}

      <header className="trip-details-header">

        <button
          className="back-dashboard-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="trip-header-content">

          <span className="trip-overline">
            ✈️ TRAVELVERSE ITINERARY
          </span>

          <h1>
            {trip.title ||
              trip.name ||
              plan.destination}
          </h1>

          <p className="trip-destination">
            📍 {plan.destination}
          </p>

          <div className="trip-summary">

            <div>
              <span>📅 TRAVEL DATES</span>
              <strong>
                {formatDate(trip.startDate)}
                {" → "}
                {formatDate(trip.endDate)}
              </strong>
            </div>

            <div>
              <span>⏱️ DURATION</span>
              <strong>
                {plan.days}{" "}
                {plan.days === 1
                  ? "Day"
                  : "Days"}
              </strong>
            </div>

            <div>
              <span>💰 TOTAL BUDGET</span>
              <strong>
                ₹{budget.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>👥 TRAVELERS</span>
              <strong>
                {trip.travelers ||
                  trip.numberOfTravelers ||
                  1}
              </strong>
            </div>

          </div>

        </div>
      </header>


      {/* ================= ITINERARY ================= */}

      <main className="trip-main">

        <section className="section-heading">

          <span>
            🗺️ DAILY PLAN
          </span>

          <h2>
            Your Perfect Itinerary
          </h2>

          <p>
            A destination-specific travel plan
            created using your dates, destination
            and budget.
          </p>

        </section>


        <section className="daily-itinerary">

          {plan.generatedDays.map((day) => (

            <article
              className="day-card"
              key={day.day}
            >

              <div className="day-header">

                <div className="day-number">
                  DAY {day.day}
                </div>

                <h3>
                  {day.date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </h3>

              </div>


              <div className="places-list">

                {day.places.map(
                  (place, index) => (

                    <div
                      className="place-item"
                      key={`${place.name}-${index}`}
                    >

                      <div className="place-time">
                        {index === 0
                          ? "🌅"
                          : index === 1
                          ? "☀️"
                          : "🌆"}

                        <span>
                          {index === 0
                            ? "MORNING"
                            : index === 1
                            ? "AFTERNOON"
                            : "EVENING"}
                        </span>

                        <small>
                          {place.time}
                        </small>
                      </div>


                      <div className="place-content">

                        <div className="place-type">
                          {place.type}
                        </div>

                        <h4>
                          📍 {place.name}
                        </h4>

                        <p>
                          {place.description}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </article>

          ))}

        </section>


        {/* ================= HOTELS ================= */}

        <section className="hotels-section">

          <div className="section-heading">

            <span>
              🏨 ACCOMMODATION
            </span>

            <h2>
              Where You Can Stay
            </h2>

            <p>
              Suggested hotels and stays around
              popular tourist areas.
            </p>

          </div>


          <div className="hotel-grid">

            {plan.data.hotels.map(
              (hotel, index) => (

                <div
                  className="hotel-card"
                  key={hotel.name}
                >

                  <div className="hotel-image">
                    {index === 0
                      ? "🏨"
                      : index === 1
                      ? "🏩"
                      : "🛏️"}
                  </div>

                  <div className="hotel-content">

                    <span className="hotel-label">
                      {hotel.area}
                    </span>

                    <h3>
                      {hotel.name}
                    </h3>

                    <p>
                      📍 {hotel.area}
                    </p>

                    <p>
                      ⭐ {hotel.rating}
                    </p>

                    <strong>
                      💰 {hotel.price}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* ================= FOOD ================= */}

        <section className="food-section">

          <div className="section-heading">

            <span>
              🍽️ LOCAL FOOD
            </span>

            <h2>
              What You Should Try
            </h2>

            <p>
              Popular food experiences to include
              during your trip.
            </p>

          </div>


          <div className="food-grid">

            {plan.data.foods.map(
              (food, index) => (

                <div
                  className="food-card"
                  key={food}
                >
                  <span>
                    {["🍛", "🥘", "🍜", "🥐", "🍰"][
                      index % 5
                    ]}
                  </span>

                  <strong>
                    {food}
                  </strong>

                </div>

              )
            )}

          </div>

        </section>


        {/* ================= BUDGET ================= */}

        <section className="budget-section">

          <div className="section-heading">

            <span>
              💰 BUDGET MANAGEMENT
            </span>

            <h2>
              Suggested Budget Split
            </h2>

            <p>
              Your ₹
              {budget.toLocaleString("en-IN")}
              {" "}budget can be distributed like
              this.
            </p>

          </div>


          <div className="budget-grid">

            <div className="budget-card">
              <span>🏨</span>
              <p>Accommodation</p>
              <strong>
                ₹
                {accommodationBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>35%</small>
            </div>

            <div className="budget-card">
              <span>🍽️</span>
              <p>Food</p>
              <strong>
                ₹
                {foodBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>20%</small>
            </div>

            <div className="budget-card">
              <span>🚕</span>
              <p>Travel</p>
              <strong>
                ₹
                {travelBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>20%</small>
            </div>

            <div className="budget-card">
              <span>🎟️</span>
              <p>Activities</p>
              <strong>
                ₹
                {activitiesBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>20%</small>
            </div>

            <div className="budget-card">
              <span>🛡️</span>
              <p>Emergency</p>
              <strong>
                ₹
                {emergencyBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>5%</small>
            </div>

          </div>

        </section>


        {/* ================= TRAVEL TIPS ================= */}

        <section className="tips-section">

          <div className="section-heading">

            <span>
              💡 TRAVEL SMART
            </span>

            <h2>
              Trip Tips
            </h2>

          </div>

          <div className="tips-grid">

            <div>
              🎫
              <h3>
                Book Attractions Early
              </h3>
              <p>
                Reserve popular attractions in
                advance whenever possible.
              </p>
            </div>

            <div>
              🚕
              <h3>
                Plan Local Transport
              </h3>
              <p>
                Keep some budget available for
                taxis, public transport and local
                travel.
              </p>
            </div>

            <div>
              💳
              <h3>
                Keep Emergency Money
              </h3>
              <p>
                Avoid spending the entire budget
                on planned activities.
              </p>
            </div>

            <div>
              📱
              <h3>
                Keep Your Trip Offline
              </h3>
              <p>
                Save hotel details, tickets and
                important addresses on your phone.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="trip-footer">

        <div>
          ☁️
          <strong>
            TravelVerse
          </strong>
        </div>

        <p>
          Your journey, planned and stored in
          the cloud.
        </p>

      </footer>

    </div>
  );
}

export default TripDetails;