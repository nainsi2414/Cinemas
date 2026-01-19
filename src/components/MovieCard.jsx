import MovieDetails from "../pages/MovieDetails";
import mainStyles from "../styles/mainStyles";
import { useNavigate, useParams } from "react-router-dom";


function MovieCard({ id, image, title }) {
  const navigate = useNavigate();
  return (
    <div style={mainStyles.movieCard} 
      onClick={() => navigate(`/movie/${id}`)}>

      <img src={image} alt={title} style={mainStyles.movieImage} />
      <p style={mainStyles.movieTitle}>{title}</p>
    </div>

    
  );
}

export default MovieCard;
