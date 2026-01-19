import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { getTheaterById } from "../api/theaterApi";
import { getMovieById } from "../api/movieApi";
import SeatSelectionModal from "../components/SeatSelectionModal";

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
    const TEMP_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck";

    const load = async () => {
      const token = localStorage.getItem("token") || TEMP_TOKEN;
      const headers = { Authorization: `Bearer ${token}` };

      const theaterData = await getTheaterById(theaterId);
      setTheater(theaterData);

      const screensRes = await fetch(
        `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/theaters/${theaterId}/screens`,
        { headers }
      );
      if (!screensRes.ok) return;

      const screens = await screensRes.json();

      const screenDetails = await Promise.all(
        screens.map((screen) =>
          fetch(
            `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/screens/${screen.id}`,
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
      <MainLayout>
        <div style={{ padding: "80px", textAlign: "center" }}>
          Loading Theater...
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <SeatSelectionModal
        open={showSeatModal}
        onClose={() => setShowSeatModal(false)}
        onConfirm={() => {
          if (!selectedShowtimeId) return;

          setShowSeatModal(false);

          // ✅ DIRECT REDIRECT LIKE BOOKING DETAILS FLOW
          navigate("/seat-layout", {
      state: {
        showtimeId: selectedTime.showTimeId,
        seatLimit: seatCount,
      },
    });
        }}
      />

      <MainLayout>
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
      </MainLayout>
    </>
  );
}

export default TheaterDetails;
