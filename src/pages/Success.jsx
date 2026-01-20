import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #ffffff, #cfeeff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "360px",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid #90caf9",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "24px",
  },
  circle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 24px",
  },
  check: {
    fontSize: "40px",
    color: "#fff",
  },
  btnPrimary: {
    width: "100%",
    height: "44px",
    marginTop: "16px",
    borderRadius: "10px",
    border: "1.5px solid #1e88e5",
    background: "#fff",
    color: "#1e88e5",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    width: "100%",
    height: "44px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#f9fafb",
    color: "#6b7280",
    cursor: "pointer",
  },
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }

  }, [sessionId, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Payment Successful</h2>

        <div style={styles.circle}>
          <span style={styles.check}>✓</span>
        </div>

        <button
          style={styles.btnPrimary}
          onClick={() => navigate(`/tickets`, {
            state: { sessionId }
          })}
        >
          View Ticket
        </button>


        <button
          style={styles.btnSecondary}
          onClick={() => navigate("/home")}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
