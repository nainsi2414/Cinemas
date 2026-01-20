import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import authStyles from "../styles/authStyles";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form);

      // 🔐 Store JWT token
      localStorage.setItem("accessToken", data.accessToken);

      // 🚀 Redirect after successful signup
      navigate("/home");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={authStyles.card}>
        <h3 style={authStyles.title}>Create an account</h3>

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        <label style={authStyles.label}>First name</label>
        <input
          style={authStyles.input}
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="John"
        />

        <label style={authStyles.label}>Last name</label>
        <input
          style={authStyles.input}
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Balami"
        />

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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p style={authStyles.footerText}>
          Already have an account?{" "}
          <span
            style={authStyles.link}
            onClick={() => navigate("/")}
          >
            <u>Log In</u>
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;
