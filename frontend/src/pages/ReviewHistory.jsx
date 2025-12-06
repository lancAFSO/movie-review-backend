import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./ReviewHistory.css";

export default function ReviewHistory() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`/reviews/users/${user.id}`);
      setReviews(res.data);
    };
    if (user) load();
  }, [user]);

  if (!user) return <p>Please log in to see your review history.</p>;
  

  return (
    <div className="review-history-page">
      <h2>{user.name}'s Review History</h2>
      {!reviews.length && <p>No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r._id} className="review-history-item">
          <img src={r.movie?.poster} alt={r.movie?.title} className="history-poster" />
          <div>
            <strong>{r.movie?.title} ({r.movie?.year})</strong>
            <p>{r.comment}</p>
            <small>
              Rated {r.rating}/10 • {new Date(r.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}