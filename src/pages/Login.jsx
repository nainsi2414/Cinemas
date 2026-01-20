import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import authStyles from "../styles/authStyles";
import { loginUser } from "../api/authApi";

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
      const data = await loginUser(form);
      console.log(data)

      // 🔐 Check for token in response (handle potential variations)
      const token = data.data.accessToken || data.token;

      if (!token) {
        throw new Error("No access token received from server");
      }

      // 🔐 Store token
      localStorage.setItem("token", token);
      console.log("Login successful, token stored:", token);

      // 🚀 Redirect after login
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
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
