import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = async () => {
    const res = await axios.get(`/movies/${id}`);
    setMovie(res.data.movie);
    setReviews(res.data.reviews);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async () => {
    try {
      await axios.post("/reviews", { movieId: id, rating: Number(rating), comment });
      setRating(10);
      setComment("");
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const updateReview = async (reviewId, newRating, newComment) => {
    try {
      await axios.put(`/reviews/${reviewId}`, { rating: newRating, comment: newComment });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="movie-detail">
      {/* Poster */}
      {movie.poster && (
        <img src={movie.poster} alt={movie.title} className="detail-poster" />
      )}

      {/* Content */}
      <div className="detail-content">
        <h2 className="detail-title">
          {movie.title} {movie.year ? `(${movie.year})` : ""}
        </h2>
        <p className="detail-description">{movie.description}</p>
        <p className="detail-meta">
          <strong>Average Rating:</strong> {movie.avgRating} ({movie.reviewsCount} reviews)
        </p>

        {/* Reviews */}
        <div className="reviews">
          <h3>Reviews</h3>
          {!reviews.length && <p>No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="review-item">
              <p>
                <strong>{r.user?.name || "User"}:</strong> {r.rating} ⭐
              </p>
              <p>{r.comment}</p>

              {user && (user.id === r.user?._id || user.role === "admin") && (
                <div className="review-actions">
                  <button
                    onClick={() => {
                      const newRating = Number(prompt("New rating (1-10):", r.rating));
                      const newComment = prompt("New comment:", r.comment);
                      if (!newRating) return;
                      updateReview(r._id, newRating, newComment);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteReview(r._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Review */}
        {user ? (
          <div className="add-review">
            <h4>Add your review</h4>
            <label>
              Rating:
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              placeholder="Your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button onClick={submitReview}>Submit</button>
          </div>
        ) : (
          <p className="login-prompt">Login to add a review.</p>
        )}
      </div>
    </div>
  );
}