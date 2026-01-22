import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTheaterById } from "../api/theaterApi";
import { getMovieById } from "../api/movieApi";

const styles = {
  container: {
    padding: "20px 70px",
    fontFamily: "Segoe UI, sans-serif",
  },
  back: {
    color: "#1e88e5",
    cursor: "pointer",
    fontSize: "18px",
    marginBottom: "16px",
  },
  location: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "16px",
  },
  divider: {
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "20px",
  },
  dateStrip: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "12px",
    marginBottom: "30px",
  },
  datePill: {
    minWidth: "56px",
    height: "56px",
    padding: "6px 8px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    background: "#fff",
  },
  activeDate: {
    borderColor: "#1e88e5",
    color: "#1e88e5",
    fontWeight: 600,
  },
  movieRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "26px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  movieName: {
    fontSize: "18px",
    color: "#1e88e5",
    fontWeight: 600,
  },
  movieMeta: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },
  timeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  timePill: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
  bookBtn: {
    height: "44px",
    padding: "0 28px",
    borderRadius: "10px",
    border: "1.5px solid #1e88e5",
    background: "#e3f2fd",
    color: "#1e88e5",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "center",
  },
};

function TheaterDetails() {
  const navigate = useNavigate();
  const { id: theaterId } = useParams();

  const [theater, setTheater] = useState(null);
  const [data, setData] = useState({});
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  const [showSeatModal, setShowSeatModal] = useState(false);

  const splitDateTime = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toISOString().slice(0, 10),
      time: d.toISOString().slice(11, 16),
    };
  };

  const formatDateUI = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      day: d.toLocaleDateString("en-US", { day: "2-digit" }),
      week: d.toLocaleDateString("en-US", { weekday: "short" }),
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

  useEffect(() => {
    // const TEMP_TOKEN =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck";

    const load = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const theaterData = await getTheaterById(theaterId);
      setTheater(theaterData);

      const screensRes = await fetch(
        `/api/theaters/${theaterId}/screens`,
        { headers }
      );
      if (!screensRes.ok) return;

      const screens = await screensRes.json();

      const screenDetails = await Promise.all(
        screens.map((screen) =>
          fetch(
            `/api/screens/${screen.id}`,
            { headers }
          ).then((r) => (r.ok ? r.json() : null))
        )
      );

      const structured = {};
      const movieIdsSet = new Set();

      screenDetails.forEach((json) => {
        const showTimes = json?.data?.screen?.showTimes || [];
        showTimes.forEach((show) => {
          const { date, time } = splitDateTime(show.startTime);
          movieIdsSet.add(show.movieId);

          structured[date] ??= {};
          structured[date][show.movieId] ??= {
            movieId: show.movieId,
            movieName: "",
            language: show.language || "English",
            format: show.format || "2D",
            times: [],
          };

          structured[date][show.movieId].times.push({
            time,
            showtimeId: show.id,
          });
        });
      });

      const movies = await Promise.all(
        Array.from(movieIdsSet).map((id) => getMovieById(id))
      );

      const movieMap = {};
      movies.forEach((m) => (movieMap[m.id] = m.name));

      Object.values(structured).forEach((moviesObj) => {
        Object.values(moviesObj).forEach((movie) => {
          movie.movieName = movieMap[movie.movieId] || "Movie";
        });
      });

      const sortedDates = Object.keys(structured).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      setData(structured);
      setDates(sortedDates);
      setSelectedDate(sortedDates[0]);
    };

    load();
  }, [theaterId]);

  if (!theater) {
    return (
        <div style={{ padding: "80px", textAlign: "center" }}>
          Loading Theater...
        </div>
    );
  }


  function SeatCountModal({ open, onClose, onSelect }) {
  const [selected, setSelected] = useState(null);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "360px",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#1e88e5" }}>How many seats?</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: "12px",
            margin: "20px 0",
          }}
        >
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
                  fontWeight: 600,
                }}
              >
                {val}
              </div>
            );
          })}
        </div>

        {/* BUTTONS */}
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
    <>
        <div style={styles.container}>
          <div style={styles.back} onClick={() => navigate(-1)}>
            ← {theater.name}
          </div>
          <div style={styles.location}>{theater.location}</div>

          <div style={styles.divider} />

          <div style={styles.dateStrip}>
            {dates.map((d) => {
              const f = formatDateUI(d);
              return (
                <div
                  key={d}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedMovieId(null);
                    setSelectedTime(null);
                    setSelectedShowtimeId(null);
                  }}
                  style={{
                    ...styles.datePill,
                    ...(selectedDate === d ? styles.activeDate : {}),
                  }}
                >
                  <div>{f.day} {f.month}</div>
                  <div style={{ fontWeight: 600 }}>{f.week}</div>
                </div>
              );
            })}
          </div>

          {selectedDate &&
            Object.values(data[selectedDate]).map((movie) => (
              <div key={movie.movieId} style={styles.movieRow}>
                <div>
                  <div style={styles.movieName}>{movie.movieName}</div>
                  <div style={styles.movieMeta}>
                    {movie.language}, {movie.format}
                  </div>

                  <div style={styles.timeRow}>
                    {movie.times.map((t) => (
                      <div
                        key={t.showtimeId}
                        onClick={() => {
                          setSelectedMovieId(movie.movieId);
                          setSelectedTime(t.time);
                          setSelectedShowtimeId(t.showtimeId);
                        }}
                        style={{
                          ...styles.timePill,
                          ...(selectedShowtimeId === t.showtimeId
                            ? {
                              borderColor: "#1e88e5",
                              color: "#1e88e5",
                              fontWeight: 600,
                            }
                            : {}),
                        }}
                      >
                        {formatTimeUI(t.time)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={{
                    ...styles.bookBtn,
                    opacity:
                      selectedMovieId === movie.movieId && selectedTime
                        ? 1
                        : 0.5,
                  }}
                  onClick={() => {
                    if (selectedMovieId === movie.movieId && selectedTime) {
                      setShowSeatModal(true);
                    }
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
        </div>

      <SeatCountModal
        open={showSeatModal}
        onClose={() => setShowSeatModal(false)}
        onSelect={(seatCount) => {
          setShowSeatModal(false);
          navigate("/seat-layout", {
            state: {
              showtimeId: selectedShowtimeId,
              seatLimit: seatCount,
            },
          });
        }}
      />
    </>
  );
}

export default TheaterDetails;
