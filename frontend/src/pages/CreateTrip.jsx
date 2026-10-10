import { useState } from "react";
import API from "../services/api";

function CreateTrip({ onBack, onCreated, onTripCreated }) {
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
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (formData.endDate < formData.startDate) {
      setMessage("End date cannot be before start date.");
      setMessageType("error");
      return;
    }

    if (Number(formData.budget) < 0) {
      setMessage("Budget cannot be negative.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await API.post("/trips", {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: Number(formData.budget || 0),
        description: formData.description.trim(),
      });

      const createdTrip = response.data?.trip || response.data;
      setMessage("Trip created successfully! 🎉");
      setMessageType("success");

      window.setTimeout(() => {
        if (typeof onCreated === "function") onCreated(createdTrip);
        else if (typeof onTripCreated === "function") onTripCreated(createdTrip);
      }, 500);
    } catch (error) {
      console.error("Create trip error:", error);
      setMessage(
        error.response?.data?.message ||
          "Unable to create trip. Please check your connection and try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-trip-page">
      <div className="create-trip-topbar">
        <button
          type="button"
          className="create-trip-back"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to Dashboard
        </button>
      </div>

      <section className="create-trip-container">
        <header className="create-trip-header">
          <div className="create-trip-icon" aria-hidden="true">✈️</div>
          <span className="mini-label">☁ CLOUD TRIP PLANNER</span>
          <h1>Create a New Trip</h1>
          <p>Plan your next adventure and save it securely in the cloud.</p>
        </header>

        <form className="create-trip-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="trip-title">Trip Name</label>
            <input
              id="trip-title"
              type="text"
              name="title"
              placeholder="e.g. European Adventure"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="trip-destination">Destination</label>
            <input
              id="trip-destination"
              type="text"
              name="destination"
              placeholder="e.g. Paris, France"
              value={formData.destination}
              onChange={handleChange}
              maxLength={150}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="trip-start-date">Start Date</label>
              <input
                id="trip-start-date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                max={formData.endDate || undefined}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="trip-end-date">End Date</label>
              <input
                id="trip-end-date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || undefined}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="trip-budget">Estimated Budget (INR)</label>
            <div className="input-with-symbol">
              <span aria-hidden="true">₹</span>
              <input
                id="trip-budget"
                type="number"
                name="budget"
                placeholder="50000"
                min="0"
                step="1"
                value={formData.budget}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="trip-description">
              Trip Description <span className="optional-label">(optional)</span>
            </label>
            <textarea
              id="trip-description"
              name="description"
              placeholder="Tell us about your plans, activities, and places to visit..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`create-trip-message ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

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
              {loading ? "Saving Trip..." : "Create Trip ✈️"}
            </button>
          </div>
        </form>

        <aside className="trip-cloud-note">
          <span aria-hidden="true">☁️</span>
          <div>
            <strong>Cloud Storage Enabled</strong>
            <p>Your trip is sent to the TravelVerse REST API for storage.</p>
          </div>
        </aside>
      </section>

      <style>{`
        .create-trip-page {
          box-sizing: border-box;
          min-height: 100vh;
          padding: 28px clamp(18px, 4vw, 64px) 48px;
          color: #f2f4ff;
          background:
            radial-gradient(circle at 85% 5%, rgba(125,103,235,.13), transparent 28%),
            #090d19;
        }
        .create-trip-topbar { max-width: 1120px; margin: 0 auto 22px; }
        .create-trip-back {
          padding: 10px 14px;
          border: 1px solid rgba(153,169,211,.2);
          border-radius: 9px;
          background: #151d30;
          color: #e8e6ff;
          font-size: 13px;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .create-trip-back:hover { background: #202944; border-color: #8e7aff; }
        .create-trip-back:disabled { opacity: .6; cursor: not-allowed; }
        .create-trip-container {
          box-sizing: border-box;
          width: min(1120px, 100%);
          margin: 0 auto;
          padding: clamp(22px, 4vw, 42px);
          border: 1px solid rgba(153,169,211,.16);
          border-radius: 22px;
          background: linear-gradient(145deg, #121a2b, #0f1625);
          box-shadow: 0 22px 60px rgba(0,0,0,.25);
        }
        .create-trip-header { margin-bottom: 28px; }
        .create-trip-icon { margin-bottom: 13px; font-size: 28px; }
        .create-trip-header .mini-label {
          display: inline-block;
          margin-bottom: 12px;
          color: #a99bff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }
        .create-trip-header h1 {
          margin: 0;
          color: #f2f3ff;
          font-size: clamp(28px, 4vw, 38px);
          line-height: 1.2;
        }
        .create-trip-header p { margin: 12px 0 0; color: #929db8; font-size: 14px; line-height: 1.6; }
        .create-trip-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        .create-trip-form .form-group { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        .create-trip-form label { color: #d9d8f5; font-size: 12px; font-weight: 700; }
        .create-trip-form input,
        .create-trip-form textarea,
        .create-trip-form select {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          padding: 13px 14px;
          border: 1px solid #303a55;
          border-radius: 10px;
          outline: none;
          background: #0c1322;
          color: #edf0ff;
          font: inherit;
          font-size: 13px;
          color-scheme: dark;
          transition: border-color .2s, box-shadow .2s;
        }
        .create-trip-form input::placeholder,
        .create-trip-form textarea::placeholder { color: #77839f; }
        .create-trip-form input:focus,
        .create-trip-form textarea:focus,
        .create-trip-form select:focus {
          border-color: #9180ff;
          box-shadow: 0 0 0 3px rgba(145,128,255,.14);
        }
        .create-trip-form input:disabled,
        .create-trip-form textarea:disabled { opacity: .7; cursor: not-allowed; }
        .create-trip-form .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .create-trip-form .input-with-symbol { position: relative; }
        .create-trip-form .input-with-symbol > span {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          color: #b8adff;
          font-size: 14px;
          pointer-events: none;
        }
        .create-trip-form .input-with-symbol input { padding-left: 34px; }
        .create-trip-form textarea { min-height: 125px; resize: vertical; }
        .create-trip-form .optional-label { color: #8995b0; font-weight: 400; }
        .trip-form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          grid-column: 1 / -1;
          padding-top: 4px;
        }
        .cancel-trip-btn, .create-trip-submit {
          min-height: 43px;
          padding: 0 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: transform .2s, filter .2s, background .2s;
        }
        .cancel-trip-btn {
          border: 1px solid #38435f;
          background: #171f33;
          color: #d7dcef;
        }
        .cancel-trip-btn:hover { background: #222c45; }
        .create-trip-submit {
          border: 1px solid rgba(185,170,255,.2);
          background: linear-gradient(135deg, #8e7aff, #6653cf);
          color: white;
          box-shadow: 0 8px 22px rgba(102,83,207,.2);
        }
        .create-trip-submit:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .cancel-trip-btn:disabled, .create-trip-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .create-trip-message {
          grid-column: 1 / -1;
          padding: 12px 14px;
          border: 1px solid;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
        }
        .create-trip-message.success { color: #7be1bc; background: rgba(56,173,133,.09); border-color: rgba(92,212,175,.25); }
        .create-trip-message.error { color: #ff9bad; background: rgba(238,112,139,.08); border-color: rgba(238,112,139,.25); }
        .trip-cloud-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 27px;
          padding-top: 20px;
          border-top: 1px solid rgba(153,169,211,.14);
        }
        .trip-cloud-note > span { font-size: 21px; }
        .trip-cloud-note strong { color: #e7eaff; font-size: 13px; }
        .trip-cloud-note p { margin: 5px 0 0; color: #929db8; font-size: 12px; line-height: 1.6; }
        @media (max-width: 650px) {
          .create-trip-page { padding: 18px 13px 30px; }
          .create-trip-container { padding: 21px 16px; border-radius: 16px; }
          .create-trip-form { grid-template-columns: 1fr; gap: 17px; }
          .create-trip-form .form-row { grid-template-columns: 1fr; }
          .trip-form-actions { flex-direction: column-reverse; align-items: stretch; }
          .cancel-trip-btn, .create-trip-submit { width: 100%; }
        }
      `}</style>
    </main>
  );
}

export default CreateTrip;
