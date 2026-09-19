import { useState } from "react";
import API from "../services/api";

function CreateTrip({ onBack, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endDate < formData.startDate) {
      setMessage("End date cannot be before start date.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/trips", {
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: Number(formData.budget || 0),
        description: formData.description,
      });

      console.log("Created trip:", response.data);

      setMessage("Trip created successfully! 🎉");

      setTimeout(() => {
        if (onCreated) {
          onCreated(response.data.trip);
        }
      }, 700);

    } catch (error) {
      console.error("Create trip error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to create trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">

      {/* BACK */}

      <button
        className="auth-back"
        onClick={onBack}
        type="button"
      >
        ← Back to Dashboard
      </button>


      <div className="create-trip-card">

        {/* HEADER */}

        <div className="create-trip-header">

          <div className="create-trip-icon">
            ✈️
          </div>

          <div>

            <span className="mini-label">
              ☁ CLOUD TRIP PLANNER
            </span>

            <h1>
              Create a New Trip
            </h1>

            <p>
              Plan your next adventure and save it
              securely in the cloud.
            </p>

          </div>

        </div>


        {/* FORM */}

        <form
          className="trip-form"
          onSubmit={handleSubmit}
        >

          {/* TRIP NAME */}

          <div className="form-group">

            <label>
              Trip Name
            </label>

            <input
              type="text"
              name="title"
              placeholder="Eg. European Adventure"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESTINATION */}

          <div className="form-group">

            <label>
              Destination
            </label>

            <input
              type="text"
              name="destination"
              placeholder="Eg. Paris, France"
              value={formData.destination}
              onChange={handleChange}
              required
            />

          </div>


          {/* DATES */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* BUDGET */}

          <div className="form-group">

            <label>
              Estimated Budget
            </label>

            <div className="input-with-symbol">

              <span>
                ₹
              </span>

              <input
                type="number"
                name="budget"
                placeholder="50000"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Trip Description
            </label>

            <textarea
              name="description"
              placeholder="Tell us about your trip..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* MESSAGE */}

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}


          {/* ACTIONS */}

          <div className="trip-form-actions">

            <button
              type="button"
              className="cancel-trip-btn"
              onClick={onBack}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-trip-submit"
              disabled={loading}
            >
              {loading
                ? "Saving Trip..."
                : "Create Trip ✈️"}
            </button>

          </div>

        </form>


        {/* CLOUD INFO */}

        <div className="trip-cloud-note">

          <span>
            ☁️
          </span>

          <div>

            <strong>
              Cloud Storage Enabled
            </strong>

            <p>
              Your trip is stored in MongoDB Atlas
              through the TravelVerse REST API.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateTrip;