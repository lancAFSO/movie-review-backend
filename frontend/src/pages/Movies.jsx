import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import "./Movies.css"; // custom styles

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/movies", { params: { q } });
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="movies-container">
      <h1 className="page-title">Movie Lists</h1>

      {/* Search bar */}
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Search movies..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={fetchMovies} className="search-button">
          Search
        </button>
      </div>

      {/* Loading state */}
      {loading && <div className="loading-spinner">Loading movies...</div>}

      {/* No results */}
      {!loading && movies.length === 0 && (
        <div className="no-results">No movies found. Try another search.</div>
      )}

      {/* Movie grid */}
      <div className="movie-grid">
        {movies.map((m) => (
          <div key={m._id} className="movie-card">
            {m.poster && (
              <img src={m.poster} alt={m.title} className="movie-poster" />
            )}
            <div className="movie-content">
              <Link to={`/movie/${m._id}`} className="movie-title">
                {m.title} {m.year ? `(${m.year})` : ""}
              </Link>
              <p className="movie-description">{m.description}</p>
              <div className="movie-meta">
                <span>⭐ Avg: {m.avgRating || 0}</span>
                <span>💬 Reviews: {m.reviewsCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}