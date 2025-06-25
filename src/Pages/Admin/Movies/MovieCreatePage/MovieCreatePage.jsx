// ===== MOVIE CREATE PAGE - USO CORRECTO DEL TMDBSEARCHVIEW =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Button } from '../../../../components/atoms/Button/Button';
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';
import './MovieCreatePage.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - USO CORRECTO Y SEGURO DEL TMDBSEARCHVIEW
 * 
 * ✅ PROPS CORRECTOS: Todos los props necesarios se pasan correctamente
 * ✅ MANEJO DE ERRORES: Try-catch en todos los handlers
 * ✅ VALIDACIONES: Verificaciones antes de usar datos
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [currentView, setCurrentView] = useState("search");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados de búsqueda TMDB
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  // ===== CONFIGURACIÓN =====
  const sortOptions = [
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ];

  const typeOptions = [
    { value: "movie", label: "Película" },
    { value: "tv", label: "Serie" }
  ];

  const categoryOptions = [
    { value: "accion", label: "Acción" },
    { value: "aventura", label: "Aventura" },
    { value: "comedia", label: "Comedia" },
    { value: "drama", label: "Drama" },
    { value: "terror", label: "Terror" },
    { value: "ciencia-ficcion", label: "Ciencia Ficción" },
    { value: "romance", label: "Romance" },
    { value: "animacion", label: "Animación" },
    { value: "documental", label: "Documental" },
    { value: "musical", label: "Musical" }
  ];

  const movieFormFields = [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      placeholder: 'Nombre del contenido',
      required: true,
      leftIcon: '🎬'
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo',
      required: true,
      options: typeOptions,
      leftIcon: '📽️'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Descripción del contenido...',
      required: true,
      leftIcon: '📝',
      rows: 4
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      required: true,
      options: categoryOptions,
      leftIcon: '🎭'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      min: 1900,
      max: new Date().getFullYear() + 5
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duración (minutos)',
      placeholder: '120',
      required: true,
      leftIcon: '⏱️',
      min: 1,
      max: 600
    },
    {
      name: 'posterUrl',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://ejemplo.com/poster.jpg',
      required: false,
      leftIcon: '🖼️'
    },
    {
      name: 'videoUrl',
      type: 'url',
      label: 'URL del Video',
      placeholder: 'https://ejemplo.com/video.mp4',
      required: true,
      leftIcon: '🎥'
    }
  ];

  // ===== HANDLERS DE BÚSQUEDA TMDB (SEGUROS) =====
  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setError("Por favor ingresa un término de búsqueda");
      return;
    }

    if (!API_KEY) {
      setError("API key de TMDB no configurada");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery.trim())}&language=es-ES&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.results && Array.isArray(data.results)) {
        const processedResults = data.results
          .filter(item => item && (item.media_type === 'movie' || item.media_type === 'tv'))
          .map(item => ({
            id: item.id || Math.random(),
            title: item.title || item.name || 'Sin título',
            type: item.media_type || 'unknown',
            year: item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A',
            rating: item.vote_average || 0,
            overview: item.overview || '',
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null
          }))
          .sort((a, b) => {
            switch (sortBy) {
              case 'year-desc':
                return parseInt(b.year) - parseInt(a.year);
              case 'year-asc':
                return parseInt(a.year) - parseInt(b.year);
              case 'rating-desc':
                return b.rating - a.rating;
              default:
                return 0;
            }
          });

        setResults(processedResults);
        
        if (processedResults.length === 0) {
          setError("No se encontraron resultados para tu búsqueda");
        }
      } else {
        setResults([]);
        setError("No se encontraron resultados para tu búsqueda");
      }
    } catch (error) {
      console.error('Error en búsqueda TMDB:', error);
      setError("Error al conectar con TMDB. Verifica tu conexión e intenta de nuevo.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLERS SEGUROS =====
  const handleSearchQueryChange = (value) => {
    try {
      setSearchQuery(value || "");
      setError(null);
    } catch (error) {
      console.error('Error changing search query:', error);
    }
  };

  const handleSortChange = (value) => {
    try {
      setSortBy(value || "year-desc");
    } catch (error) {
      console.error('Error changing sort:', error);
    }
  };

  const handleClearResults = () => {
    try {
      setResults([]);
      setSearchQuery("");
      setError(null);
    } catch (error) {
      console.error('Error clearing results:', error);
    }
  };

  const handleSelectItem = (item) => {
    try {
      if (item && typeof item === 'object') {
        setSelectedItem(item);
        setError(null);
        setCurrentView("form");
      }
    } catch (error) {
      console.error('Error selecting item:', error);
      setError("Error al seleccionar el item");
    }
  };

  const handleGoToForm = () => {
    try {
      setCurrentView("form");
    } catch (error) {
      console.error('Error going to form:', error);
    }
  };

  const handleBackToSearch = () => {
    try {
      setCurrentView("search");
    } catch (error) {
      console.error('Error going back to search:', error);
    }
  };

  const handleGoBack = () => {
    try {
      if (hasChanges) {
        const confirmLeave = window.confirm(
          "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
        );
        if (!confirmLeave) return;
      }
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error going back:', error);
      navigate('/admin/movies'); // Fallback
    }
  };

  // ===== HANDLERS DEL FORMULARIO =====
  const getInitialFormData = () => {
    try {
      if (selectedItem && typeof selectedItem === 'object') {
        return {
          title: selectedItem.title || '',
          type: selectedItem.type === 'tv' ? 'tv' : 'movie',
          description: selectedItem.overview || '',
          year: parseInt(selectedItem.year) || new Date().getFullYear(),
          posterUrl: selectedItem.poster || '',
          categoryId: '',
          duration: selectedItem.type === 'movie' ? 120 : 45,
          videoUrl: ''
        };
      }
      return {};
    } catch (error) {
      console.error('Error getting initial form data:', error);
      return {};
    }
  };

  const handleFormChange = (formData) => {
    try {
      setHasChanges(true);
      setError(null);
    } catch (error) {
      console.error('Error in form change:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      console.log('Datos del formulario:', formData);
      
      // TODO: Implementar createMovieService
      // const result = await createMovieService(formData);
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setHasChanges(false);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 3000);
      
    } catch (error) {
      console.error('Error al crear película:', error);
      setError(error.message || "Error al crear el contenido. Intenta de nuevo.");
    } finally {
      setFormLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Contenido"
      breadcrumbs={[
        { label: "Panel Admin", path: "/admin" },
        { label: "Películas", path: "/admin/movies" },
        { label: "Crear", path: "/admin/movies/create" }
      ]}
      headerActions={
        <div className="movie-create__header-actions">
          <Button
            variant={currentView === "search" ? "primary" : "outline"}
            size="sm"
            onClick={() => setCurrentView("search")}
            leftIcon="🔍"
            disabled={formLoading}
          >
            Buscar TMDB
          </Button>
          
          <Button
            variant={currentView === "form" ? "primary" : "outline"}
            size="sm"
            onClick={handleGoToForm}
            leftIcon="📝"
            disabled={formLoading}
          >
            Formulario
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            leftIcon="←"
            disabled={formLoading}
          >
            Volver
          </Button>
        </div>
      }
    >
      <div className="movie-create">
        
        {/* ===== MENSAJES DE ESTADO ===== */}
        {error && (
          <div className="movie-create__error">
            <span className="movie-create__error-icon">⚠️</span>
            <div className="movie-create__error-content">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
            <button
              className="movie-create__error-close"
              onClick={() => setError(null)}
              aria-label="Cerrar error"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="movie-create__success">
            <span className="movie-create__success-icon">✅</span>
            <div className="movie-create__success-content">
              <h3>¡Contenido creado exitosamente!</h3>
              <p>El contenido ha sido agregado al catálogo correctamente.</p>
              <div className="movie-create__success-redirect">
                Redirigiendo al listado en 3 segundos...
              </div>
            </div>
          </div>
        )}

        {/* ===== VISTA DE BÚSQUEDA TMDB ===== */}
        {currentView === "search" && (
          <TMDBSearchView
            // Estados de búsqueda - TODOS LOS PROPS NECESARIOS
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchQueryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            results={results}
            loading={loading}
            
            // Configuración específica
            contentType="all"
            title="🎬 Buscar Películas y Series"
            placeholder="Ej: Avatar, Breaking Bad, Inception..."
            helperText="Busca por título, año o palabras clave"
            showManualCreate={true}
            
            // Opciones
            sortOptions={sortOptions}
            
            // Handlers - TODOS DEFINIDOS
            onSearch={handleSearch}
            onClearResults={handleClearResults}
            onSelectItem={handleSelectItem}
            onManualCreate={handleGoToForm}
            
            // Estados adicionales
            error={error}
          />
        )}

        {/* ===== VISTA DE FORMULARIO ===== */}
        {currentView === "form" && (
          <MovieFormView
            selectedItem={selectedItem}
            formFields={movieFormFields}
            initialFormData={getInitialFormData()}
            formLoading={formLoading}
            success={success}
            hasChanges={hasChanges}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onBackToSearch={handleBackToSearch}
            typeOptions={typeOptions}
            categoryOptions={categoryOptions}
            showBackButton={selectedItem !== null}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export { MovieCreatePage };