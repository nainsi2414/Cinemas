import { useEffect, useState } from "react";
import { getAllMovies } from "../api/movieApi";
import { getAllTheaters } from "../api/theaterApi";
import { useNavigate } from "react-router-dom";

import mainStyles from "../styles/mainStyles";
import MovieCard from "../components/MovieCard";
import MovieDetails from "../pages/MovieDetails";

function Home() {
    const [theaters, setTheaters] = useState([]);
    const [activeTab, setActiveTab] = useState("movie");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        if (activeTab === "movie") {
            getAllMovies()
            .then((res) => setMovies(res))
            .catch(console.error)
            .finally(() => setLoading(false));
           
        } else {
            getAllTheaters()
            .then((res) => setTheaters(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
        }
        }, [activeTab]);



  return (
      <div style={mainStyles.pageContainer}>
        <div style={mainStyles.card}>
            <h2 style={mainStyles.title}>Now Showing</h2>

        {/* Tabs */}
        <div style={mainStyles.tabs}>
          <div
            style={
              activeTab === "movie"
                ? mainStyles.tabActive
                : mainStyles.tabInactive
            }
            onClick={() => setActiveTab("movie")}
          >
            Movie
          </div>

          <div
            style={
              activeTab === "theater"
                ? mainStyles.tabActive
                : mainStyles.tabInactive
            }
            onClick={() => setActiveTab("theater")}
          >
            Theater
          </div>
        </div>

       

        {loading && <p>Loading...</p>}

    {/* MOVIES */}
    {!loading && activeTab === "movie" && (
    <div style={mainStyles.movieGrid}>
        {movies.map((movie) => (
        <MovieCard
            key={movie.id}
            id = {movie.id}
            title={movie.name}
            image={movie.image}
            onClick = {() => navigate(`/movies/${movie.id}`)}
        />
        
        ))}
        
    </div>
    )}

    {/* THEATERS */}
    {!loading && activeTab === "theater" && (
    <div>
        {theaters.map((theater) => (
        <div
            key={theater.id}
            style={mainStyles.theaterCard}
            onClick={() => navigate(`/theaters/${theater.id}`)}
        >
            <div>
            <div style={mainStyles.theaterName}>{theater.name}</div>
            <div style={mainStyles.theaterAddress}>
            {theater.location || "Address not available"}
          </div>
            </div>
            <span style={mainStyles.theaterArrow}>›</span>
        </div>
        ))}
    </div>
    )}

        </div>    
    </div>
 
  );
}

export default Home;
