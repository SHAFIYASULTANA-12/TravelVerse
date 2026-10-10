import React, { useEffect, useState } from "react";

function Weather({ destination }) {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!destination?.trim()) {
      setLoading(false);
      setWeather(null);
      setLocation(null);
      setError("Add a destination to see its weather.");
      return;
    }

    const controller = new AbortController();

    const getWeather = async () => {
      try {
        setLoading(true);
        setError("");
        setWeather(null);

        const locationResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            destination
          )}&count=1&language=en&format=json`,
          { signal: controller.signal }
        );

        if (!locationResponse.ok) {
          throw new Error("Unable to find destination.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results?.length) {
          throw new Error(`Could not find weather location for ${destination}.`);
        }

        const place = locationData.results[0];
        setLocation(place);

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`,
          { signal: controller.signal }
        );

        if (!weatherResponse.ok) {
          throw new Error("Unable to fetch weather.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
          throw new Error("Weather data is currently unavailable.");
        }

        setWeather(weatherData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Weather API Error:", err);
          setError(err.message || "Unable to load weather.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getWeather();
    return () => controller.abort();
  }, [destination]);

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55].includes(code)) return "Drizzle";
    if ([61, 63, 65].includes(code)) return "Rain";
    if ([71, 73, 75].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Unknown";
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2].includes(code)) return "🌤️";
    if (code === 3) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌤️";
  };

  if (loading) {
    return (
      <div className="tv-weather-card" aria-live="polite">
        <h2 className="tv-weather-heading">🌦️ Weather</h2>
        <p className="tv-weather-muted">Loading real weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tv-weather-card" role="status">
        <h2 className="tv-weather-heading">🌦️ Weather</h2>
        <p className="tv-weather-error">{error}</p>
      </div>
    );
  }

  const current = weather.current;

  return (
    <section className="tv-weather-card">
      <div className="tv-weather-header">
        <div>
          <h2 className="tv-weather-heading">🌦️ Weather</h2>
          <p className="tv-weather-location">
            📍 {location.name}{location.country ? `, ${location.country}` : ""}
          </p>
        </div>
        <div className="tv-weather-icon" aria-label={getWeatherDescription(current.weather_code)}>
          {getWeatherIcon(current.weather_code)}
        </div>
      </div>

      <div className="tv-weather-main">
        <div className="tv-weather-temperature">{Math.round(current.temperature_2m)}°C</div>
        <div className="tv-weather-condition">{getWeatherDescription(current.weather_code)}</div>
      </div>

      <div className="tv-weather-grid">
        <div className="tv-weather-info">
          <span>🌡️ Feels Like</span>
          <strong>{Math.round(current.apparent_temperature)}°C</strong>
        </div>
        <div className="tv-weather-info">
          <span>💧 Humidity</span>
          <strong>{current.relative_humidity_2m}%</strong>
        </div>
        <div className="tv-weather-info">
          <span>💨 Wind</span>
          <strong>{Math.round(current.wind_speed_10m)} km/h</strong>
        </div>
        <div className="tv-weather-info">
          <span>🌧️ Precipitation</span>
          <strong>{current.precipitation} mm</strong>
        </div>
      </div>

      <p className="tv-weather-updated">Live weather data from Open-Meteo</p>

      <style>{`
        .tv-weather-card {
          box-sizing: border-box;
          width: 100%;
          margin: 0 0 30px;
          padding: 24px;
          color: #e8ecf8;
          background: linear-gradient(145deg, #151c30, #11182a);
          border: 1px solid #303a55;
          border-radius: 18px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }
        .tv-weather-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }
        .tv-weather-heading {
          margin: 0;
          color: #f0eaff;
          font-size: 22px;
        }
        .tv-weather-location {
          margin: 7px 0 0;
          color: #b8c3dc;
          font-size: 14px;
        }
        .tv-weather-icon {
          flex-shrink: 0;
          font-size: 48px;
        }
        .tv-weather-main { margin-bottom: 22px; }
        .tv-weather-temperature {
          color: #fff;
          font-size: clamp(36px, 5vw, 46px);
          font-weight: 800;
          line-height: 1.15;
        }
        .tv-weather-condition {
          margin-top: 6px;
          color: #c3a9ff;
          font-size: 15px;
          font-weight: 700;
        }
        .tv-weather-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .tv-weather-info {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 8px;
          padding: 15px;
          background: #1d2740;
          border: 1px solid #303a55;
          border-radius: 12px;
        }
        .tv-weather-info span {
          color: #b8c3dc;
          font-size: 12px;
        }
        .tv-weather-info strong {
          color: #f0eaff;
          font-size: 18px;
          overflow-wrap: anywhere;
        }
        .tv-weather-updated {
          margin: 18px 0 0;
          color: #8997b5;
          font-size: 12px;
        }
        .tv-weather-muted { color: #b8c3dc; }
        .tv-weather-error { color: #ff8296; line-height: 1.5; }
        @media (max-width: 800px) {
          .tv-weather-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 450px) {
          .tv-weather-card { padding: 18px; }
          .tv-weather-heading { font-size: 19px; }
          .tv-weather-icon { font-size: 38px; }
          .tv-weather-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
          .tv-weather-info { padding: 12px; }
        }
      `}</style>
    </section>
  );
}

export default Weather;
