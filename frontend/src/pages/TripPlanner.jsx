import { useEffect, useState } from "react";
import API from "../services/api";

function TripPlanner({ tripId, onBack }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [activity, setActivity] = useState({
    date: "",
    time: "",
    title: "",
    location: "",
    description: "",
  });

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "Other",
  });

  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    checkIn: "",
    checkOut: "",
  });

  const loadTrip = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!tripId) {
        setMessage("No trip selected.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(
          "Please sign in before opening a saved trip."
        );
        return;
      }

      console.log("Loading trip ID:", tripId);

      const response = await API.get(
        `/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Trip loaded:", response.data);

      setTrip(response.data);

      if (response.data.hotel) {
        setHotel({
          name: response.data.hotel.name || "",
          location: response.data.hotel.location || "",
          checkIn: response.data.hotel.checkIn
            ? response.data.hotel.checkIn.substring(0, 10)
            : "",
          checkOut: response.data.hotel.checkOut
            ? response.data.hotel.checkOut.substring(0, 10)
            : "",
        });
      }

    } catch (error) {
      console.error(
        "Load trip error:",
        error.response?.data || error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to load this trip."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTrip();
  }, [tripId]);


  const addActivity = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/trips/${tripId}/itinerary`,
        activity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivity({
        date: "",
        time: "",
        title: "",
        location: "",
        description: "",
      });

      setMessage("Activity added successfully! 🎉");

      await loadTrip();

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Unable to add activity."
      );
    }
  };


  const addExpense = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/trips/${tripId}/expenses`,
        {
          ...expense,
          amount: Number(expense.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpense({
        title: "",
        amount: "",
        category: "Other",
      });

      setMessage("Expense added successfully! 💰");

      await loadTrip();

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Unable to add expense."
      );
    }
  };


  const saveHotel = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/trips/${tripId}`,
        {
          hotel: {
            name: hotel.name,
            location: hotel.location,
            checkIn: hotel.checkIn,
            checkOut: hotel.checkOut,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Hotel saved successfully! 🏨");

      await loadTrip();

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Unable to save hotel."
      );
    }
  };


  if (loading) {
    return (
      <div className="dashboard-loading">

        <div className="loading-icon">
          ✈️
        </div>

        <h2>
          Loading Trip...
        </h2>

        <p>
          Getting your travel plan from the cloud ☁️
        </p>

      </div>
    );
  }


  if (!trip) {
    return (
      <div className="dashboard-loading">

        <h2>
          Trip not found
        </h2>

        <p>
          {message || "Unable to load the selected trip."}
        </p>

        <button
          className="create-trip-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>
    );
  }


  const totalExpenses = (trip.expenses || []).reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );


  return (
    <div className="trip-planner-page">

      {/* HEADER */}

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

        <button
          className="home-dashboard-btn"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </nav>


      {/* TRIP HEADER */}

      <section className="trip-planner-header">

        <span className="mini-label">
          ☁️ YOUR TRAVEL CLOUD
        </span>

        <h1>
          {trip.title || trip.name || trip.destination}
        </h1>

        <p>
          📍 {trip.destination}
        </p>

        <p>
          📅{" "}
          {new Date(trip.startDate).toLocaleDateString(
            "en-IN"
          )}
          {" → "}
          {new Date(trip.endDate).toLocaleDateString(
            "en-IN"
          )}
        </p>

        {trip.description && (
          <p>
            {trip.description}
          </p>
        )}

      </section>


      {/* MESSAGE */}

      {message && (
        <div className="auth-message">
          {message}
        </div>
      )}


      {/* SUMMARY */}

      <section className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            📅
          </div>

          <div>
            <span>
              Activities
            </span>

            <strong>
              {(trip.itinerary || []).length}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            💰
          </div>

          <div>
            <span>
              Trip Budget
            </span>

            <strong>
              ₹{trip.budget || 0}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            💳
          </div>

          <div>
            <span>
              Expenses
            </span>

            <strong>
              ₹{totalExpenses}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🏨
          </div>

          <div>
            <span>
              Hotel
            </span>

            <strong>
              {trip.hotel?.name
                ? "Added"
                : "Not Added"}
            </strong>
          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <div className="trip-planner-grid">


        {/* ITINERARY */}

        <section className="planner-card">

          <h2>
            🗺️ Itinerary
          </h2>

          <p>
            Plan your activities day by day.
          </p>


          <form onSubmit={addActivity}>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={activity.date}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      date: e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={activity.time}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      time: e.target.value,
                    })
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Activity
              </label>

              <input
                type="text"
                placeholder="Eg. Visit Eiffel Tower"
                value={activity.title}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    title: e.target.value,
                  })
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                placeholder="Eg. Eiffel Tower"
                value={activity.location}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    location: e.target.value,
                  })
                }
              />

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                rows="3"
                placeholder="What are you planning?"
                value={activity.description}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    description: e.target.value,
                  })
                }
              />

            </div>


            <button
              type="submit"
              className="create-trip-submit"
            >
              + Add Activity
            </button>

          </form>


          {/* EXISTING ACTIVITIES */}

          {(trip.itinerary || []).length > 0 && (

            <div className="planner-list">

              <h3>
                Planned Activities
              </h3>

              {trip.itinerary.map(
                (item, index) => (

                  <div
                    className="planner-list-item"
                    key={item._id || index}
                  >

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      📅{" "}
                      {item.date
                        ? new Date(
                            item.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : ""}
                    </span>

                    {item.time && (
                      <span>
                        ⏰ {item.time}
                      </span>
                    )}

                    {item.location && (
                      <span>
                        📍 {item.location}
                      </span>
                    )}

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* HOTEL */}

        <section className="planner-card">

          <h2>
            🏨 Hotel
          </h2>

          <p>
            Add your accommodation details.
          </p>


          <form onSubmit={saveHotel}>

            <div className="form-group">

              <label>
                Hotel Name
              </label>

              <input
                type="text"
                placeholder="Eg. Hilton Paris"
                value={hotel.name}
                onChange={(e) =>
                  setHotel({
                    ...hotel,
                    name: e.target.value,
                  })
                }
              />

            </div>


            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                placeholder="Eg. Paris, France"
                value={hotel.location}
                onChange={(e) =>
                  setHotel({
                    ...hotel,
                    location: e.target.value,
                  })
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Check-in
                </label>

                <input
                  type="date"
                  value={hotel.checkIn}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      checkIn: e.target.value,
                    })
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Check-out
                </label>

                <input
                  type="date"
                  value={hotel.checkOut}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      checkOut: e.target.value,
                    })
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              className="create-trip-submit"
            >
              Save Hotel 🏨
            </button>

          </form>


          {trip.hotel?.name && (

            <div className="saved-hotel">

              <h3>
                Current Hotel
              </h3>

              <strong>
                {trip.hotel.name}
              </strong>

              <p>
                📍 {trip.hotel.location}
              </p>

            </div>

          )}

        </section>


        {/* EXPENSES */}

        <section className="planner-card">

          <h2>
            💰 Expenses
          </h2>

          <p>
            Track your travel spending.
          </p>


          <form onSubmit={addExpense}>

            <div className="form-group">

              <label>
                Expense
              </label>

              <input
                type="text"
                placeholder="Eg. Hotel booking"
                value={expense.title}
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    title: e.target.value,
                  })
                }
                required
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={expense.amount}
                  onChange={(e) =>
                    setExpense({
                      ...expense,
                      amount: e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={expense.category}
                  onChange={(e) =>
                    setExpense({
                      ...expense,
                      category: e.target.value,
                    })
                  }
                >

                  <option>
                    Other
                  </option>

                  <option>
                    Hotel
                  </option>

                  <option>
                    Food
                  </option>

                  <option>
                    Transport
                  </option>

                  <option>
                    Activities
                  </option>

                  <option>
                    Shopping
                  </option>

                </select>

              </div>

            </div>


            <button
              type="submit"
              className="create-trip-submit"
            >
              + Add Expense
            </button>

          </form>


          {(trip.expenses || []).length > 0 && (

            <div className="planner-list">

              <h3>
                Expenses
              </h3>

              {trip.expenses.map(
                (item, index) => (

                  <div
                    className="planner-list-item"
                    key={item._id || index}
                  >

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      💰 ₹{item.amount}
                    </span>

                    <span>
                      {item.category}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>


      {/* CLOUD STATUS */}

      <section className="dashboard-cloud">

        <div className="cloud-info-icon">
          ☁️
        </div>

        <div>

          <h3>
            Trip connected to the cloud
          </h3>

          <p>
            Your itinerary, hotel and expense
            information is stored in MongoDB Atlas
            through the TravelVerse REST API.
          </p>

        </div>

        <div className="cloud-status">
          ● Cloud Connected
        </div>

      </section>

    </div>
  );
}

export default TripPlanner;