import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("SIGNUP RESPONSE:", data);

      if (res.ok) {
        alert("Signup successful ✅");

        // 🔥 safer redirect
        navigate("/", { replace: true });
      } else {
        alert(data.message || "Signup failed ❌");
      }

    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h2 className="auth-title">📝 Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            className="auth-input"
            placeholder="Enter Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

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
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <div className="auth-link">
          Already have account? <Link to="/">Login</Link>
        </div>

      </div>
    </div>
  );
}