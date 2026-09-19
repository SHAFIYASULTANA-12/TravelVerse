import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard({
  onBack,
  onCreateTrip,
  onViewTrip,
}) {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      // Load user if logged in
      if (token) {
        try {
          const userResponse = await API.get("/auth/me", {
            headers,
          });

          setUser(userResponse.data);
        } catch (error) {
          console.log("User information unavailable");
        }
      }

      // Load trips
      const tripsResponse = await API.get("/trips", {
        headers,
      });

      setTrips(
        Array.isArray(tripsResponse.data)
          ? tripsResponse.data
          : []
      );
    } catch (error) {
      console.error("Dashboard error:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOGOUT
  // ================================

  const logout = () => {
    localStorage.removeItem("token");
    onBack();
  };

  // ================================
  // DELETE TRIP
  // ================================

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?\n\nThis action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(tripId);

      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      await API.delete(`/trips/${tripId}`, {
        headers,
      });

      // Remove deleted trip immediately from UI
      setTrips((currentTrips) =>
        currentTrips.filter(
          (trip) => trip._id !== tripId
        )
      );

      alert("Trip deleted successfully!");
    } catch (error) {
      console.error("Delete trip error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete trip. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================================
  // STATISTICS
  // ================================

  const upcomingTrips = trips.filter((trip) => {
    if (!trip.startDate) return false;

    return new Date(trip.startDate) >= new Date();
  });

  const destinations = new Set(
    trips
      .map((trip) => trip.destination)
      .filter(Boolean)
  );

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-icon">
          ✈️
        </div>

        <h2>
          Loading TravelVerse...
        </h2>

        <p>
          Getting your journeys from the cloud ☁️
        </p>
      </div>
    );
  }

  // ================================
  // DASHBOARD
  // ================================

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">

        <div className="logo">

          <div className="logo-icon">
            ✈
          </div>

          <div>
            <h2>
              TravelVerse
            </h2>

            <span>
              CLOUD TRAVEL PLATFORM
            </span>
          </div>

        </div>

        <div className="dashboard-actions">

          <button
            className="home-dashboard-btn"
            onClick={onBack}
          >
            Home
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="dashboard-header">

        <div>

          <span className="mini-label">
            ☁ YOUR TRAVEL CLOUD
          </span>

          <h1>
            Welcome back
            {user?.name
              ? `, ${user.name}`
              : ""}!
            👋
          </h1>

          <p>
            Manage your journeys, plans and
            travel memories from one place.
          </p>

        </div>

        <button
          className="create-trip-btn"
          onClick={onCreateTrip}
        >
          + Create New Trip
        </button>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            ✈️
          </div>

          <div>
            <span>
              Total Trips
            </span>

            <strong>
              {trips.length}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            📅
          </div>

          <div>
            <span>
              Upcoming Trips
            </span>

            <strong>
              {upcomingTrips.length}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🌍
          </div>

          <div>
            <span>
              Destinations
            </span>

            <strong>
              {destinations.size}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            ☁️
          </div>

          <div>
            <span>
              Cloud Storage
            </span>

            <strong>
              Active
            </strong>
          </div>

        </div>

      </section>


      {/* ================= TRIPS ================= */}

      <section className="trips-section">

        <div className="trips-heading">

          <div>

            <h2>
              My Trips
            </h2>

            <p>
              Your journeys stored securely in
              the cloud.
            </p>

          </div>

          <span className="trip-count">
            {trips.length}{" "}
            {trips.length === 1
              ? "trip"
              : "trips"}
          </span>

        </div>


        {/* ================= NO TRIPS ================= */}

        {trips.length === 0 ? (

          <div className="empty-trips">

            <div className="empty-icon">
              🗺️
            </div>

            <h3>
              No trips yet
            </h3>

            <p>
              Start planning your first
              adventure.
            </p>

            <button
              className="create-trip-btn"
              onClick={onCreateTrip}
            >
              + Create Your First Trip
            </button>

          </div>

        ) : (

          /* ================= TRIP GRID ================= */

          <div className="trip-grid">

            {trips.map((trip) => (

              <div
                className="trip-card"
                key={trip._id}
              >

                {/* IMAGE */}

                <div className="trip-image">

                  <img
                    src={
                      trip.image ||
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={
                      trip.destination ||
                      "Travel destination"
                    }
                  />

                  <span>
                    {trip.status ||
                      "Planned"}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="trip-content">

                  <h3>
                    {trip.title ||
                      trip.name ||
                      trip.destination ||
                      "My Trip"}
                  </h3>

                  <p>
                    📍 {trip.destination}
                  </p>


                  {/* DATE */}

                  <div className="trip-date">

                    📅{" "}

                    {trip.startDate
                      ? new Date(
                          trip.startDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date not set"}

                    {" → "}

                    {trip.endDate
                      ? new Date(
                          trip.endDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date not set"}

                  </div>


                  {/* BUDGET */}

                  <div className="trip-budget">
                    💰 ₹
                    {Number(
                      trip.budget || 0
                    ).toLocaleString("en-IN")}
                  </div>


                  {/* BUTTONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >

                    <button
                      className="view-trip-btn"
                      onClick={() => {
                        if (onViewTrip) {
                          onViewTrip(trip);
                        }
                      }}
                    >
                      View Trip →
                    </button>


                    <button
                      onClick={() =>
                        handleDeleteTrip(
                          trip._id
                        )
                      }
                      disabled={
                        deletingId === trip._id
                      }
                      style={{
                        background:
                          deletingId === trip._id
                            ? "#aaa"
                            : "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding:
                          "10px 14px",
                        cursor:
                          deletingId ===
                          trip._id
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: "600",
                      }}
                    >
                      {deletingId ===
                      trip._id
                        ? "Deleting..."
                        : "🗑 Delete"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================= CLOUD INFO ================= */}

      <section className="dashboard-cloud">

        <div className="cloud-info-icon">
          ☁️
        </div>

        <div>

          <h3>
            Your travel data is
            cloud-connected
          </h3>

          <p>
            Trips are retrieved through
            the TravelVerse REST API and
            stored in MongoDB Atlas.
          </p>

        </div>

        <div className="cloud-status">
          ● Cloud Connected
        </div>

      </section>

    </div>
  );
}

export default Dashboard;