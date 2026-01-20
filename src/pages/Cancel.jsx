import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eaf6fe, #a5d7ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "400px",
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid #fca5a5",
    textAlign: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "25px",
  },
  title: {
    fontSize: "25px",
    fontWeight: 700,
    color: "#dc2626",
    marginBottom: "20px",
  },
  text: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },
  retryBtn: {
    width: "90%",
    height: "44px",
    borderRadius: "10px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "16px",
  },
  homeBtn: {
    width: "90%",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#f9fafb",
    color: "#374151",
    cursor: "pointer",
    fontSize: "16px",
  },
};

function Cancel() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>❌</div>
          <div style={styles.title}>Payment Cancelled</div>
          <div style={styles.text}>
            Your payment was not completed. No amount has been charged.
          </div>

          <button
            style={styles.retryBtn}
            onClick={() => navigate(-1)}
          >
            Try Again
          </button>

          <button
            style={styles.homeBtn}
            onClick={() => navigate("/home")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Cancel;
