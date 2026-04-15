import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Update app state
        setToken(data.token);

        // 🔥 Navigate properly
        navigate("/dashboard", { replace: true });
      } else {
        alert(data.message || "Invalid credentials ❌");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error or backend not running ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h2 className="auth-title">🔐 Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link">
          Don't have account? <Link to="/signup">Signup</Link>
        </div>

      </div>
    </div>
  );
}