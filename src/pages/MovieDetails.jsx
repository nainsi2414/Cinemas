import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from "../api/movieApi";
// import SeatSelectionModal from "../components/SeatSelectionModal";

const styles = {
  container: {
    background: "linear-gradient(to right, #ffffff, #a8dbf9)",
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    gap: "40px",
    padding: "40px 80px",
    fontFamily: "Segoe UI, sans-serif",
  },
  left: { flex: 1 },
  right: { width: "360px" },
  back: { cursor: "pointer", color: "#6b7280", marginBottom: "20px" },
  sectionTitle: { color: "#1e88e5", fontSize: "20px", margin: "30px 0 12px" },
  pillRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  theaterPill: {
    height: "46px",
    padding: "10px 14px",
    border: "1px solid #b5b6b9",
    color: "#7b7878",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  timePill: {
    padding: "14px 22px",
    borderRadius: "8px",
    border: "1.5px solid #b5b6b9",
    backgroundColor: "#ffffff",
    color: "#7b7878",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  pillActive: {
    backgroundColor: "#1e88e5",
    color: "#fff",
    border: "1px solid #1e88e5",
    boxShadow: "0 6px 14px rgba(30,136,229,0.35)",
    transform: "scale(1.08)",
  },
  poster: { width: "100%", borderRadius: "16px", marginBottom: "16px" },
  movieTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e88e5",
    marginBottom: "6px",
  },
  movieInfo: { fontSize: "13px", color: "#6b7280", marginBottom: "4px" },
  bookingCard: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #1e88e5",
    borderRadius: "14px",
  },
  bookBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #1e88e5",
    background: "#fff",
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "600",
  },
  datePill: {
    color: "#5e5e5e",
    width: "85px",
    height: "85px",
    borderRadius: "10px",
    border: "1px solid #b5b6b9",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
};

