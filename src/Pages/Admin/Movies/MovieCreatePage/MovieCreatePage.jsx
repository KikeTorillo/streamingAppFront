// ===== MOVIE CREATE PAGE - ADAPTADO AL SISTEMA DE DISEÑO =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import { TextInput } from '../../../../components/molecules/TextInput/TextInput';
import { TextSelect } from '../../../../components/molecules/TextSelect/TextSelect';
import './MovieCreatePage.css';

// Importar servicio para crear películas (debes crear este servicio)
// import { createMovieService } from '../../../../services/Movies/createMovieService';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - ADAPTADO AL SISTEMA DE DISEÑO DEL ADMIN PANEL
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ PATRÓN: Exactamente igual que CategoryCreatePage/UserCreatePage
 * ✅ COMPONENTES: AdminLayout + DynamicForm + Card + Button + TextInput + TextSelect
 * ✅ NAVEGACIÓN: Integrado con sidebar y breadcrumbs automáticos
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ ESTILOS: Variables CSS del sistema (app.css)
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
  
  // Estados específicos de búsqueda TMDB
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  // ===== CONFIGURACIÓN DE OPCIONES =====
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
    { value: "thriller", label: "Thriller" },
    { value: "animacion", label: "Animación" },
    { value: "documental", label: "Documental" }
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
      helperText: 'Título original o en español',
      width: 'half'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      helperText: 'Año de lanzamiento',
      width: 'half'
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo',
      required: true,
      leftIcon: '🎭',
      options: typeOptions,
      helperText: 'Selecciona el tipo de contenido',
      width: 'half'
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      leftIcon: '🏷️',
      options: categoryOptions,
      helperText: 'Género principal',
      width: 'half'
    },
    {
      name: 'overview',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Breve descripción de la película o serie',
      required: true,
      leftIcon: '📝',
      helperText: 'Resumen del contenido (máx. 500 caracteres)',
      width: 'full'
    },
    {
      name: 'poster',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://image.tmdb.org/t/p/w500/...',
      required: false,
      leftIcon: '🖼️',
      helperText: 'URL de la imagen del poster',
      width: 'half'
    },
    {
      name: 'backdrop',
      type: 'url',
      label: 'URL del Fondo',
      placeholder: 'https://image.tmdb.org/t/p/original/...',
      required: false,
      leftIcon: '🎨',
      helperText: 'URL de la imagen de fondo',
      width: 'half'
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Calificación',
      placeholder: '8.5',
      required: false,
      leftIcon: '⭐',
      helperText: 'Calificación del 1 al 10',
      width: 'half',
      min: 0,
      max: 10,
      step: 0.1
    }
  ];

  // Datos iniciales del formulario
  const initialData = {
    title: '',
    year: new Date().getFullYear(),
    type: 'movie',
    category: '',
    overview: '',
    poster: '',
    backdrop: '',
    rating: ''
  };

  // ===== FUNCIONES DE BÚSQUEDA TMDB =====
  const searchTMDB = async (query) => {
    if (!query.trim() || !API_KEY) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-MX`
      );

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtrar solo películas y series con poster
      const filteredResults = data.results
        .filter(item => 
          (item.media_type === 'movie' || item.media_type === 'tv') && 
          item.poster_path
        )
        .map(item => ({
          id: item.id,
          title: item.title || item.name,
          year: item.release_date ? new Date(item.release_date).getFullYear() : 
                (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A'),
          type: item.media_type === 'tv' ? 'serie' : 'película',
          overview: item.overview,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
          backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '',
          rating: item.vote_average || 0,
          originalType: item.media_type
        }));

      // Aplicar ordenamiento
      const sortedResults = sortResults(filteredResults, sortBy);
      setResults(sortedResults);

    } catch (err) {
      console.error('Error en búsqueda TMDB:', err);
      setError('Error al buscar en TMDB. Verifica tu conexión e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (results, sortType) => {
    return [...results].sort((a, b) => {
      switch (sortType) {
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  };

  // ===== HANDLERS =====
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchTMDB(searchQuery);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (results.length > 0) {
      const sortedResults = sortResults(results, value);
      setResults(sortedResults);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setCurrentView("form");
  };

  const handleBackToSearch = () => {
    setCurrentView("search");
    setSelectedItem(null);
    setError(null);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres salir?\n\nSe perderán todos los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }
    navigate('/admin/movies');
  };

  const handleViewTMDB = () => {
    window.open('https://www.themoviedb.org/', '_blank');
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (formData) => {
    console.log('[MovieCreate] Datos enviados:', formData);
    
    setFormLoading(true);
    setError(null);

    try {
      // Aquí integrarías con tu servicio backend
      // const result = await createMovieService(formData);
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('[MovieCreate] Película/Serie creada exitosamente');
      
      setSuccess(true);
      setHasChanges(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 2000);
      
    } catch (err) {
      console.error('[MovieCreate] Error:', err);
      setError('Error al crear la película/serie. Intenta nuevamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (formData) => {
    const hasDataChanges = Object.keys(formData).some(key => 
      formData[key] !== initialData[key]
    );
    
    setHasChanges(hasDataChanges);
    
    if (error) {
      setError(null);
    }
  };

  // Preparar datos iniciales si hay item seleccionado
  const getInitialFormData = () => {
    if (selectedItem) {
      return {
        title: selectedItem.title,
        year: selectedItem.year,
        type: selectedItem.originalType === 'tv' ? 'tv' : 'movie',
        category: '',
        overview: selectedItem.overview,
        poster: selectedItem.poster,
        backdrop: selectedItem.backdrop,
        rating: selectedItem.rating
      };
    }
    return initialData;
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Agregar Película o Serie"
      subtitle="Busca en TMDB o agrega manualmente el contenido"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Películas', href: '/admin/movies' },
        { label: 'Agregar Contenido' }
      ]}
      headerActions={
        <div className="movie-create__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTMDB}
            leftIcon="🌐"
          >
            Abrir TMDB
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            leftIcon="←"
            disabled={formLoading}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="movie-create">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="movie-create__success">
            <div className="movie-create__success-icon">✅</div>
            <div className="movie-create__success-content">
              <h3>¡Contenido agregado exitosamente!</h3>
              <p>La película/serie ya está disponible en el catálogo.</p>
            </div>
            <span className="movie-create__success-redirect">
              Redirigiendo...
            </span>
          </div>
        )}

        {error && (
          <div className="movie-create__error">
            <div className="movie-create__error-icon">⚠️</div>
            <div className="movie-create__error-content">
              <h4>Error al procesar</h4>
              <p>{error}</p>
            </div>
            <button
              className="movie-create__error-close"
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}

        {/* ===== VISTA DE BÚSQUEDA ===== */}
        {currentView === "search" && (
          <div className="movie-create__search-section">
            
            {/* Formulario de búsqueda - USANDO SISTEMA DE DISEÑO */}
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Buscar en TMDB</h2>
                <p className="form-description">
                  Busca películas y series en la base de datos de The Movie Database para importar información automáticamente.
                </p>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="movie-create__search-form">
                <div className="movie-create__search-inputs">
                  <TextInput
                    label="Buscar película o serie"
                    placeholder="Ej: Spider-Man, Breaking Bad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon="🔍"
                    size="md"
                    disabled={loading}
                    className="movie-create__search-input"
                  />
                  <TextSelect
                    label="Ordenar por"
                    value={sortBy}
                    onChange={handleSortChange}
                    options={sortOptions}
                    leftIcon="🔄"
                    size="md"
                    disabled={loading}
                    className="movie-create__sort-select"
                  />
                </div>
                <div className="movie-create__search-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    disabled={!searchQuery.trim()}
                    leftIcon="🔍"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setCurrentView("form")}
                    leftIcon="✏️"
                  >
                    Crear Manualmente
                  </Button>
                </div>
              </form>
            </div>

            {/* Resultados de búsqueda - USANDO SISTEMA DE DISEÑO */}
            {results.length > 0 && (
              <div className="form-container">
                <div className="form-header">
                  <h3 className="form-title">Resultados Encontrados ({results.length})</h3>
                  <p className="form-description">
                    Selecciona el contenido que deseas agregar. La información se importará automáticamente.
                  </p>
                </div>
                
                <div className="movie-create__results-grid">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="movie-create__result-item"
                      onClick={() => handleSelectItem(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectItem(item);
                        }
                      }}
                    >
                      <ContentImage
                        src={item.poster}
                        alt={item.title}
                        className="movie-create__result-poster"
                        fallbackIcon="🎬"
                      />
                      <div className="movie-create__result-info">
                        <h4 className="movie-create__result-title">{item.title}</h4>
                        <p className="movie-create__result-meta">
                          {item.type} • {item.year} • ⭐ {item.rating.toFixed(1)}
                        </p>
                        <p className="movie-create__result-overview">
                          {item.overview ? 
                            (item.overview.length > 100 ? 
                              `${item.overview.substring(0, 100)}...` : 
                              item.overview
                            ) : 
                            'Sin descripción disponible'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Información sobre TMDB - USANDO SISTEMA DE DISEÑO */}
            <div className="info-section info-section--tertiary">
              <h4 className="info-title">ℹ️ Sobre la búsqueda en TMDB</h4>
              <ul className="info-list">
                <li><strong>Base de datos:</strong> The Movie Database es una fuente confiable de información cinematográfica</li>
                <li><strong>Contenido:</strong> Incluye películas, series, cast, crew y metadatos actualizados</li>
                <li><strong>Idioma:</strong> Los resultados se muestran en español cuando está disponible</li>
                <li><strong>Alternativa:</strong> Si no encuentras el contenido, puedes crearlo manualmente</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== VISTA DE FORMULARIO ===== */}
        {currentView === "form" && (
          <div className="movie-create__form-section">
            
            {/* Vista previa del item seleccionado - USANDO SISTEMA DE DISEÑO */}
            {selectedItem && (
              <div className="info-section info-section--primary">
                <div className="movie-create__preview-header">
                  <h3 className="info-title">Vista Previa de TMDB</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToSearch}
                    leftIcon="←"
                  >
                    Volver a Búsqueda
                  </Button>
                </div>
                <div className="movie-create__preview">
                  <ContentImage
                    src={selectedItem.poster}
                    alt={selectedItem.title}
                    className="movie-create__preview-poster"
                    fallbackIcon="🎬"
                  />
                  <div className="movie-create__preview-info">
                    <h3>{selectedItem.title}</h3>
                    <p>{selectedItem.type} • {selectedItem.year} • ⭐ {selectedItem.rating.toFixed(1)}</p>
                    <p className="movie-create__preview-overview">
                      {selectedItem.overview || 'Sin descripción disponible'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario principal - USANDO SISTEMA DE DISEÑO */}
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">
                  {selectedItem ? 'Confirmar Información' : 'Información del Contenido'}
                </h2>
                <p className="form-description">
                  {selectedItem ? 
                    'Revisa y completa los datos obtenidos de TMDB. Los campos se rellenan automáticamente pero puedes modificarlos.' :
                    'Completa los campos requeridos para agregar el contenido manualmente al catálogo.'
                  }
                </p>
              </div>

              <DynamicForm
                id="movie-create-form"
                fields={movieFormFields}
                initialData={getInitialFormData()}
                onSubmit={handleSubmit}
                onChange={handleFormChange}
                loading={formLoading}
                disabled={formLoading || success}
                columnsPerRow={2}
                tabletColumns={1}
                mobileColumns={1}
                fieldSize="md"
                fieldRounded="md"
                submitText={formLoading ? "Creando..." : "Crear Contenido"}
                submitVariant="primary"
                submitSize="md"
                submitIcon="➕"
                validateOnBlur={true}
                validateOnChange={false}
                showSubmit={!success}
                className={`movie-create__form ${success ? 'movie-create__form--success' : ''}`}
              />
            </div>
            
            {/* Información adicional - USANDO SISTEMA DE DISEÑO */}
            <div className="info-grid info-grid--2">
              <div className="info-section">
                <h4 className="info-title">📋 Tipos de Contenido</h4>
                <ul className="info-list">
                  <li><strong>Película:</strong> Contenido cinematográfico de duración estándar</li>
                  <li><strong>Serie:</strong> Contenido episódico o por temporadas</li>
                </ul>
              </div>
              <div className="info-section">
                <h4 className="info-title">🎭 Categorías Disponibles</h4>
                <ul className="info-list">
                  <li><strong>Géneros:</strong> Acción, Drama, Comedia, Terror, Sci-Fi</li>
                  <li><strong>Especiales:</strong> Animación, Documental, Romance</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export { MovieCreatePage };