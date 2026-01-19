import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import authStyles from "../styles/authStyles";

const BASE_URL =
  "/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 🔐 Store token
      localStorage.setItem("accessToken", data.accessToken);

      // 🚀 Redirect after login
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={authStyles.card}>
        <h3 style={authStyles.title}>Login to your account</h3>

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <label style={authStyles.label}>Email</label>
        <input
          style={authStyles.input}
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="balamia@gmail.com"
        />

        <label style={authStyles.label}>Password</label>
        <input
          type="password"
          style={authStyles.input}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="bala#1234"
        />

        <button
          style={authStyles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={authStyles.footerText}>
          Don’t have an account?{" "}
          <span
            style={authStyles.link}
            onClick={() => navigate("/register")}
          >
            <u>Register now</u>
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
