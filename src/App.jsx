import { useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";

function App() {
  const [page, setPage] = useState("home");
  const [selectedTrip, setSelectedTrip] = useState(null);

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

  // Dashboard gives us the COMPLETE trip object
  const viewTrip = (trip) => {
    console.log("Selected trip:", trip);

    if (!trip) {
      return;
    }

    setSelectedTrip(trip);
    setPage("tripDetails");
  };

  // =========================
  // HOME
  // =========================

  if (page === "home") {
    return (
      <div className="home-page">

        <nav className="navbar">

          <div className="logo">
            <div className="logo-icon">✈</div>

            <div>
              <h2>TravelVerse</h2>
              <span>CLOUD TRAVEL PLATFORM</span>
            </div>
          </div>

          <button
            className="guest-btn"
            onClick={goDashboard}
          >
            Start Planning →
          </button>

        </nav>


        <main className="hero-section">

          <div className="hero-content">

            <span className="hero-label">
              ☁️ YOUR JOURNEY. YOUR CLOUD.
            </span>

            <h1>
              Plan your world,
              <br />
              <span>one journey at a time.</span>
            </h1>

            <p>
              TravelVerse is your cloud-powered travel
              companion for planning trips, managing
              itineraries, tracking budgets and organizing
              your travel memories.
            </p>

            <button
              className="primary-btn"
              onClick={goDashboard}
            >
              Start Exploring →
            </button>

            <div className="cloud-features">

              <div>
                ☁️ <span>Cloud Connected</span>
              </div>

              <div>
                🗺️ <span>Smart Planning</span>
              </div>

              <div>
                🔒 <span>Secure Data</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="travel-card">

              <div className="travel-card-image">
                🌴
              </div>

              <div className="travel-card-content">

                <span>UPCOMING JOURNEY</span>

                <h3>
                  Discover Somewhere New
                </h3>

                <p>
                  📍 Your next adventure awaits
                </p>

                <div className="mini-cloud">
                  ☁️ Data synced to cloud
                </div>

              </div>

            </div>

          </div>

        </main>


        <section className="home-features">

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Smart Itineraries</h3>
            <p>
              Organize destinations, activities
              and schedules in one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Budget Tracking</h3>
            <p>
              Keep your travel expenses organized
              and under control.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Cloud Storage</h3>
            <p>
              Your travel data is stored securely
              in MongoDB Atlas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌦️</div>
            <h3>Live Travel Info</h3>
            <p>
              Get useful information about your
              destination while planning.
            </p>
          </div>

        </section>


        <footer className="home-footer">
          <p>
            TravelVerse • Cloud-powered travel planning
          </p>
        </footer>

      </div>
    );
  }


  // =========================
  // DASHBOARD
  // =========================

  if (page === "dashboard") {
    return (
      <Dashboard
        onBack={goHome}
        onCreateTrip={createTrip}
        onViewTrip={viewTrip}
      />
    );
  }


  // =========================
  // CREATE TRIP
  // =========================

  if (page === "createTrip") {
    return (
      <CreateTrip
        onBack={goDashboard}
        onTripCreated={tripCreated}
        onCreated={tripCreated}
      />
    );
  }


  // =========================
  // TRIP DETAILS
  // =========================

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