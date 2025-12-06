import { Router } from "express";
import { createMovie, getMovies, getMovieById, deleteMovie } from "../controllers/movieController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", protect, adminOnly, createMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;