import { useState } from "react";
import { useNavigate } from "react-router-dom";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  width: "420px",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "22px",
  color: "#1e88e5",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "12px",
  marginBottom: "24px",
};

const seatStyle = {
  border: "1px solid #b5b6b9",
  borderRadius: "8px",
  padding: "12px 0",
  cursor: "pointer",
  fontWeight: 600,
};

const seatActive = {
  background: "#1e88e5",
  color: "#fff",
  border: "1px solid #1e88e5",
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
};

const btnStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

/**
 * REQUIRED PROPS:
 * open
 * onClose
 * showtimeId  ✅ IMPORTANT
 */
function SeatSelectionModal({ open, onClose, showtimeId }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  if (!open) return null;

  const handleConfirm = () => {
    // if (!selected || !showtimeId) return;

    // ✅ persist (prevents state loss)
    localStorage.setItem(
      "seatMeta",
      JSON.stringify({
        showtimeId,
        seatLimit: selected,
      })
    );

    // ✅ DIRECT redirect to SeatLayout
    navigate("/seat-layout", {
      state: {
        showtimeId,
        seatLimit: selected,
      },
    });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={titleStyle}>How many seats?</div>

        <div style={gridStyle}>
          {[...Array(10)].map((_, i) => {
            const val = i + 1;
            return (
              <div
                key={val}
                onClick={() => setSelected(val)}
                style={{
                  ...seatStyle,
                  ...(selected === val ? seatActive : {}),
                }}
              >
                {val}
              </div>
            );
          })}
        </div>

        <div style={footerStyle}>
          <button
            style={{
              ...btnStyle,
              background: "#fff",
              border: "1px solid #b5b6b9",
              color: "#6b7280",
            }}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            disabled={!selected}
            style={{
              ...btnStyle,
              background: selected ? "#1e88e5" : "#cbd5e1",
              border: "1px solid #1e88e5",
              color: "#fff",
            }}
            onClick={handleConfirm}
          >
            Select seats
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionModal;
