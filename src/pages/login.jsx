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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post(
        "/auth/login",
        formData
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      setMessage("Login successful! 🎉");

      console.log("Logged in user:", response.data);

      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* BACK BUTTON */}

      <button
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>


      {/* LOGIN CARD */}

      <div className="auth-card">

        <div className="auth-icon">
          ✈️
        </div>


        <h1>
          Welcome Back
        </h1>


        <p>
          Sign in to continue planning your
          adventures.
        </p>


        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* SIGN IN */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}


        {/* REGISTER */}

        <p className="auth-footer">

          Don't have an account?

          <span
            onClick={onRegister}
            style={{
              cursor: "pointer",
              marginLeft: "5px",
              fontWeight: "600",
            }}
          >
            Create one
          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;