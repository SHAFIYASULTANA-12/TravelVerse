import { useState } from "react";
import API from "../services/api";

function Login({ onBack, onLoginSuccess, onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/auth/login", formData);
      const token = response.data?.token;

      if (!token) {
        throw new Error(
          "Login response did not contain an authentication token."
        );
      }

      localStorage.setItem("token", token);

      setMessage("Login successful! 🎉");

      if (typeof onLoginSuccess === "function") {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <section className="auth-card">
        <div className="auth-icon" aria-hidden="true">
          ✈️
        </div>

        <span className="auth-eyebrow">YOUR NEXT ADVENTURE AWAITS</span>

        <h1>Welcome Back</h1>

        <p className="auth-description">
          Sign in to continue planning your adventures with TravelVerse.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {message && (
          <div
            className={`auth-message ${
              message.toLowerCase().includes("successful")
                ? "auth-message-success"
                : "auth-message-error"
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <div className="auth-divider">
          <span>YOUR JOURNEY STARTS HERE</span>
        </div>

        <p className="auth-footer">
          Don't have an account?

          <button
            type="button"
            className="auth-register-link"
            onClick={onRegister}
            disabled={loading}
          >
            Create one
          </button>
        </p>

        <div className="auth-security">
          🔒 Your account is protected by secure authentication.
        </div>
      </section>
    </main>
  );
}

export default Login;