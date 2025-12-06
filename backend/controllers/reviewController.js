import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const recalcMovieRating = async (movieId) => {
  const stats = await Review.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: "$movie",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Movie.findByIdAndUpdate(movieId, {
    avgRating: Math.round(avg * 10) / 10,
    reviewsCount: count
  });
};

export const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    if (!movieId || !rating)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await Review.findOne({ movie: movieId, user: req.user._id });
    if (exists) return res.status(400).json({ message: "You already reviewed" });

    const review = await Review.create({
      movie: movieId,
      user: req.user._id,
      rating,
      comment
    });

    await recalcMovieRating(review.movie);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    await recalcMovieRating(review.movie);
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const movieId = review.movie;
    await review.deleteOne();
    await recalcMovieRating(movieId);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};