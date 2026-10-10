import React, { useEffect, useState } from "react";
import API from "../services/api";

function Places({ destination }) {
  const [category, setCategory] = useState("attractions");
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!destination) return;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        setError("");
        setPlaces([]);

        const response = await API.get(
          `/places?destination=${encodeURIComponent(
            destination
          )}&category=${category}`
        );

        setPlaces(response.data.places || []);
        setLocation(response.data.destination || null);
      } catch (err) {
        console.error("Places error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load nearby places."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [destination, category]);

  const getIcon = () => {
    if (category === "restaurants") return "🍽️";
    if (category === "hotels") return "🏨";
    return "🏛️";
  };

  const formatDistance = (distance) => {
    if (!distance) return "";

    if (distance < 1000) {
      return `${Math.round(distance)} m away`;
    }

    return `${(distance / 1000).toFixed(1)} km away`;
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "30px",
        boxShadow:
          "0 5px 20px rgba(60, 40, 100, 0.08)",
        border: "1px solid #e7def5",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "#3b2468",
            margin: 0,
          }}
        >
          📍 Explore {destination}
        </h2>

        {location && (
          <p
            style={{
              color: "#777",
              fontSize: "13px",
              marginTop: "6px",
            }}
          >
            Real places near your destination
          </p>
        )}
      </div>

      {/* CATEGORY BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setCategory("attractions")}
          style={buttonStyle(
            category === "attractions"
          )}
        >
          🏛️ Attractions
        </button>

        <button
          onClick={() => setCategory("restaurants")}
          style={buttonStyle(
            category === "restaurants"
          )}
        >
          🍽️ Restaurants
        </button>

        <button
          onClick={() => setCategory("hotels")}
          style={buttonStyle(
            category === "hotels"
          )}
        >
          🏨 Hotels
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <div
          style={{
            padding: "25px 0",
            textAlign: "center",
            color: "#6845a8",
          }}
        >
          <div style={{ fontSize: "28px" }}>🌍</div>

          <p>
            Finding real places near {destination}...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div
          style={{
            background: "#fff3f3",
            color: "#d6334c",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* NO RESULTS */}

      {!loading &&
        !error &&
        places.length === 0 && (
          <div
            style={{
              padding: "25px",
              textAlign: "center",
              color: "#777",
            }}
          >
            No places found for this category.
          </div>
        )}

      {/* PLACES */}

      {!loading && !error && places.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {places.map((place) => (
            <div
              key={place.id}
              style={{
                border: "1px solid #e7def5",
                borderRadius: "12px",
                padding: "18px",
                background: "#faf8fd",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                {getIcon()}
              </div>

              <h3
                style={{
                  color: "#3b2468",
                  margin: "0 0 8px",
                  fontSize: "17px",
                }}
              >
                {place.name}
              </h3>

              <p
                style={{
                  color: "#777",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: "0 0 8px",
                }}
              >
                📍 {place.address}
              </p>

              {place.distance && (
                <p
                  style={{
                    color: "#6845a8",
                    fontSize: "13px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  📏 {formatDistance(place.distance)}
                </p>
              )}

              {place.latitude &&
                place.longitude && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      color: "#6845a8",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    🗺️ Open in Maps →
                  </a>
                )}
            </div>
          ))}
        </div>
      )}

      {/* SOURCE */}

      {!loading &&
        !error &&
        places.length > 0 && (
          <p
            style={{
              marginTop: "18px",
              marginBottom: 0,
              color: "#999",
              fontSize: "11px",
            }}
          >
            Real place data provided by Geoapify
          </p>
        )}
    </div>
  );
}

const buttonStyle = (active) => ({
  border: active
    ? "1px solid #6845a8"
    : "1px solid #ddd2ed",
  background: active ? "#6845a8" : "#faf8fd",
  color: active ? "white" : "#4b3575",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
});

export default Places;