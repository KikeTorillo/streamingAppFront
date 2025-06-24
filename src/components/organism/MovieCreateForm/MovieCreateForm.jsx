// components/organism/MovieCreateForm/MovieCreateForm.jsx
import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import { TextInput } from '../../molecules/TextInput/TextInput'; // ← NUEVA IMPORTACIÓN
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
 * ✅ COMPONENTES: DynamicForm + TextInput + Button + Card + ContentImage
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
      label: 'Año',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      helperText: 'Año de lanzamiento'
    },
    {
      name: 'overview',
      type: 'text',
      label: 'Descripción',
      placeholder: 'Breve descripción de la película o serie',
      required: true,
      leftIcon: '📝',
      helperText: 'Resumen del contenido'
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
      name: 'rating',
      type: 'number',
      label: 'Puntuación',
      placeholder: '8.5',
      leftIcon: '⭐',
      helperText: 'Puntuación del 1 al 10'
    },
    {
      name: 'category',
      type: 'text',
      label: 'Categoría',
      placeholder: 'Acción, Drama, Comedia...',
      leftIcon: '🎭',
      helperText: 'Género principal'
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo',
      placeholder: 'Selecciona el tipo',
      leftIcon: '🎬',
      options: [
        { value: 'movie', label: 'Película' },
        { value: 'series', label: 'Serie' }
      ],
      required: true,
      helperText: 'Tipo de contenido'
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      placeholder: 'Selecciona el estado',
      leftIcon: '📊',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ],
      required: true,
      helperText: 'Estado de publicación'
    }
  ];

  // ===== FUNCIONES DE API =====
  const searchTMDB = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-MX`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.results) {
        const sortedResults = sortResults(data.results, sortBy);
        setResults(sortedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error searching TMDB:', err);
      setError(`Error en la búsqueda: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (results, sortBy) => {
    const sorted = [...results];
    
    switch (sortBy) {
      case "year-desc":
        return sorted.sort((a, b) => {
          const yearA = (a.release_date || a.first_air_date || "").slice(0, 4);
          const yearB = (b.release_date || b.first_air_date || "").slice(0, 4);
          return yearB.localeCompare(yearA);
        });
      case "year-asc":
        return sorted.sort((a, b) => {
          const yearA = (a.release_date || a.first_air_date || "").slice(0, 4);
          const yearB = (b.release_date || b.first_air_date || "").slice(0, 4);
          return yearA.localeCompare(yearB);
        });
      case "rating-desc":
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      default:
        return sorted;
    }
  };

  // ===== HANDLERS =====
  const handleSearch = () => {
    searchTMDB(searchQuery);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setCurrentView("form");
    setError(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Datos del formulario:', formData);
      
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setCurrentView("search");
        setSelectedItem(null);
      }, 3000);
      
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // ===== EFECTOS =====
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchTMDB(searchQuery);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (results.length > 0) {
      const sortedResults = sortResults(results, sortBy);
      setResults(sortedResults);
    }
  }, [sortBy]);

  return (
    <div className="movie-form-container">
      {/* Header */}
      <div className="movie-form-header">
        <h1 className="movie-form-title">
          🎬 Agregar Película o Serie
        </h1>
        <p className="movie-form-subtitle">
          Busca en TMDB o agrega manualmente
        </p>
      </div>

      {/* Navegación */}
      <div className="movie-form-navigation">
        <Button
          onClick={() => setCurrentView("search")}
          variant={currentView === "search" ? "primary" : "outline"}
          text="🔍 Buscar en TMDB"
          size="md"
          className="movie-form-nav-button"
        />
        <Button
          onClick={() => setCurrentView("form")}
          variant={currentView === "form" ? "primary" : "outline"}
          text="✏️ Agregar Manualmente"
          size="md"
          className="movie-form-nav-button"
        />
      </div>

      {/* Vista de búsqueda */}
      {currentView === "search" && (
        <div className="movie-form-search-view">
          <Card variant="outlined" className="movie-form-search-controls">
            <div className="movie-form-search-inputs">
              {/* ✅ SUSTITUIDO: input nativo → TextInput del sistema */}
              <div className="movie-form-search-input-wrapper">
                <TextInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar películas o series en TMDB..."
                  leftIcon="🔍"
                  rightIcon={loading ? "⏳" : "🎬"}
                  size="md"
                  fullWidth
                  rounded="md"
                  helperText={results.length > 0 ? `${results.length} resultados encontrados` : "Escribe para buscar en la base de datos de TMDB"}
                  onRightIconClick={handleSearch}
                  disabled={loading}
                />
              </div>
              
              {/* Select de ordenamiento (por ahora mantener nativo, después sustituir) */}
              <div className="movie-form-sort-wrapper">
                <select
                  className="movie-form-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={loading || results.length === 0}
                >
                  <option value="year-desc">Más recientes</option>
                  <option value="year-asc">Más antiguos</option>
                  <option value="rating-desc">Mejor puntuados</option>
                </select>
              </div>
            </div>

            {/* Botón de búsqueda */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Button
                onClick={handleSearch}
                variant="primary"
                text={loading ? "Buscando..." : "🔍 Buscar"}
                disabled={!searchQuery.trim() || loading}
                loading={loading}
                size="md"
              />
            </div>
          </Card>

          {/* Estados de loading y error */}
          {loading && (
            <Card variant="outlined" className="movie-form-loading">
              <div className="movie-form-spinner"></div>
              <p>Buscando en TMDB...</p>
            </Card>
          )}

          {error && (
            <Card variant="outlined" className="movie-form-error-message">
              <p>❌ {error}</p>
            </Card>
          )}

          {/* Resultados de búsqueda */}
          {results.length > 0 && !loading && (
            <div className="movie-form-results-grid">
              {results.map((item) => (
                <Card
                  key={item.id}
                  variant="elevated"
                  className="movie-form-result-card"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="movie-form-result-poster">
                    <ContentImage
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null}
                      alt={`Poster de ${item.title || item.name}`}
                      aspectRatio="2:3"
                      className="movie-form-result-image"
                    />
                  </div>
                  <div className="movie-form-result-info">
                    <h3 className="movie-form-result-title">
                      {item.title || item.name}
                    </h3>
                    <p className="movie-form-result-year">
                      {(item.release_date || item.first_air_date || "").slice(0, 4)}
                    </p>
                    <p className="movie-form-result-rating">
                      ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                    </p>
                    <p className="movie-form-result-overview">
                      {item.overview ? item.overview.slice(0, 150) + '...' : 'Sin descripción disponible'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No hay resultados */}
          {!loading && searchQuery && results.length === 0 && (
            <Card variant="outlined" className="movie-form-no-results">
              <p>🔍 No se encontraron resultados para "{searchQuery}"</p>
              <p>Intenta con otro término de búsqueda</p>
            </Card>
          )}
        </div>
      )}

      {/* Vista de formulario */}
      {currentView === "form" && (
        <div className="movie-form-form-view">
          <Card variant="elevated" className="movie-form-form-card">
            {/* Header del formulario */}
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