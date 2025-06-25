// ===== MOVIE CREATE PAGE - HOMOLOGADO CON SISTEMA DE DISEÑO =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Button } from '../../../../components/atoms/Button/Button';
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';
import './MovieCreatePage.css';

// Importar servicios
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
// import { createMovieService } from '../../../../services/Movies/createMovieService'; // Para implementar

// Configuración de TMDB API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend de películas
 * ✅ VALIDACIONES: Según esquemas del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ ESTILO: Usa clases del sistema de diseño centralizado
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que CategoryCreatePage y UserCreatePage
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState("search"); // "search" | "form"
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // ===== ESTADOS DE BÚSQUEDA TMDB =====
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  // ===== ESTADOS DE DATOS =====
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ===== CONFIGURACIÓN =====
  const sortOptions = [
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguas" },
    { value: "title-asc", label: "A-Z" },
    { value: "title-desc", label: "Z-A" },
    { value: "popularity-desc", label: "Más populares" }
  ];

  const typeOptions = [
    { value: '', label: 'Selecciona un tipo' },
    { value: 'movie', label: '🎬 Película' },
    { value: 'tv', label: '📺 Serie' }
  ];

  /**
   * ✅ CAMPOS según schema del backend de películas
   */
  const movieFormFields = [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      placeholder: 'Ej: Avengers: Endgame',
      required: true,
      leftIcon: '🎬',
      helperText: 'Título original del contenido',
      width: 'full'
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo de Contenido',
      required: true,
      leftIcon: '🎭',
      helperText: 'Película o serie de TV',
      options: typeOptions,
      width: 'half'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año de Lanzamiento',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      helperText: 'Año de estreno o lanzamiento',
      width: 'half',
      min: 1900,
      max: new Date().getFullYear() + 5
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Sinopsis o descripción del contenido...',
      required: true,
      leftIcon: '📝',
      helperText: 'Resumen del argumento o contenido',
      width: 'full',
      rows: 4
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      required: true,
      leftIcon: '🎭',
      helperText: 'Género o categoría del contenido',
      options: [
        { value: '', label: 'Selecciona una categoría' },
        ...categories.map(cat => ({
          value: cat.id,
          label: `${cat.name}`
        }))
      ],
      width: 'half'
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duración (minutos)',
      placeholder: '120',
      required: true,
      leftIcon: '⏱️',
      helperText: 'Duración en minutos (películas) o por episodio (series)',
      width: 'half',
      min: 1,
      max: 600
    },
    {
      name: 'posterUrl',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://image.tmdb.org/t/p/w500/...',
      required: false,
      leftIcon: '🖼️',
      helperText: 'URL de la imagen del poster (opcional)',
      width: 'full'
    },
    {
      name: 'videoUrl',
      type: 'url',
      label: 'URL del Video',
      placeholder: 'https://ejemplo.com/video.mp4',
      required: true,
      leftIcon: '🎥',
      helperText: 'URL del archivo de video o stream',
      width: 'full'
    }
  ];

  /**
   * ✅ Datos iniciales del formulario
   */
  const initialData = {
    title: '',
    type: '',
    year: new Date().getFullYear(),
    description: '',
    categoryId: '',
    duration: '',
    posterUrl: '',
    videoUrl: ''
  };

  // ===== EFECTOS =====
  
  /**
   * ✅ Cargar categorías al montar el componente
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getCategoriesService();
        
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Error al cargar las categorías');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ===== FUNCIONES DE BÚSQUEDA TMDB =====

  /**
   * ✅ Realizar búsqueda en TMDB
   */
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=es-ES`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results) {
        // Procesar y formatear los resultados
        const formattedResults = data.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .map(item => ({
            id: item.id,
            title: item.title || item.name,
            type: item.media_type,
            year: item.release_date ? new Date(item.release_date).getFullYear() : 
                  item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
            overview: item.overview,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            popularity: item.popularity || 0
          }));

        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error en búsqueda TMDB:', error);
      setError("Error al buscar en TMDB. Verifica tu conexión e intenta de nuevo.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Handler para cambios en el input de búsqueda
   */
  const handleSearchQueryChange = (value) => {
    setSearchQuery(value);
    setError(null);
  };

  /**
   * ✅ Handler para cambios en el orden
   */
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // ===== HANDLERS DE NAVEGACIÓN =====

  const handleClearResults = () => {
    setResults([]);
    setSearchQuery("");
    setError(null);
  };

  const handleSelectItem = (item) => {
    if (item && typeof item === 'object') {
      setSelectedItem(item);
      setError(null);
      setCurrentView("form");
    }
  };

  const handleGoToForm = () => {
    setSelectedItem(null);
    setCurrentView("form");
  };

  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres volver a la búsqueda?\n\n" +
        "Se perderán los cambios no guardados."
      );
      if (!confirmLeave) return;
    }
    setCurrentView("search");
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges && !success) {
      const confirmCancel = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?\n\n' +
        'Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }
    
    navigate('/admin/movies');
  };

  // ===== HANDLERS DEL FORMULARIO =====

  /**
   * ✅ Obtener datos iniciales del formulario según el item seleccionado
   */
  const getInitialFormData = () => {
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
    return initialData;
  };

  /**
   * ✅ Limpiar datos antes de enviar al backend
   */
  const cleanFormData = (formData) => {
    const cleanData = { ...formData };
    
    // Convertir valores string a number según corresponda
    cleanData.year = parseInt(cleanData.year);
    cleanData.duration = parseInt(cleanData.duration);
    cleanData.categoryId = parseInt(cleanData.categoryId);
    
    // Si posterUrl está vacío, no enviarlo (es opcional)
    if (!cleanData.posterUrl || cleanData.posterUrl.trim() === '') {
      delete cleanData.posterUrl;
    }
    
    return cleanData;
  };

  /**
   * ✅ Manejar envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);

      // Limpiar datos para backend
      const cleanData = cleanFormData(formData);

      console.log('🚀 Creando película/serie:', cleanData);

      // TODO: Implementar createMovieService cuando esté disponible
      // const response = await createMovieService(cleanData);
      
      // Simulación temporal (remover cuando se implemente el servicio real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Contenido creado exitosamente');

      // Estado de éxito
      setSuccess(true);
      setHasChanges(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear contenido:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error inesperado al crear el contenido. Intenta nuevamente.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * ✅ Detectar cambios en el formulario
   */
  const handleFormChange = (changedData) => {
    setHasChanges(true);
    setError(null); // Limpiar errores al hacer cambios
  };

  // ===== RENDER =====
  
  return (
    <AdminLayout
      title="Crear Contenido Multimedia"
      subtitle="Busca en TMDB o agrega manualmente películas y series al catálogo"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Películas', href: '/admin/movies' },
        { label: 'Crear' }
      ]}
      headerActions={
        <div className="movie-create__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading || formLoading}
          >
            Cancelar
          </Button>
          
          {currentView === "search" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGoToForm}
              leftIcon="✏️"
              disabled={loading}
            >
              Crear Manualmente
            </Button>
          )}
          
          {currentView === "form" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSearch}
                leftIcon="🔍"
                disabled={formLoading}
              >
                Volver a Búsqueda
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => document.getElementById('movie-create-form')?.requestSubmit()}
                loading={formLoading}
                disabled={!hasChanges || formLoading}
                leftIcon="🎬"
              >
                {formLoading ? 'Creando...' : 'Crear Contenido'}
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className={`movie-create ${currentView === 'search' ? 'movie-create--search-view' : 'movie-create--form-view'}`}>
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="movie-create__success">
            <div className="movie-create__success-icon">✅</div>
            <div className="movie-create__success-content">
              <h3>¡Contenido creado exitosamente!</h3>
              <p>El nuevo contenido está disponible en el catálogo multimedia.</p>
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
              <h4>Error al crear contenido</h4>
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

        {/* ===== VISTA DE BÚSQUEDA TMDB ===== */}
        {currentView === "search" && (
          <TMDBSearchView
            // Estados principales
            searchQuery={searchQuery}
            results={results}
            loading={loading}
            sortBy={sortBy}
            
            // Configuración
            contentType="all"
            title="🎬 Buscar Películas y Series"
            placeholder="Ej: Avatar, Breaking Bad, Inception..."
            helperText="Busca por título, año o palabras clave"
            
            // Opciones y configuración
            showManualCreate={true}
            manualCreateText="Crear Manualmente"
            manualCreateDescription="Agrega contenido sin buscar en TMDB"
            sortOptions={sortOptions}
            
            // Handlers - TODOS DEFINIDOS Y FUNCIONANDO
            onSearch={handleSearch}
            onSearchQueryChange={handleSearchQueryChange}
            onSortChange={handleSortChange}
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
            categoryOptions={categories.map(cat => ({
              value: cat.id,
              label: cat.name
            }))}
            showBackButton={true}
            categoriesLoading={categoriesLoading}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export { MovieCreatePage };