// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';
import './MovieCreatePage.css';

// Importar servicios MEJORADOS
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { createMovieService } from '../../../../services/Movies/createMovieService'; // ← SERVICIO MEJORADO
import { createSeriesService } from '../../../../services/Series/createSeriesService'; // ← SERVICIO MEJORADO

// Configuración de TMDB API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - IMPLEMENTACIÓN COMPLETA CON SERVICIOS MEJORADOS
 * 
 * ✅ NUEVA FUNCIONALIDAD: Manejo de URLs de TMDB y archivos locales
 * ✅ SERVICIOS: Integración con createMovieService y createSeriesService mejorados
 * ✅ VALIDACIÓN: Mejor manejo de errores y validaciones
 * ✅ UX: Indicadores de progreso y mensajes más claros
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

  // ===== CARGAR CATEGORÍAS =====
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoryData = await getCategoriesService();
        setCategories(categoryData || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

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
      placeholder: 'Selecciona el tipo de contenido',
      required: true,
      leftIcon: '🎭',
      helperText: 'Película o serie de TV',
      width: 'half',
      options: [
        { value: 'movie', label: 'Película' },
        { value: 'tv', label: 'Serie' }
      ]
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
      required: true,
      leftIcon: '📂',
      helperText: 'Clasificación del contenido',
      width: 'half',
      disabled: categoriesLoading,
      options: categories.map(cat => ({
        value: cat.id,
        label: cat.name
      }))
    },
    {
      name: 'overview',
      type: 'textarea',
      label: 'Sinopsis',
      placeholder: 'Describe la trama del contenido...',
      leftIcon: '📝',
      helperText: 'Breve descripción para los usuarios',
      width: 'full',
      rows: 4,
      maxLength: 1000
    },
    // CAMPO ESPECIAL PARA VIDEO (solo películas)
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video',
      placeholder: 'Seleccionar archivo de video',
      required: true,
      leftIcon: '🎥',
      helperText: 'MP4, WebM o AVI (máximo 500MB)',
      width: 'half',
      accept: 'video/*',
      multiple: false,
      // Condicional: solo mostrar para películas
      showIf: (formData) => formData.type === 'movie'
    },
    // CAMPO ESPECIAL PARA PORTADA - MANEJA TANTO URL COMO ARCHIVO
    {
      name: 'coverImage',
      type: 'file',
      label: 'Imagen de Portada',
      placeholder: 'Seleccionar imagen o usar de TMDB',
      required: true,
      leftIcon: '🖼️',
      helperText: selectedItem ? 'Se usará imagen de TMDB o sube una nueva' : 'JPG, PNG, WebP (máximo 10MB)',
      width: 'half',
      accept: 'image/*',
      multiple: false
    }
  ];

  // ===== UTILIDADES =====
  const clearError = () => setError(null);
  
  /**
   * Ordenar resultados de TMDB
   */
  const sortTmdbResults = (results, sortBy) => {
    const sortedResults = [...results];
    
    switch (sortBy) {
      case "year-desc":
        return sortedResults.sort((a, b) => {
          const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 
                       a.first_air_date ? new Date(a.first_air_date).getFullYear() : 0;
          const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 
                       b.first_air_date ? new Date(b.first_air_date).getFullYear() : 0;
          return yearB - yearA;
        });
      
      case "year-asc":
        return sortedResults.sort((a, b) => {
          const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 
                       a.first_air_date ? new Date(a.first_air_date).getFullYear() : 0;
          const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 
                       b.first_air_date ? new Date(b.first_air_date).getFullYear() : 0;
          return yearA - yearB;
        });
      
      case "rating-desc":
        return sortedResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      
      default:
        return sortedResults;
    }
  };

  // ===== HANDLERS DE NAVEGACIÓN =====
  
  /**
   * Volver al listado de películas
   */
  const handleGoBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
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
   * Buscar en TMDB API
   */
  const handleTmdbSearch = async () => {
    console.log('🔍 Iniciando búsqueda TMDB con query:', searchQuery);
    
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
    
    setTmdbLoading(true);
    setTmdbError(null);
    
    try {
      const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(queryTrimmed)}&language=es-ES`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filtrar solo películas y series
      let filteredResults = (data.results || []).filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );

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
   * Manejar selección de item de TMDB
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
   * Obtener datos iniciales del formulario basados en selección TMDB
   */
  const getInitialFormData = () => {
    if (!selectedItem) return {};

    const initialData = {
      title: selectedItem.title || selectedItem.name || '',
      type: selectedItem.media_type === 'tv' ? 'tv' : 'movie',
      year: selectedItem.release_date 
        ? new Date(selectedItem.release_date).getFullYear()
        : selectedItem.first_air_date 
        ? new Date(selectedItem.first_air_date).getFullYear()
        : '',
      overview: selectedItem.overview || ''
    };

    // IMPORTANTE: Para portada de TMDB, pasamos la URL
    // El servicio mejorado se encargará de convertirla a File
    if (selectedItem.poster_path) {
      initialData.coverImage = `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`;
    }

    return initialData;
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    clearError();
  };

  /**
   * Enviar formulario - IMPLEMENTACIÓN COMPLETA
   */
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando creación de contenido...');
      console.log('📋 Datos del formulario:', formData);
      
      // Validaciones específicas
      if (!formData.title?.trim()) {
        throw new Error('El título es requerido');
      }
      
      if (!formData.type) {
        throw new Error('El tipo de contenido es requerido');
      }
      
      if (!formData.categoryId) {
        throw new Error('La categoría es requerida');
      }
      
      if (!formData.year || formData.year < 1900) {
        throw new Error('El año debe ser válido');
      }

      // Preparar datos para el servicio
      const serviceData = {
        title: formData.title.trim(),
        categoryId: Number(formData.categoryId),
        releaseYear: Number(formData.year),
        description: formData.overview?.trim() || '',
        coverImage: formData.coverImage // ← Puede ser URL (TMDB) o File (usuario)
      };

      let result;
      
      // Determinar qué servicio usar según el tipo
      if (formData.type === 'movie') {
        // Para películas necesitamos el video
        if (!formData.video) {
          throw new Error('El archivo de video es requerido para películas');
        }
        
        serviceData.video = formData.video;
        
        console.log('🎬 Creando película...');
        result = await createMovieService(serviceData);
        
      } else if (formData.type === 'tv') {
        // Para series no necesitamos video (se suben episodios después)
        console.log('📺 Creando serie...');
        result = await createSeriesService(serviceData);
        
      } else {
        throw new Error('Tipo de contenido no válido');
      }
      
      console.log('✅ Contenido creado exitosamente:', result);
      
      setSuccess(true);
      setHasChanges(false);
      
      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 3000);
      
    } catch (err) {
      console.error('❌ Error creando contenido:', err);
      
      // Mejorar mensajes de error para el usuario
      let errorMessage = 'Error al crear el contenido';
      
      if (err.message.includes('descargar la imagen')) {
        errorMessage = 'Error al procesar la imagen de TMDB. Intenta subir una imagen manualmente.';
      } else if (err.message.includes('requerido')) {
        errorMessage = err.message;
      } else if (err.message.includes('ya existe')) {
        errorMessage = 'Este contenido ya existe en el sistema';
      } else if (err.message.includes('demasiado grande')) {
        errorMessage = 'Los archivos son demasiado grandes. Reduce el tamaño e intenta de nuevo.';
      } else if (err.message.includes('red')) {
        errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else {
        errorMessage = err.message || 'Error inesperado al crear el contenido';
      }
      
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // ===== PROPS PARA COMPONENTES =====

  /**
   * Props para TMDBSearchView
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
    
    // Handlers principales
    onSearch: handleTmdbSearch,
    onSelectItem: handleSelectItem,
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