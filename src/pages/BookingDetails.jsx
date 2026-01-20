import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const TEMP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck";

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
    padding: "24px",
    border: "1px solid #90caf9",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1e88e5",
    marginBottom: "16px",
  },
  label: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "14px",
  },
  value: {
    fontSize: "14px",
    fontWeight: 600,
    marginTop: "4px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "14px",
  },
  divider: {
    borderBottom: "1px solid #e5e7eb",
    margin: "14px 0",
  },
  payBtn: {
    width: "100%",
    height: "44px",
    marginTop: "18px",
    borderRadius: "10px",
    border: "1.5px solid #1e88e5",
    background: "#fff",
    color: "#1e88e5",
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
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

function BookingDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { showtimeId, selectedSeats = [], totalAmount } = state || {};
  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD SHOWTIME DETAILS ================= */
  useEffect(() => {
    if (!showtimeId) return;

    const token = localStorage.getItem("token") || TEMP_TOKEN;

    fetch(`/api/show-times/${showtimeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setShowtime(json.data));
  }, [showtimeId]);

  if (!showtime) {
    return (
      <MainLayout>
        <div style={{ padding: "60px", textAlign: "center" }}>
          Loading booking details...
        </div>
      </MainLayout>
    );
  }

  const seatNames = selectedSeats.map((s) => s.id).join(", ");
  const seatCount = selectedSeats.length;

  const serviceCharge = Math.round(totalAmount * 0.06);
  const grandTotal = totalAmount + serviceCharge;

  /* ================= PLACE ORDER & REDIRECT ================= */
  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || TEMP_TOKEN;

      console.log(selectedSeats);

      const payload = {
        showtimeId,
        seatData: {
          seats: selectedSeats.map((seat) => ({
            row: seat.id.charAt(0),
            column: Number(seat.id.slice(1)),
            layoutType: seat.layoutType,
          })),
        }
      };
      console.log(payload)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        console.log(json.message)
      }

      if (json?.paymentUrl) {
        window.location.href = json.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {

      console.log("Payment error:", err);
      alert(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Booking Detail</div>

        <div style={styles.label}>Movie Title</div>
        <div style={styles.value}>{showtime.movie.name}</div>

        <div style={styles.label}>Date</div>
        <div style={styles.value}>
          {new Date(showtime.startTime).toDateString()}
        </div>

        <div style={styles.row}>
          <div>
            <div style={styles.label}>Ticket ({seatCount})</div>
            <div style={styles.value}>{seatNames}</div>
          </div>
          <div>
            <div style={styles.label}>Hours</div>
            <div style={styles.value}>
              {new Date(showtime.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.row}>
          <span>Seats ({seatCount})</span>
          <span>₹{totalAmount}</span>
        </div>

        <div style={styles.row}>
          <span>Service Charge (6%)</span>
          <span>₹{serviceCharge}</span>
        </div>

        <div style={styles.divider} />

        <div style={styles.row}>
          <strong>Total payment</strong>
          <strong>₹{grandTotal}</strong>
        </div>

        <button
          style={styles.payBtn}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Redirecting..." : `Total Pay ₹${grandTotal} Proceed`}
        </button>

        <button
          style={styles.cancelBtn}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;
