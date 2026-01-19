import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TEMP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { amount, showtimeId, selectedSeats } = state || {};

  /* ================= SAFETY REDIRECT ================= */
  useEffect(() => {
    if (!amount || !showtimeId || !selectedSeats?.length) {
      navigate(-1);
    }
  }, [amount, showtimeId, selectedSeats, navigate]);

  if (!amount || !showtimeId || !selectedSeats?.length) return null;

  /* ================= PAYMENT HANDLER ================= */
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token") || TEMP_TOKEN;

      // Payload EXACTLY as backend expects
      const payload = {
        showtimeId,
        seatData: {
          seats: selectedSeats.map((seat) => ({
            row: seat.row,
            column: Number(seat.column),
            layoutType: seat.layoutType,
          })),
        },
      };

      console.log("ORDER PAYLOAD:", payload);

      const res = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Order creation failed:", data);
        throw new Error("Order creation failed");
      }

      // Stripe redirect URL (backend controlled)
      const stripeUrl =
        data?.paymentUrl ||
        data?.data?.paymentUrl ||
        data?.data?.url;

      if (!stripeUrl) {
        throw new Error("Stripe URL not returned");
      }

      // 🚀 Redirect to Stripe Checkout
      window.location.href = stripeUrl;

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  /* ================= UI ================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #ffffff, #cfeeff)",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#fff",
          padding: "28px",
          borderRadius: "18px",
          border: "1.5px solid #93c5fd",
        }}
      >
        <h2 style={{ color: "#2563eb", marginBottom: "12px" }}>
          Payment
        </h2>

        <hr style={{ marginBottom: "16px" }} />

        <p style={{ fontWeight: 600 }}>Pay With</p>
        <label style={{ display: "block", marginTop: "6px" }}>
          <input type="radio" checked readOnly /> Credit / Debit Card
        </label>

        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            height: "46px",
            marginTop: "24px",
            borderRadius: "10px",
            border: "1.5px solid #60a5fa",
            background: "#fff",
            color: "#2563eb",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Pay ₹{amount}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: "100%",
            height: "44px",
            marginTop: "12px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#9ca3af",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Payment;
