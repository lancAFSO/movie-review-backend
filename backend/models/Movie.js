import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    year: { type: Number },
    genres: [{ type: String }],
    avgRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    poster: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("movies", movieSchema);