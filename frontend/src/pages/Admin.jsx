import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [movies, setMovies] = useState([]);

  const load = async () => {
    const res = await axios.get("/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!user || user.role !== "admin") {
    return <p>Admin only.</p>;
  }

  const createMovie = async () => {
    try {
      await axios.post("/movies", {
        title,
        year: year ? Number(year) : undefined,
        description
      });
      setTitle(""); setYear(""); setDescription("");
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating movie");
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`/movies/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting movie");
    }
  };

  return (
    <div>
      <h2>Admin</h2>
      <div style={{ marginBottom: 16 }}>
        <h3>Add Movie</h3>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", marginTop: 8 }}
        />
        <br />
        <button onClick={createMovie}>Create</button>
      </div>

      <h3>Movies</h3>
      {movies.map(m => (
        <div key={m._id} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <strong>{m.title}</strong> {m.year ? `(${m.year})` : ""}
          <button style={{ marginLeft: 12 }} onClick={() => deleteMovie(m._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}