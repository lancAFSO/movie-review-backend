import { Routes, Route, Link } from "react-router-dom";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import Admin from "./pages/Admin";
import "./Navbar.css";
import { useTheme } from "./context/ThemeContext"; // ✅ import hook

export default function App() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme(); // ✅ get values from context

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Navbar */}
      <nav className="navbar">
        {/* Left: Brand */}
        <Link to="/" className="navbar-brand">
          MovReview
        </Link>

        {/* Right: Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Movies</Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <button onClick={logout} className="logout-btn">
              Logout ({user.name})
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="toggle-btn"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}