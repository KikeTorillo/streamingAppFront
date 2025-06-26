// ===== MOVIE CREATE PAGE - INTEGRACIÓN TMDB CORREGIDA =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
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
 * MovieCreatePage - INTEGRACIÓN TMDB CORREGIDA
 * 
 * ✅ PROPS: Props corregidos para TMDBSearchView según sus stories
 * ✅ HANDLERS: Nombres de handlers correctos
 * ✅ BÚSQUEDA: Lógica de búsqueda TMDB funcional
 * ✅ ORDENAMIENTO: Función de ordenamiento implementada
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== VALIDACIÓN INICIAL =====
  useEffect(() => {
    if (!API_KEY) {
      console.error('❌ VITE_TMDB_API_KEY no está configurada');
      setTmdbError('API key de TMDB no configurada. Contacta al administrador.');
    }
  }, []);

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState("search"); // "search" | "form"
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== ESTADOS ESPECÍFICOS DE TMDB =====
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("year-desc");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbError, setTmdbError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // ===== ESTADOS DE CATEGORÍAS =====
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // ===== CONFIGURACIÓN DE CAMPOS DEL FORMULARIO =====
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
      width: 'half',
      min: 1900,
      max: new Date().getFullYear() + 2
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo',
      placeholder: 'Selecciona el tipo',
      required: true,
      leftIcon: '📺',
      helperText: 'Tipo de contenido',
      options: [
        { value: 'movie', label: 'Película' },
        { value: 'tv', label: 'Serie' }
      ],
      width: 'half'
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      placeholder: 'Selecciona una categoría',
      required: true,
      leftIcon: '📂',
      helperText: 'Categoría para clasificar el contenido',
      options: [], // Se llena dinámicamente
      width: 'half'
    },
    {
      name: 'overview',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe la película o serie...',
      required: true,
      leftIcon: '📝',
      helperText: 'Sinopsis o descripción del contenido',
      rows: 4,
      width: 'full'
    },
    {
      name: 'poster',
      type: 'text',
      label: 'URL del Poster',
      placeholder: 'https://image.tmdb.org/...',
      leftIcon: '🖼️',
      helperText: 'URL de la imagen del poster',
      width: 'full'
    },
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video',
      accept: '.mp4,.webm,.avi',
      helperText: 'Archivo de video (MP4, WebM, AVI - máximo 100MB)',
      width: 'full'
    }
  ];

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
  }, []);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Cargar categorías desde el servicio
   */
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const categoriesData = await getCategoriesService();
      setCategories(categoriesData.map(cat => ({
        value: cat.id,
        label: cat.name
      })));
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error cargando categorías');
    } finally {
      setCategoriesLoading(false);
    }
  };

  /**
   * Limpiar errores
   */
  const clearError = () => {
    setError(null);
    setTmdbError(null);
  };

  /**
   * Función de ordenamiento para resultados TMDB
   */
  const sortTmdbResults = (results, sortCriteria) => {
    if (!Array.isArray(results)) return [];

    return [...results].sort((a, b) => {
      switch (sortCriteria) {
        case 'year-desc':
          const yearA = new Date(a.release_date || a.first_air_date || '1900').getFullYear();
          const yearB = new Date(b.release_date || b.first_air_date || '1900').getFullYear();
          return yearB - yearA;
        
        case 'year-asc':
          const yearA2 = new Date(a.release_date || a.first_air_date || '1900').getFullYear();
          const yearB2 = new Date(b.release_date || b.first_air_date || '1900').getFullYear();
          return yearA2 - yearB2;
        
        case 'rating-desc':
          return (b.vote_average || 0) - (a.vote_average || 0);
        
        default:
          return 0;
      }
    });
  };

  // ===== HANDLERS DE NAVEGACIÓN =====

  /**
   * Regresar al listado de películas
   */
  const handleGoBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    navigate('/admin/movies');
  };

  /**
   * Volver a la búsqueda desde el formulario
   */
  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres volver a la búsqueda? Los cambios se perderán.'
      );
      if (!confirmed) return;
    }
    setCurrentView("search");
    setSelectedItem(null);
    setHasChanges(false);
    clearError();
  };

  // ===== HANDLERS DE TMDB =====

  /**
   * Buscar en TMDB API - CORREGIDO
   */
  const handleTmdbSearch = async () => {
    console.log('🔍 Iniciando búsqueda TMDB con query:', searchQuery);
    
    // Validaciones
    if (!API_KEY) {
      setTmdbError('API key de TMDB no configurada');
      return;
    }

    if (!searchQuery || !searchQuery.trim() || searchQuery.trim().length < 2) {
      console.log('❌ Query inválido:', searchQuery);
      setTmdbResults([]);
      return;
    }

    const queryTrimmed = searchQuery.trim();
    console.log('✅ Buscando:', queryTrimmed);
    
    setTmdbLoading(true);
    setTmdbError(null);
    
    try {
      const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(queryTrimmed)}&language=es-ES`;
      console.log('🌐 URL de búsqueda:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Datos recibidos de TMDB:', data);
      
      // Filtrar solo películas y series
      let filteredResults = (data.results || []).filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );

      console.log('🎬 Resultados filtrados:', filteredResults.length);

      // Aplicar ordenamiento
      filteredResults = sortTmdbResults(filteredResults, sortBy);
      
      setTmdbResults(filteredResults);
      console.log('✅ Resultados establecidos:', filteredResults.length);
      
    } catch (err) {
      console.error('❌ Error buscando en TMDB:', err);
      setTmdbError(`Error al buscar en TMDB: ${err.message}`);
      setTmdbResults([]);
    } finally {
      setTmdbLoading(false);
    }
  };

  /**
   * Manejar selección de item de TMDB - NOMBRE CORREGIDO
   */
  const handleSelectItem = (item) => {
    console.log('🎬 Item seleccionado:', item);
    setSelectedItem(item);
    setCurrentView("form");
    clearError();
  };

  /**
   * Limpiar resultados de búsqueda
   */
  const handleClearResults = () => {
    setTmdbResults([]);
    setSearchQuery('');
    setTmdbError(null);
  };

  /**
   * Crear contenido manualmente (sin TMDB)
   */
  const handleManualCreate = () => {
    setCurrentView("form");
    setSelectedItem(null);
    clearError();
  };

  // ===== HANDLERS DEL FORMULARIO =====

  /**
   * Obtener datos iniciales del formulario
   */
  const getInitialFormData = () => {
    if (!selectedItem) return {};

    return {
      title: selectedItem.title || selectedItem.name || '',
      type: selectedItem.media_type === 'tv' ? 'tv' : 'movie',
      year: selectedItem.release_date 
        ? new Date(selectedItem.release_date).getFullYear()
        : selectedItem.first_air_date 
        ? new Date(selectedItem.first_air_date).getFullYear()
        : '',
      overview: selectedItem.overview || '',
      poster: selectedItem.poster_path 
        ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
        : ''
    };
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    clearError();
  };

  /**
   * Enviar formulario
   */
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      console.log('Datos del formulario:', formData);
      
      // TODO: Implementar createMovieService
      // const result = await createMovieService(formData);
      
      // Simular creación exitosa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setHasChanges(false);
      
      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 3000);
      
    } catch (err) {
      console.error('Error creando contenido:', err);
      setError(err.message || 'Error al crear el contenido');
    } finally {
      setFormLoading(false);
    }
  };

  // ===== PROPS PARA COMPONENTES - NOMBRES CORREGIDOS =====

  /**
   * Props para TMDBSearchView - SEGÚN SUS STORIES
   */
  const tmdbSearchProps = {
    // Estados de búsqueda
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    sortBy,
    onSortChange: setSortBy,
    
    // Resultados y estado
    results: tmdbResults,
    loading: tmdbLoading,
    error: tmdbError,
    
    // Handlers principales - NOMBRES CORREGIDOS
    onSearch: handleTmdbSearch,
    onSelectItem: handleSelectItem, // ✅ CORREGIDO: era onItemSelected
    onClearResults: handleClearResults,
    onManualCreate: handleManualCreate,
    
    // Configuración UI
    title: "🎬 Buscar en TMDB",
    description: "Encuentra información completa de películas y series desde la base de datos de TMDB.",
    placeholder: "Ej: Avatar, Breaking Bad, Inception...",
    helperText: "Busca por título, año o palabras clave",
    showManualCreate: true,
    contentType: "all",
    
    // Opciones de ordenamiento
    sortOptions: [
      { value: "year-desc", label: "Más recientes" },
      { value: "year-asc", label: "Más antiguos" },
      { value: "rating-desc", label: "Mejor puntuados" }
    ]
  };

  /**
   * Props para MovieFormView
   */
  const movieFormProps = {
    selectedItem,
    formFields: movieFormFields.map(field => 
      field.name === 'categoryId' 
        ? { ...field, options: categories }
        : field
    ),
    initialFormData: getInitialFormData(),
    formLoading,
    success,
    hasChanges,
    onSubmit: handleFormSubmit,
    onChange: handleFormChange,
    onBackToSearch: handleBackToSearch,
    typeOptions: [
      { value: 'movie', label: 'Película' },
      { value: 'tv', label: 'Serie' }
    ],
    categoryOptions: categories,
    showBackButton: true,
    categoriesLoading
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nuevo Contenido"
      subtitle="Agregar película o serie al catálogo multimedia"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Contenido', href: '/admin/movies' },
        { label: 'Crear Contenido' }
      ]}
    >
      <Container size="lg" className={success ? 'movie-create--loading' : ''}>

        {/* Header Actions */}
        <div className="page-header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={tmdbLoading || formLoading}
          >
            Volver a Contenido
          </Button>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear contenido</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Mensaje de Éxito */}
        {success && (
          <div className="status-message status-message--success">
            <span className="status-message__icon">✅</span>
            <div className="status-message__content">
              <strong>¡Contenido creado exitosamente!</strong>
              <span>Redirigiendo al listado en unos segundos...</span>
            </div>
          </div>
        )}

        {/* Vista Condicional */}
        {currentView === "search" ? (
          <TMDBSearchView {...tmdbSearchProps} />
        ) : (
          <MovieFormView {...movieFormProps} />
        )}

      </Container>
    </AdminLayout>
  );
}

export { MovieCreatePage };