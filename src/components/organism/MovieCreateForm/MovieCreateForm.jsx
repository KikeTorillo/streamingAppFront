import { useState, useEffect } from "react";
import "./MovieCreateForm.css";

import { Button } from "../../atoms/Button/Button";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

function MovieCreateForm() {
  const [currentView, setCurrentView] = useState("search");
  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    overview: "",
    poster: "",
    rating: "",
    genre: "",
    director: "",
    cast: "",
  });

  const fetchResults = async (query, pageNumber = 1, append = false) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(
          query
        )}&page=${pageNumber}`
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (!data.results) {
        throw new Error("Respuesta inválida de la API");
      }

      const sortResults = (items, sortType) => {
        return [...items].sort((a, b) => {
          const yearA = (a.release_date || a.first_air_date || "").slice(0, 4);
          const yearB = (b.release_date || b.first_air_date || "").slice(0, 4);

          switch (sortType) {
            case "year-desc":
              if (!yearA && !yearB) return 0;
              if (!yearA) return 1;
              if (!yearB) return -1;
              return parseInt(yearB) - parseInt(yearA);

            case "year-asc":
              if (!yearA && !yearB) return 0;
              if (!yearA) return 1;
              if (!yearB) return -1;
              return parseInt(yearA) - parseInt(yearB);

            case "rating":
              return (b.vote_average || 0) - (a.vote_average || 0);

            case "title":
              const titleA = (a.title || a.name || "").toLowerCase();
              const titleB = (b.title || b.name || "").toLowerCase();
              return titleA.localeCompare(titleB);

            default:
              return 0;
          }
        });
      };

      const sortedResults = sortResults(data.results, sortBy);

      if (append) {
        setResults((prev) => {
          const combined = [...prev, ...sortedResults];
          return sortResults(combined, sortBy);
        });
      } else {
        setResults(sortedResults);
      }

      setPage(pageNumber);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error fetching:", err);
      setError(err.message);
      if (!append) {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(searchQuery, 1, false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (results.length > 0) {
      const sortResults = (items, sortType) => {
        return [...items].sort((a, b) => {
          const yearA = (a.release_date || a.first_air_date || "").slice(0, 4);
          const yearB = (b.release_date || b.first_air_date || "").slice(0, 4);

          switch (sortType) {
            case "year-desc":
              if (!yearA && !yearB) return 0;
              if (!yearA) return 1;
              if (!yearB) return -1;
              return parseInt(yearB) - parseInt(yearA);

            case "year-asc":
              if (!yearA && !yearB) return 0;
              if (!yearA) return 1;
              if (!yearB) return -1;
              return parseInt(yearA) - parseInt(yearB);

            case "rating":
              return (b.vote_average || 0) - (a.vote_average || 0);

            case "title":
              const titleA = (a.title || a.name || "").toLowerCase();
              const titleB = (b.title || b.name || "").toLowerCase();
              return titleA.localeCompare(titleB);

            default:
              return 0;
          }
        });
      };

      setResults((prev) => sortResults(prev, sortBy));
    }
  }, [sortBy]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || item.name || "",
      year: (item.release_date || item.first_air_date || "").slice(0, 4),
      overview: item.overview || "",
      poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : "",
      rating: item.vote_average ? item.vote_average.toString() : "",
      genre: "",
      director: "",
      cast: "",
    });
    setCurrentView("form");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (
      !formData.title.trim() ||
      !formData.year.trim() ||
      !formData.overview.trim()
    ) {
      alert(
        "Por favor completa los campos obligatorios (Título, Año, Sinopsis)"
      );
      return;
    }

    console.log("Datos del formulario:", formData);
    alert("¡Película guardada exitosamente! (Ver consola para detalles)");
  };

  const handleNewEntry = () => {
    setSelectedItem(null);
    setFormData({
      title: "",
      year: "",
      overview: "",
      poster: "",
      rating: "",
      genre: "",
      director: "",
      cast: "",
    });
    setCurrentView("form");
  };

  return (
    <div className="movie-form-container">
      <div className="container">
        <div className="header">
          <h1 className="title">🎬 Gestor de Películas y Series</h1>
          <p className="subtitle">
            Busca contenido o agrega manualmente tus favoritos
          </p>
        </div>

        <div className="navigation">
          <Button
            onClick={() => setCurrentView("search")}
            variant={currentView === "search" ? "primary" : "outline"}
            size="lg"
            icon="🔍"
            text="Buscador"
            className="nav-button"
          />
          <Button
            onClick={handleNewEntry}
            variant={currentView === "form" ? "primary" : "outline"}
            size="lg"
            icon="➕"
            text="Agregar Manual"
            className="nav-button"
          />
        </div>

        {currentView === "search" && (
          <div className="content">
            <div className="search-controls">
              <input
                type="text"
                placeholder="Buscar por título, actor o año..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input focus-ring"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-input focus-ring"
              >
                <option value="year-desc">Año ↓ (Reciente)</option>
                <option value="year-asc">Año ↑ (Antiguo)</option>
                <option value="rating">Puntuación ↓</option>
                <option value="title">Título A-Z</option>
              </select>
            </div>

            {loading && !results.length && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Buscando...</p>
              </div>
            )}

            {error && <div className="error-state">Error: {error}</div>}

            {results.length > 0 && (
              <div className="results-grid">
                {results.map((item, index) => (
                  <div
                    key={`${item.id}-${item.media_type}-${index}`}
                    className="result-card"
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="poster-container">
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                          alt={item.title || item.name}
                          className="poster"
                        />
                      ) : (
                        <div className="poster-placeholder">
                          <div className="placeholder-icon">🎬</div>
                          <p>Sin Imagen</p>
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">
                        {item.title || item.name || "Sin título"}
                      </h3>

                      <p className="card-info">
                        📅{" "}
                        {(item.release_date || item.first_air_date || "").slice(
                          0,
                          4
                        ) || "Año desconocido"}
                      </p>
                      <p className="card-info">
                        {item.media_type === "movie"
                          ? "🎬 Película"
                          : item.media_type === "tv"
                            ? "📺 Serie"
                            : item.media_type === "person"
                              ? "👤 Persona"
                              : "Desconocido"}
                      </p>
                      {item.vote_average > 0 && (
                        <p className="card-info rating-info">
                          ⭐ {item.vote_average.toFixed(1)}
                        </p>
                      )}

                      <Button
                        variant="primary"
                        size="sm"
                        text="Seleccionar"
                        compact
                        className="select-button"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && searchQuery && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p className="no-results-text">
                  No se encontraron resultados
                </p>
                <p>Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        )}

        {currentView === "form" && (
          <div className="content">
            <div className="form-header">
              <h2 className="form-title">
                {selectedItem
                  ? "Editar Información"
                  : "Agregar Nueva Película/Serie"}
              </h2>
              <Button
                onClick={() => setCurrentView("search")}
                variant="ghost"
                icon="←"
                text="Volver al buscador"
                className="back-button"
              />
            </div>

            <div className="form-grid">
              <div className="poster-section">
                <div className="poster-preview">
                  {formData.poster ? (
                    <img
                      src={formData.poster}
                      alt="Poster"
                      className="poster"
                    />
                  ) : (
                    <div className="poster-placeholder">
                      <div className="placeholder-icon">🎬</div>
                      <p>Sin Poster</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="label">URL del Poster</label>
                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleFormChange}
                    placeholder="https://ejemplo.com/poster.jpg"
                    className="input focus-ring"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Título *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="input focus-ring"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Año *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      min="1900"
                      max="2030"
                      className="input focus-ring"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Puntuación</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="7.5"
                      className="input focus-ring"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Género</label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      placeholder="Acción, Drama, Comedia"
                      className="input focus-ring"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Director</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleFormChange}
                    placeholder="Nombre del director"
                    className="input focus-ring"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Reparto Principal</label>
                  <input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleFormChange}
                    placeholder="Actor 1, Actor 2, Actor 3"
                    className="input focus-ring"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Sinopsis *</label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleFormChange}
                    className="textarea focus-ring"
                    placeholder="Descripción de la película o serie..."
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Button
                onClick={() => setCurrentView("search")}
                variant="outline"
                text="Cancelar"
                className="cancel-button"
              />
              <Button
                onClick={handleFormSubmit}
                variant="success"
                icon="💾"
                text="Guardar"
                className="save-button"
              />
            </div>
          </div>
        )}

        {results.length > 0 && currentView === "search" && (
          <div className="results-footer">
            <p>Mostrando {results.length} resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { MovieCreateForm };
