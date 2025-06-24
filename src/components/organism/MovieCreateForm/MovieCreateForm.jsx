// components/organism/MovieCreateForm/MovieCreateForm.jsx
import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import './MovieCreateForm.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreateForm - REFACTORIZADO SIGUIENDO PATRÓN DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ PATRÓN: Mismo flujo que CategoryCreatePage/UserCreatePage
 * ✅ COMPONENTES: DynamicForm + Button + Card + ContentImage
 * ✅ ESTILOS: Variables CSS del sistema (app.css)
 */
function MovieCreateForm() {
  // ===== ESTADOS =====
  const [currentView, setCurrentView] = useState("search");
  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // ===== CONFIGURACIÓN DE CAMPOS PARA DYNAMICFORM =====
  const movieFormFields = [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      placeholder: 'Nombre de la película o serie',
      required: true,
      leftIcon: '🎬',
      helperText: 'Título original o en español'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año de lanzamiento',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      min: 1900,
      max: new Date().getFullYear() + 5
    },
    {
      name: 'genre',
      type: 'select',
      label: 'Género',
      leftIcon: '🎭',
      options: [
        { value: '', label: 'Seleccionar género' },
        { value: 'accion', label: 'Acción' },
        { value: 'aventura', label: 'Aventura' },
        { value: 'comedia', label: 'Comedia' },
        { value: 'drama', label: 'Drama' },
        { value: 'terror', label: 'Terror' },
        { value: 'ciencia-ficcion', label: 'Ciencia Ficción' },
        { value: 'romance', label: 'Romance' },
        { value: 'thriller', label: 'Thriller' },
        { value: 'animacion', label: 'Animación' },
        { value: 'documental', label: 'Documental' }
      ]
    },
    {
      name: 'director',
      type: 'text',
      label: 'Director',
      placeholder: 'Nombre del director',
      leftIcon: '🎯'
    },
    {
      name: 'cast',
      type: 'text',
      label: 'Reparto Principal',
      placeholder: 'Actor 1, Actor 2, Actor 3',
      leftIcon: '🎭',
      helperText: 'Separa los nombres con comas'
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Calificación',
      placeholder: '8.5',
      leftIcon: '⭐',
      min: 0,
      max: 10,
      step: 0.1,
      helperText: 'Puntuación del 0 al 10'
    },
    {
      name: 'poster',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://ejemplo.com/poster.jpg',
      leftIcon: '🖼️',
      helperText: 'URL de la imagen del poster'
    },
    {
      name: 'overview',
      type: 'textarea',
      label: 'Sinopsis',
      placeholder: 'Descripción de la película o serie...',
      required: true,
      leftIcon: '📝',
      rows: 4,
      helperText: 'Resumen atractivo del contenido'
    }
  ];

  // ===== OPCIONES DE ORDENAMIENTO =====
  const sortOptions = [
    { value: 'year-desc', label: 'Año ↓ (Reciente)' },
    { value: 'year-asc', label: 'Año ↑ (Antiguo)' },
    { value: 'rating', label: 'Puntuación ↓' },
    { value: 'title', label: 'Título A-Z' }
  ];

  // ===== EFECTOS =====
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchResults(searchQuery, 1, false);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (results.length > 0) {
      setResults(prev => sortResults(prev, sortBy));
    }
  }, [sortBy]);

  // ===== FUNCIONES DE BÚSQUEDA =====
  const fetchResults = async (query, pageNumber = 1, append = false) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(query)}&page=${pageNumber}`
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      if (!data.results) {
        throw new Error("Respuesta inválida de la API");
      }

      const sortedResults = sortResults(data.results, sortBy);
      setResults(append ? prev => [...prev, ...sortedResults] : sortedResults);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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

  // ===== HANDLERS =====
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // Pre-llenar formulario con datos de TMDB
    const formData = {
      title: item.title || item.name || "",
      year: (item.release_date || item.first_air_date || "").slice(0, 4),
      overview: item.overview || "",
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "",
      rating: item.vote_average ? item.vote_average.toString() : "",
      genre: "",
      director: "",
      cast: ""
    };
    
    setCurrentView("form");
    // Aquí podrías setear los datos iniciales del formulario si DynamicForm lo soporta
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.title?.trim() || !formData.year?.trim() || !formData.overview?.trim()) {
        throw new Error("Por favor completa los campos obligatorios (Título, Año, Sinopsis)");
      }

      // Aquí iría la lógica para guardar en el backend
      console.log("Datos del formulario:", formData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormSuccess(true);
      
      // Resetear después de éxito
      setTimeout(() => {
        setFormSuccess(false);
        setCurrentView("search");
        setSelectedItem(null);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleNewEntry = () => {
    setSelectedItem(null);
    setCurrentView("form");
  };

  // ===== RENDERIZADO =====
  return (
    <div className="movie-form-container">
      <div className="movie-form-header">
        <h1 className="movie-form-title">🎬 Gestor de Películas y Series</h1>
        <p className="movie-form-subtitle">
          Busca contenido o agrega manualmente tus favoritos
        </p>
      </div>

      {/* Navegación entre vistas */}
      <div className="movie-form-navigation">
        <Button
          onClick={() => setCurrentView("search")}
          variant={currentView === "search" ? "primary" : "outline"}
          size="lg"
          text="🔍 Buscador"
          className="movie-form-nav-button"
        />
        <Button
          onClick={handleNewEntry}
          variant={currentView === "form" ? "primary" : "outline"}
          size="lg"
          text="➕ Agregar Manual"
          className="movie-form-nav-button"
        />
      </div>

      {/* Vista de búsqueda */}
      {currentView === "search" && (
        <div className="movie-form-search-view">
          {/* Controles de búsqueda usando componentes del sistema */}
          <Card className="movie-form-search-controls">
            <div className="movie-form-search-inputs">
              <div className="movie-form-search-input-wrapper">
                <input
                  type="text"
                  placeholder="Buscar por título, actor o año..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="movie-form-search-input"
                />
              </div>
              
              <div className="movie-form-sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="movie-form-sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Estados de carga y error */}
          {loading && !results.length && (
            <Card className="movie-form-loading-state">
              <div className="movie-form-spinner"></div>
              <p>Buscando contenido...</p>
            </Card>
          )}

          {error && (
            <Card variant="outlined" className="movie-form-error-state">
              <p>❌ Error: {error}</p>
            </Card>
          )}

          {/* Resultados de búsqueda */}
          {results.length > 0 && (
            <>
              <div className="movie-form-results-grid">
                {results.map((item, index) => (
                  <Card
                    key={`${item.id}-${item.media_type}-${index}`}
                    variant="elevated"
                    hoverable
                    onClick={() => handleSelectItem(item)}
                    className="movie-form-result-card"
                  >
                    <div className="movie-form-poster-container">
                      <ContentImage
                        src={item.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                          : null
                        }
                        alt={`Poster de ${item.title || item.name}`}
                        aspectRatio="2:3"
                        fallback="🎬"
                        className="movie-form-poster"
                      />
                    </div>
                    
                    <div className="movie-form-result-info">
                      <h3 className="movie-form-result-title">
                        {item.title || item.name}
                      </h3>
                      <p className="movie-form-result-year">
                        {(item.release_date || item.first_air_date || "").slice(0, 4) || "Sin fecha"}
                      </p>
                      <p className="movie-form-result-type">
                        {item.media_type === "movie" ? "🎬 Película" : "📺 Serie"}
                      </p>
                      {item.vote_average > 0 && (
                        <p className="movie-form-result-rating">
                          ⭐ {item.vote_average.toFixed(1)}/10
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="movie-form-results-footer">
                <p>📊 Mostrando {results.length} resultados</p>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Vista del formulario */}
      {currentView === "form" && (
        <div className="movie-form-form-view">
          <Card>
            <div className="movie-form-form-header">
              <h2 className="movie-form-form-title">
                {selectedItem ? "✏️ Editar Información" : "➕ Agregar Nueva Película/Serie"}
              </h2>
              
              {selectedItem && (
                <Button
                  onClick={() => setCurrentView("search")}
                  variant="ghost"
                  text="← Volver al buscador"
                  className="movie-form-back-button"
                />
              )}
            </div>

            {/* Mostrar poster si existe */}
            {selectedItem?.poster_path && (
              <div className="movie-form-poster-preview">
                <ContentImage
                  src={`https://image.tmdb.org/t/p/w300${selectedItem.poster_path}`}
                  alt={`Poster de ${selectedItem.title || selectedItem.name}`}
                  aspectRatio="2:3"
                  className="movie-form-poster-large"
                />
              </div>
            )}

            {/* Estados de éxito y error */}
            {formSuccess && (
              <Card variant="outlined" className="movie-form-success-message">
                <p>✅ ¡Película guardada exitosamente!</p>
              </Card>
            )}

            {error && (
              <Card variant="outlined" className="movie-form-error-message">
                <p>❌ {error}</p>
              </Card>
            )}

            {/* Formulario dinámico */}
            <DynamicForm
              fields={movieFormFields}
              onSubmit={handleFormSubmit}
              loading={formLoading}
              disabled={formLoading}
              columnsPerRow={2}
              tabletColumns={1}
              mobileColumns={1}
              fieldSize="md"
              fieldRounded="md"
              submitVariant="success"
              submitSize="lg"
              submitText={formLoading ? "Guardando..." : "💾 Guardar Película"}
              initialData={selectedItem ? {
                title: selectedItem.title || selectedItem.name || "",
                year: (selectedItem.release_date || selectedItem.first_air_date || "").slice(0, 4),
                overview: selectedItem.overview || "",
                poster: selectedItem.poster_path ? `https://image.tmdb.org/t/p/w300${selectedItem.poster_path}` : "",
                rating: selectedItem.vote_average ? selectedItem.vote_average.toString() : ""
              } : {}}
            />

            {/* Botones de acción */}
            <div className="movie-form-actions">
              <Button
                onClick={() => setCurrentView("search")}
                variant="outline"
                text="Cancelar"
                disabled={formLoading}
                className="movie-form-cancel-button"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export { MovieCreateForm };