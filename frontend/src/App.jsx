import { useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";

function App() {
  const [page, setPage] = useState("home");
  const [selectedTrip, setSelectedTrip] = useState(null);

  // =========================
  // NAVIGATION
  // =========================

  const goDashboard = () => {
    setPage("dashboard");
  };

  const goHome = () => {
    setPage("home");
  };

  const createTrip = () => {
    setPage("createTrip");
  };

  const tripCreated = () => {
    setPage("dashboard");
  };

  const viewTrip = (trip) => {
    console.log("Selected trip:", trip);

    if (!trip) {
      return;
    }

    setSelectedTrip(trip);
    setPage("tripDetails");
  };

  // =====================================================
  // HOME PAGE
  // =====================================================

  if (page === "home") {
    return (
      <div className="home-page">

        {/* ================= NAVBAR ================= */}

        <nav className="navbar">

          <button
            className="start-planning-btn"
            onClick={goDashboard}
          >
            Start Planning →
          </button>

        </nav>


        {/* ================= HERO ================= */}

        <section className="hero">

          <div className="hero-content">

            <span className="hero-label">
              ✦ YOUR JOURNEY. YOUR CLOUD.
            </span>

            <h1>
              Plan your world,
              <br />
              <span>one journey</span>
              <br />
              at a time.
            </h1>

            <p>
              TravelVerse is your cloud-powered travel
              companion for planning trips, managing
              itineraries, tracking budgets and keeping
              your travel memories organized.
            </p>

            <div className="hero-actions">

              <button
                className="start-exploring-btn"
                onClick={goDashboard}
              >
                Start Exploring →
              </button>

              <button
                className="hero-secondary-btn"
                onClick={createTrip}
              >
                + Create a Trip
              </button>

            </div>


            <div className="hero-trust">

              <span>
                ☁️ Cloud Connected
              </span>

              <span>
                🗺️ Smart Planning
              </span>

              <span>
                🔒 Secure Data
              </span>

            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}

          <div className="hero-side">

            <div className="hero-image-card">

              <img
                src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
                alt="Travel destination"
              />

              <div className="hero-image-overlay">
                <span>TRAVELVERSE</span>

                <strong>
                  Your next adventure
                </strong>

                <small>
                  Planned. Organized. Cloud connected.
                </small>
              </div>

            </div>


            <div className="hero-floating-card">

              <span>
                ✈ UPCOMING JOURNEY
              </span>

              <strong>
                Discover Somewhere New
              </strong>

              <p>
                📍 Your next adventure awaits
              </p>

              <p>
                ☁ Data synced to cloud
              </p>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section className="features-section">

          <div className="features-heading">

            <span>
              EVERYTHING IN ONE PLACE
            </span>

            <h2>
              Travel planning,
              <br />
              made beautifully simple.
            </h2>

            <p>
              From your first idea to the final
              destination, TravelVerse keeps everything
              organized in one cloud-powered platform.
            </p>

          </div>


          <div className="features-grid">


            {/* FEATURE 1 */}

            <div className="feature-card">

              <div className="feature-icon">
                🗺️
              </div>

              <span className="feature-number">
                01
              </span>

              <h3>
                Smart Itineraries
              </h3>

              <p>
                Organize destinations, activities,
                schedules and daily plans in one place.
              </p>

              <div className="feature-arrow">
                →
              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="feature-card">

              <div className="feature-icon">
                💰
              </div>

              <span className="feature-number">
                02
              </span>

              <h3>
                Budget Tracking
              </h3>

              <p>
                Keep your travel expenses organized
                and your trip spending under control.
              </p>

              <div className="feature-arrow">
                →
              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="feature-card">

              <div className="feature-icon">
                ☁️
              </div>

              <span className="feature-number">
                03
              </span>

              <h3>
                Cloud Storage
              </h3>

              <p>
                Your travel data is stored securely
                using MongoDB Atlas cloud infrastructure.
              </p>

              <div className="feature-arrow">
                →
              </div>

            </div>


            {/* FEATURE 4 */}

            <div className="feature-card">

              <div className="feature-icon">
                🌤️
              </div>

              <span className="feature-number">
                04
              </span>

              <h3>
                Live Travel Info
              </h3>

              <p>
                Get useful weather information and
                destination details while planning.
              </p>

              <div className="feature-arrow">
                →
              </div>

            </div>

          </div>

        </section>


        {/* ================= CLOUD SECTION ================= */}

        <section className="cloud-section">

          <div className="cloud-section-inner">

            <div className="cloud-icon-large">
              ☁️
            </div>

            <div>

              <span>
                BUILT FOR THE CLOUD
              </span>

              <h2>
                Your journeys,
                <br />
                available whenever you need them.
              </h2>

              <p>
                TravelVerse connects your frontend,
                REST API and MongoDB Atlas database to
                create a cloud-powered travel experience.
              </p>

            </div>

            <div className="cloud-points">

              <div>
                <strong>01</strong>
                <span>REST API</span>
              </div>

              <div>
                <strong>02</strong>
                <span>MongoDB Atlas</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Cloud Hosting</span>
              </div>

            </div>

          </div>

        </section>


        {/* ================= FINAL CTA ================= */}

        <section className="home-cta">

          <div className="home-cta-card">

            <div>

              <span>
                READY TO GO?
              </span>

              <h2>
                Your next journey
                <br />
                starts here.
              </h2>

              <p>
                Create your first trip and start
                building your personalized itinerary.
              </p>

            </div>

            <button
              className="cta-button"
              onClick={createTrip}
            >
              Create My Trip →
            </button>

          </div>

        </section>


        {/* ================= FOOTER ================= */}

        <footer className="home-footer">

          <div className="footer-logo">
            ✈️ TravelVerse
          </div>

          <p>
            Your journey, planned and stored in the cloud.
          </p>

          <span>
            © 2026 TravelVerse
          </span>

        </footer>

      </div>
    );
  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  if (page === "dashboard") {
    return (
      <Dashboard
        onBack={goHome}
        onCreateTrip={createTrip}
        onViewTrip={viewTrip}
      />
    );
  }


  // =====================================================
  // CREATE TRIP
  // =====================================================

  if (page === "createTrip") {
    return (
      <CreateTrip
        onBack={goDashboard}
        onTripCreated={tripCreated}
        onCreated={tripCreated}
      />
    );
  }


  // =====================================================
  // TRIP DETAILS
  // =====================================================

  if (page === "tripDetails") {
    return (
      <TripDetails
        trip={selectedTrip}
        onBack={goDashboard}
      />
    );
  }


  return null;
}

export default App;