function MovieDetails() {
  const navigate = useNavigate();
  const { id: movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [data, setData] = useState({});
  const [dates, setDates] = useState([]);

  const [showSeatModal, setShowSeatModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);


  const formatDateUI = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
    };
  };

  const formatTimeUI = (time24) => {
    const [h, m] = time24.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const splitDateTime = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toISOString().slice(0, 10),
      time: d.toISOString().slice(11, 16),
    };
  };

  useEffect(() => {
  
    const loadMovieDetails = async () => {
      try {
        const token = localStorage.getItem("token") ;
        const headers = { Authorization: `Bearer ${token}` };

        const movieData = await getMovieById(movieId);
        setMovie(movieData);

        if (!Array.isArray(movieData.theaters)) return;

        const structured = {};

        await Promise.all(
          movieData.theaters.map(async (theater) => {
            const screensRes = await fetch(
              `/api/theaters/${theater.id}/screens`,
              { headers }
            );
            if (!screensRes.ok) return;

            const screens = await screensRes.json();
            if (!Array.isArray(screens)) return;

            await Promise.all(
              screens.map(async (screen) => {
                const screenRes = await fetch(
                  `/api/screens/${screen.id}`,
                  { headers }
                );
                if (!screenRes.ok) return;

                const screenJson = await screenRes.json();
                const showTimes =
                  screenJson?.data?.screen?.showTimes || [];

                showTimes.forEach((show) => {
                  if (String(show.movieId) !== String(movieId)) return;

                  const { date, time } = splitDateTime(show.startTime);

                  structured[date] ??= {};
                  structured[date][theater.id] ??= {
                    theaterId: theater.id,
                    theaterName: theater.name,
                    times: [],
                  };

                  const exists = structured[date][theater.id].times.find(
                    (t) => t.time === time
                  );

                  if (!exists) {
                    structured[date][theater.id].times.push({
                      time,
                      showTimeId: show.id,
                    });
                  }
                });
              })
            );
          })
        );

        Object.values(structured).forEach((theaters) =>
          Object.values(theaters).forEach((t) =>
            t.times.sort((a, b) => a.time.localeCompare(b.time))
          )
        );

        const dateKeys = Object.keys(structured);
        if (!dateKeys.length) return;

        setData(structured);
        setDates(dateKeys);

        const firstDate = dateKeys[0];
        const firstTheater = Object.values(structured[firstDate])[0];

        setSelectedDate(firstDate);
        setSelectedTheater(firstTheater);
        setSelectedTime(firstTheater.times[0]);
      } catch (err) {
        console.error("Failed loading movie details", err);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  if (!movie) {
    return (
     
        <div style={{ padding: "80px", textAlign: "center" }}>
          <h2>Loading Movie...</h2>
        </div>
     
    );
  }

  function SeatCountModal({ open, onClose, onSelect }) {
    const [selected, setSelected] = useState(null);

    if (!open) return null;

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "360px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#1e88e5" }}>How many seats?</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: "12px",
            margin: "20px 0"
          }}>
            {[...Array(10)].map((_, i) => {
              const val = i + 1;
              return (
                <div
                  key={val}
                  onClick={() => setSelected(val)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    background: selected === val ? "#1e88e5" : "#fff",
                    color: selected === val ? "#fff" : "#000",
                    fontWeight: 600
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => {
                setSelected(null);
                onClose();
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f9fafb",
                color: "#475569",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              disabled={!selected}
              onClick={() => onSelect(selected)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: selected ? "#1e88e5" : "#ccc",
                color: "#fff",
                fontWeight: 600,
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div>


        <div style={styles.container}>
          {/* LEFT */}
          <div style={styles.left}>
            <div style={styles.back} onClick={() => navigate(-1)}>
              ← Back
            </div>

            <h3 style={styles.sectionTitle}>Date</h3>
            <div style={styles.pillRow}>
              {dates.map((date) => {
                const f = formatDateUI(date);
                return (
                  <div
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      const t = Object.values(data[date])[0];
                      setSelectedTheater(t);
                      setSelectedTime(t.times[0]);
                    }}
                    style={{
                      ...styles.datePill,
                      ...(selectedDate === date ? styles.pillActive : {}),
                    }}
                  >
                    <div>{f.date}</div>
                    <div style={{ fontWeight: 600 }}>{f.day}</div>
                  </div>
                );
              })}
            </div>

            <h3 style={styles.sectionTitle}>Theater</h3>
            <div style={styles.pillRow}>
              {selectedDate &&
                Object.values(data[selectedDate]).map((theater) => (
                  <button
                    key={theater.theaterId}
                    onClick={() => {
                      setSelectedTheater(theater);
                      setSelectedTime(theater.times[0]);
                    }}
                    style={{
                      ...styles.theaterPill,
                      ...(selectedTheater?.theaterId === theater.theaterId
                        ? styles.pillActive
                        : {}),
                    }}
                  >
                    📍 {theater.theaterName}
                  </button>
                ))}
            </div>

            <h3 style={styles.sectionTitle}>Time</h3>
            <div style={styles.pillRow}>
              {selectedTheater &&
                selectedTheater.times.map((slot) => (
                  <div
                    key={slot.showTimeId}
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      ...styles.timePill,
                      ...(selectedTime?.showTimeId === slot.showTimeId
                        ? styles.pillActive
                        : {}),
                    }}
                  >
                    {formatTimeUI(slot.time)}
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.right}>
            <img src={movie.image} alt={movie.name} style={styles.poster} />
            <p style={styles.movieTitle}>{movie.name}</p>

            <div style={styles.movieInfo}>
              <b>Description:</b> {movie.description}
            </div>
            <div style={styles.movieInfo}>
              <b>Duration:</b>{" "}
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </div>
            <div style={styles.movieInfo}>
              <b>Language:</b> {movie.languages.join(", ")}
            </div>
            <div style={styles.movieInfo}>
              <b>Category:</b> {movie.category.join(", ")}
            </div>

            {selectedTheater && selectedDate && selectedTime && (
              <div style={styles.bookingCard}>
                <strong style={{ color: "#1e88e5" }}>
                  {selectedTheater.theaterName}
                </strong>
                <p style={{ fontSize: "14px", marginTop: "6px" }}>
                  {selectedDate}
                  <br />
                  {formatTimeUI(selectedTime.time)}
                </p>
                <button
                  style={styles.bookBtn}
                  onClick={() => setShowSeatModal(true)}
                >
                  Book Now
                </button>

              </div>
            )}
          </div>
        </div>
    
      <SeatCountModal
        open={showSeatModal}
        onClose={() => setShowSeatModal(false)}
        onSelect={(seatCount) => {
          setShowSeatModal(false);
          navigate("/seat-layout", {
            state: {
              showtimeId: selectedTime.showTimeId,
              seatLimit: seatCount,
            },
          });
        }}
      />

    </div>
  );
}

export default MovieDetails;
