import { useState, useEffect } from "react";

// Simulación de API - reemplaza con tu API key real
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

function SearchForm() {
  // Estados principales
  const [currentView, setCurrentView] = useState("search"); // 'search' o 'form'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados del buscador
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  // Estados del formulario
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

      // Validar que la respuesta tenga la estructura esperada
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

  // Buscar cuando cambia el input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(searchQuery, 1, false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reordenar cuando cambia el criterio de ordenamiento
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

  // Manejar selección de item
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

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleFormSubmit = () => {
    // Validación básica
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

    // Opcional: volver al buscador después de guardar
    // setCurrentView('search');
  };

  // Limpiar formulario para entrada manual
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

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8f9fa",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: "#666",
      fontSize: "1.1rem",
    },
    navigation: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "2rem",
    },
    navButton: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    navButtonActive: {
      backgroundColor: "#007bff",
      color: "white",
      boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
    },
    navButtonInactive: {
      backgroundColor: "white",
      color: "#666",
      border: "1px solid #ddd",
    },
    content: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    searchControls: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      minWidth: "300px",
    },
    selectInput: {
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      backgroundColor: "white",
      minWidth: "180px",
    },
    loadingState: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
    },
    spinner: {
      width: "32px",
      height: "32px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
    errorState: {
      backgroundColor: "#fee",
      border: "1px solid #fcc",
      color: "#c33",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    resultsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "1.5rem",
    },
    resultCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #eee",
    },
    resultCardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },
    posterContainer: {
      aspectRatio: "2/3",
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    poster: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    posterPlaceholder: {
      textAlign: "center",
      color: "#999",
      padding: "1rem",
    },
    cardContent: {
      padding: "1rem",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "0.5rem",
      lineHeight: "1.3",
    },
    cardInfo: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "0.25rem",
    },
    selectButton: {
      width: "100%",
      marginTop: "0.75rem",
      padding: "8px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.3s ease",
    },
    formHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    formTitle: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#333",
    },
    backButton: {
      background: "none",
      border: "none",
      color: "#666",
      cursor: "pointer",
      fontSize: "16px",
      padding: "8px 16px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: "2rem",
      marginBottom: "2rem",
    },
    posterSection: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    posterPreview: {
      aspectRatio: "2/3",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    formSection: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#333",
      marginBottom: "0.5rem",
    },
    input: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
    },
    textarea: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      resize: "vertical",
      minHeight: "100px",
    },
    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
      paddingTop: "2rem",
      borderTop: "1px solid #eee",
    },
    cancelButton: {
      padding: "12px 24px",
      border: "1px solid #ddd",
      backgroundColor: "white",
      color: "#666",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
    },
    saveButton: {
      padding: "12px 24px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
    },
    noResults: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
    },
    noResultsIcon: {
      fontSize: "4rem",
      marginBottom: "1rem",
    },
  };

  return (
    <div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
          .search-controls {
            flex-direction: column !important;
          }
          .search-input {
            min-width: auto !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎬 Gestor de Películas y Series</h1>
          <p style={styles.subtitle}>
            Busca contenido o agrega manualmente tus favoritos
          </p>
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={() => setCurrentView("search")}
            style={{
              ...styles.navButton,
              ...(currentView === "search"
                ? styles.navButtonActive
                : styles.navButtonInactive),
            }}
          >
            🔍 Buscador
          </button>
          <button
            onClick={handleNewEntry}
            style={{
              ...styles.navButton,
              ...(currentView === "form"
                ? styles.navButtonActive
                : styles.navButtonInactive),
            }}
          >
            ➕ Agregar Manual
          </button>
        </div>

        {/* Search View */}
        {currentView === "search" && (
          <div style={styles.content}>
            {/* Search Controls */}
            <div style={styles.searchControls} className="search-controls">
              <input
                type="text"
                placeholder="Buscar por título, actor o año..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                className="search-input"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.selectInput}
              >
                <option value="year-desc">Año ↓ (Reciente)</option>
                <option value="year-asc">Año ↑ (Antiguo)</option>
                <option value="rating">Puntuación ↓</option>
                <option value="title">Título A-Z</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && !results.length && (
              <div style={styles.loadingState}>
                <div style={styles.spinner}></div>
                <p>Buscando...</p>
              </div>
            )}

            {/* Error State */}
            {error && <div style={styles.errorState}>Error: {error}</div>}

            {/* Results */}
            {results.length > 0 && (
              <div style={styles.resultsGrid}>
                {results.map((item, index) => (
                  <div
                    key={`${item.id}-${item.media_type}-${index}`}
                    style={styles.resultCard}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, styles.resultCardHover);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "none";
                      e.target.style.boxShadow = styles.resultCard.boxShadow;
                    }}
                  >
                    <div style={styles.posterContainer}>
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                          alt={item.title || item.name}
                          style={styles.poster}
                        />
                      ) : (
                        <div style={styles.posterPlaceholder}>
                          <div
                            style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                          >
                            🎬
                          </div>
                          <p>Sin Imagen</p>
                        </div>
                      )}
                    </div>

                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>
                        {item.title || item.name || "Sin título"}
                      </h3>

                      <p style={styles.cardInfo}>
                        📅{" "}
                        {(item.release_date || item.first_air_date || "").slice(
                          0,
                          4
                        ) || "Año desconocido"}
                      </p>
                      <p style={styles.cardInfo}>
                        {item.media_type === "movie"
                          ? "🎬 Película"
                          : item.media_type === "tv"
                          ? "📺 Serie"
                          : item.media_type === "person"
                          ? "👤 Persona"
                          : "Desconocido"}
                      </p>
                      {item.vote_average > 0 && (
                        <p style={{ ...styles.cardInfo, color: "#ff9800" }}>
                          ⭐ {item.vote_average.toFixed(1)}
                        </p>
                      )}

                      <button
                        style={styles.selectButton}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#0056b3")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#007bff")
                        }
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && searchQuery && (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔍</div>
                <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  No se encontraron resultados
                </p>
                <p>Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        )}

        {/* Form View */}
        {currentView === "form" && (
          <div style={styles.content}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                {selectedItem
                  ? "Editar Información"
                  : "Agregar Nueva Película/Serie"}
              </h2>
              <button
                style={styles.backButton}
                onClick={() => setCurrentView("search")}
                onMouseEnter={(e) => (e.target.style.color = "#333")}
                onMouseLeave={(e) => (e.target.style.color = "#666")}
              >
                ← Volver al buscador
              </button>
            </div>

            <div style={styles.formGrid} className="form-grid">
              {/* Poster Section */}
              <div style={styles.posterSection}>
                <div style={styles.posterPreview}>
                  {formData.poster ? (
                    <img
                      src={formData.poster}
                      alt="Poster"
                      style={styles.poster}
                    />
                  ) : (
                    <div style={styles.posterPlaceholder}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                        🎬
                      </div>
                      <p>Sin Poster</p>
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>URL del Poster</label>
                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleFormChange}
                    placeholder="https://ejemplo.com/poster.jpg"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div style={styles.formSection}>
                <div style={styles.formRow} className="form-row">
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Título *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Año *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      min="1900"
                      max="2030"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow} className="form-row">
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Puntuación</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="7.5"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Género</label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      placeholder="Acción, Drama, Comedia"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Director</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleFormChange}
                    placeholder="Nombre del director"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Reparto Principal</label>
                  <input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleFormChange}
                    placeholder="Actor 1, Actor 2, Actor 3"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Sinopsis *</label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleFormChange}
                    style={styles.textarea}
                    placeholder="Descripción de la película o serie..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={styles.formActions}>
              <button
                type="button"
                onClick={() => setCurrentView("search")}
                style={styles.cancelButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                style={styles.saveButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#218838")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#28a745")
                }
              >
                💾 Guardar
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {results.length > 0 && currentView === "search" && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              marginTop: "2rem",
            }}
          >
            <p>Mostrando {results.length} resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchForm };
