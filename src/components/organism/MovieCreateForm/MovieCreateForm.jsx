// components/organism/MovieCreateForm/MovieCreateForm.jsx
import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { TextSelect } from '../../molecules/TextSelect/TextSelect';
import { ContentCard } from '../../molecules/ContentCard/ContentCard';
import { Badge } from '../../atoms/Badge/Badge'; // ← NUEVA IMPORTACIÓN
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
 * ✅ COMPONENTES: DynamicForm + TextInput + TextSelect + ContentCard + Badge + Button + Card + ContentImage
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

  // ===== CONFIGURACIÓN DE OPCIONES PARA TEXTSELECT =====
  const sortOptions = [
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ];

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

  // ===== FUNCIÓN PARA TRANSFORMAR DATOS DE TMDB A FORMATO CONTENTCARD =====
  const transformTMDBToContentCard = (item) => {
    // Determinar el tipo basado en media_type o si tiene title/name
    const type = item.media_type === 'tv' || item.name ? 'series' : 'movie';
    
    // Obtener el año de lanzamiento
    const releaseDate = item.release_date || item.first_air_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
    
    // Obtener categoría principal de los géneros (simplificado para el ejemplo)
    const getMainCategory = (genreIds) => {
      const genreMap = {
        28: 'Acción', 35: 'Comedia', 18: 'Drama', 27: 'Terror',
        10749: 'Romance', 878: 'Ciencia Ficción', 53: 'Thriller',
        16: 'Animación', 99: 'Documental', 10751: 'Familiar'
      };
      return genreIds && genreIds.length > 0 ? genreMap[genreIds[0]] || 'Entretenimiento' : 'General';
    };

    return {
      id: item.id,
      title: item.title || item.name,
      cover: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
      category: getMainCategory(item.genre_ids),
      year: year,
      rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
      type: type,
      // Para películas, podríamos estimar duración, pero TMDB search no la incluye
      // Para series, podríamos estimar temporadas, pero tampoco está en search
      overview: item.overview,
      // Datos originales para usar en el formulario
      _original: item
    };
  };

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
        // Transformar los resultados de TMDB al formato ContentCard
        const transformedResults = data.results
          .filter(item => item.poster_path) // Solo mostrar elementos con poster
          .map(transformTMDBToContentCard);
        
        const sortedResults = sortResults(transformedResults, sortBy);
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
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case "year-asc":
        return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
      case "rating-desc":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  // ===== HANDLERS =====
  const handleSearch = () => {
    searchTMDB(searchQuery);
  };

  const handleSelectItem = (contentCardData) => {
    // Usar los datos originales de TMDB para el formulario
    const originalItem = contentCardData._original;
    setSelectedItem(originalItem);
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
              {/* ✅ TextInput del sistema */}
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
              
              {/* ✅ TextSelect del sistema */}
              <div className="movie-form-sort-wrapper">
                <TextSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  placeholder="Ordenar por..."
                  leftIcon="🔄"
                  size="md"
                  rounded="md"
                  disabled={loading || results.length === 0}
                  helperText="Cambia el orden de los resultados"
                />
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

          {/* ✅ SUSTITUIDO: Estados de loading → Badge con loading */}
          {loading && (
            <div className="movie-form-loading-container" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: 'var(--space-xl)' 
            }}>
              <Badge 
                variant="primary" 
                size="lg"
                loading={true}
                icon="🔍"
                style="soft"
              >
                Buscando en TMDB...
              </Badge>
            </div>
          )}

          {/* ✅ SUSTITUIDO: Mensaje de error → Badge danger */}
          {error && (
            <div className="movie-form-error-container" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: 'var(--space-lg)' 
            }}>
              <Badge 
                variant="danger" 
                size="lg"
                icon="❌"
                style="soft"
              >
                {error}
              </Badge>
            </div>
          )}

          {/* ✅ ContentCard del sistema */}
          {results.length > 0 && !loading && (
            <div className="movie-form-results-grid">
              {results.map((contentData) => (
                <ContentCard
                  key={contentData.id}
                  content={contentData}
                  onClick={handleSelectItem}
                  size="md"
                  variant="elevated"
                  rounded="lg"
                  showRating={true}
                  showMeta={true}
                  showCategory={true}
                  className="movie-form-content-card"
                />
              ))}
            </div>
          )}

          {/* ✅ SUSTITUIDO: Sin resultados → Badge info */}
          {!loading && searchQuery && results.length === 0 && !error && (
            <div className="movie-form-no-results-container" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 'var(--space-md)',
              padding: 'var(--space-xl)' 
            }}>
              <Badge 
                variant="info" 
                size="lg"
                icon="🔍"
                style="soft"
              >
                No se encontraron resultados para "{searchQuery}"
              </Badge>
              <Badge 
                variant="neutral" 
                size="md"
                icon="💡"
                style="outline"
              >
                Intenta con otro término de búsqueda
              </Badge>
            </div>
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

            {/* ✅ SUSTITUIDO: Mensaje de éxito → Badge success */}
            {formSuccess && (
              <div className="movie-form-success-container" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: 'var(--space-lg)' 
              }}>
                <Badge 
                  variant="success" 
                  size="xl"
                  icon="✅"
                  style="soft"
                  pulse={true}
                >
                  ¡Película guardada exitosamente!
                </Badge>
              </div>
            )}

            {/* ✅ SUSTITUIDO: Mensaje de error del formulario → Badge danger */}
            {error && !loading && (
              <div className="movie-form-form-error-container" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: 'var(--space-lg)' 
              }}>
                <Badge 
                  variant="danger" 
                  size="lg"
                  icon="❌"
                  style="soft"
                >
                  {error}
                </Badge>
              </div>
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