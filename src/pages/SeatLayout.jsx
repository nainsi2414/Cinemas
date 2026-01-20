import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import SeatSelectionModal from "../components/SeatSelectionModal";

const TEMP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eaf6fe, #a5d7ff)",
  },
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "40px 20px",
    textAlign: "center",
  },
  back: {
    fontSize: "25px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#1e88e5",
    marginBottom: "20px",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: "13px",
    color: "#737881",
    margin: "30px 0 8px",
    textAlign: "left",
  },
  divider: {
    borderBottom: "1px solid #a6adbe",
    marginBottom: "16px",
  },
  rows: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  seat: {
    width: "40px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
  selectedSeat: {
    background: "#1e88e5",
    color: "#fff",
    borderColor: "#1e88e5",
  },
  screen: {
    width: "80%",
    height: "10px",
    background: "#bdbdbd",
    borderRadius: "6px",
    margin: "45px auto 12px",
  },
  screenText: {
    fontSize: "13px",
    color: "#6b7280",
  },
  payBar: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
  },
  payBtn: {
    width: "280px",
    height: "48px",
    borderRadius: "10px",
    border: "2px solid #1e88e5",
    background: "#fff",
    color: "#1e88e5",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "16px",
  },
};

// useEffect(() => {
//   if (!showtimeId || !seatLimit) {
//     navigate(-1);
//   }
// }, [showtimeId, seatLimit, navigate]);

function SeatLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const showtimeId = location.state?.showtimeId;
  const seatLimit = location.state?.seatLimit;

  const [layoutSections, setLayoutSections] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* SAFETY */
  useEffect(() => {
    if (!showtimeId || !seatLimit) {
      navigate(-1);
    }
  }, [showtimeId, seatLimit, navigate]);

  /* LOAD SHOWTIME */
  useEffect(() => {
    if (!showtimeId) return;

    const token = localStorage.getItem("token") || TEMP_TOKEN;

    fetch(
      `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/show-times/${showtimeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(json => {
        const layout = JSON.parse(json.data.screen.layout);

        const priceMap = {};
        json.data.price.forEach(p => {
          priceMap[p.layoutType] = p.price;
        });

        setLayoutSections(
          layout.map(section => ({
            type: section.type,
            price: priceMap[section.type],
            rows: section.layout.rows,
            columns: section.layout.columns,
          }))
        );
      });
  }, [showtimeId]);


  /* ================= SEAT TOGGLE ================= */
  const toggleSeat = (seatId, price, type) => {
    const exists = selectedSeats.find((s) => s.id === seatId);

    if (exists) {
      setSelectedSeats((prev) =>
        prev.filter((s) => s.id !== seatId)
      );
      return;
    }

    if (selectedSeats.length >= seatLimit) {
      alert(`You can select only ${seatLimit} seats`);
      return;
    }

    setSelectedSeats((prev) => [...prev, { id: seatId, price , layoutType : type}]);
  };
  console.log(selectedSeats)
  const totalAmount = selectedSeats.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const renderRow = (row, cols, price, type) =>
    Array.from({ length: cols[1] - cols[0] + 1 }).map((_, i) => {
      const seatId = `${row}${cols[0] + i}`;
      const selected = selectedSeats.some((s) => s.id === seatId);

      return (
        <button
          key={seatId}
          onClick={() => toggleSeat(seatId, price, type)}
          style={{
            ...styles.seat,
            ...(selected ? styles.selectedSeat : {}),
          }}
        >
          {seatId}
        </button>
      );
    });

  return (
    <div>

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.back} onClick={() => navigate(-1)}>
            ←  Select Seats ({selectedSeats.length}/{seatLimit})
          </div>

          {layoutSections.map((section) => (
            <div key={section.type}>
              <div style={styles.sectionTitle}>
                ₹{section.price} {section.type}
              </div>
              <div style={styles.divider} />

              <div style={styles.rows}>
                {section.rows.map((row) => (
                  <div key={row} style={styles.row}>
                    {renderRow(row, section.columns, section.price, section.type)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={styles.screen} />
          <div style={styles.screenText}>All eyes this way please!</div>
        </div>

        <div style={styles.payBar}>
          <button
  style={styles.payBtn}
  disabled={selectedSeats.length !== seatLimit}
  onClick={() => {
    navigate("/booking-details", {
      state: {
        showtimeId,
        selectedSeats,
        totalAmount,
      },
    });
  }}
>
  Pay ₹{totalAmount}
</button>

        </div>
      </div>
    </div>
  );
}

export default SeatLayout;
