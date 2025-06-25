// ===== MOVIE CREATE PAGE - INTEGRACIÓN TMDB CORREGIDA =====
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
 * MovieCreatePage - INTEGRACIÓN TMDB CORREGIDA
 * 
 * ✅ PROPS CORREGIDOS: Nombres y handlers alineados con TMDBSearchView
 * ✅ ESTADO TMDB: Manejo correcto de búsqueda y resultados
 * ✅ REDIRECCIÓN: Flujo search → form funcionando
 * ✅ SISTEMA DE DISEÑO: Homologado con CategoryCreatePage/UserCreatePage
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState("search"); // "search" | "form"
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== ESTADOS ESPECÍFICOS DE TMDB ===== (CORREGIDOS)
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
      helperText: 'Título original o en español'
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo de Contenido',
      placeholder: 'Selecciona el tipo',
      required: true,
      leftIcon: '🎭',
      options: [
        { value: 'movie', label: 'Película' },
        { value: 'tv', label: 'Serie' }
      ],
      helperText: 'Tipo de contenido multimedia'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año',
      placeholder: '2024',
      required: true,
      leftIcon: '📅',
      helperText: 'Año de lanzamiento',
      min: 1900,
      max: new Date().getFullYear() + 5
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      placeholder: 'Selecciona una categoría',
      required: true,
      leftIcon: '🎪',
      options: [], // Se llena dinámicamente
      helperText: 'Clasificación del contenido'
    },
    {
      name: 'overview',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Breve descripción de la película o serie',
      required: true,
      leftIcon: '📝',
      helperText: 'Resumen del contenido (máximo 500 caracteres)',
      maxLength: 500,
      rows: 4
    },
    {
      name: 'poster',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://example.com/poster.jpg',
      required: false,
      leftIcon: '🖼️',
      helperText: 'Imagen de portada (opcional)'
    },
    {
      name: 'videoUrl',
      type: 'url',
      label: 'URL del Video',
      placeholder: 'https://example.com/video.mp4',
      required: true,
      leftIcon: '🎥',
      helperText: 'Enlace directo al contenido multimedia'
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duración (minutos)',
      placeholder: '120',
      required: false,
      leftIcon: '⏱️',
      helperText: 'Duración en minutos (opcional)',
      min: 1,
      max: 1000
    }
  ];

  // ===== EFECTOS =====

  /**
   * Cargar categorías al montar el componente
   */
  useEffect(() => {
    loadCategories();
  }, []);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Cargar categorías desde el backend
   */
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const result = await getCategoriesService();
      const categoryOptions = result.map(cat => ({
        value: cat.id,
        label: cat.name
      }));

      setCategories(categoryOptions);

    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías');
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
   * Navegar de vuelta - HOMOLOGADO
   */
  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }

    navigate('/admin/movies');
  };

  // ===== HANDLERS DE TMDB SEARCH ===== (CORREGIDOS)

  /**
   * Realizar búsqueda en TMDB - CORREGIDO
   */
  const handleTMDBSearch = async () => {
    if (!searchQuery.trim()) return;

    setTmdbLoading(true);
    setTmdbError(null);
    setTmdbResults([]);

    try {
      console.log('🔍 Buscando en TMDB:', searchQuery);

      const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=es-ES`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error de TMDB: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Resultados TMDB:', data);

      // Filtrar solo películas y series
      const filteredResults = data.results?.filter(item =>
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [];

      // Ordenar según selección
      const sortedResults = sortTMDBResults(filteredResults, sortBy);

      setTmdbResults(sortedResults);

    } catch (err) {
      console.error('❌ Error en búsqueda TMDB:', err);
      setTmdbError(err.message || 'Error al buscar en TMDB');
    } finally {
      setTmdbLoading(false);
    }
  };

  /**
   * Ordenar resultados de TMDB
   */
  const sortTMDBResults = (results, sortOption) => {
    const sorted = [...results];

    switch (sortOption) {
      case 'year-desc':
        return sorted.sort((a, b) => {
          const yearA = getItemYear(a);
          const yearB = getItemYear(b);
          return yearB - yearA;
        });
      case 'year-asc':
        return sorted.sort((a, b) => {
          const yearA = getItemYear(a);
          const yearB = getItemYear(b);
          return yearA - yearB;
        });
      case 'rating-desc':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      default:
        return sorted;
    }
  };

  /**
   * Obtener año de un item TMDB
   */
  const getItemYear = (item) => {
    const date = item.release_date || item.first_air_date;
    if (!date) return 0;

    try {
      return new Date(date).getFullYear();
    } catch {
      return 0;
    }
  };

  /**
   * Limpiar resultados de TMDB
   */
  const handleClearTMDBResults = () => {
    setTmdbResults([]);
    setSearchQuery("");
    setTmdbError(null);
  };

  /**
   * Manejar selección de item TMDB - CORREGIDO (nombre del handler)
   */
  const handleItemSelected = (item) => {
    console.log('🎬 Item seleccionado desde TMDB:', item);

    setSelectedItem(item);
    setCurrentView("form");
    setHasChanges(true);

    // Limpiar errores
    clearError();
  };

  /**
   * Crear manualmente (sin TMDB)
   */
  const handleManualCreate = () => {
    console.log('✏️ Creación manual solicitada');

    setSelectedItem(null);
    setCurrentView("form");
    setHasChanges(false);

    // Limpiar errores
    clearError();
  };

  /**
   * Volver a la búsqueda desde el formulario
   */
  const handleBackToSearch = () => {
    setCurrentView("search");
    setSelectedItem(null);
    setHasChanges(false);
  };

  // ===== HANDLERS DE FORMULARIO ===== (HOMOLOGADOS)

  /**
   * Detectar cambios en el formulario - HOMOLOGADO
   */
  const handleFormChange = (formData) => {
    const hasData = Object.values(formData).some(value =>
      value && value.toString().trim() !== ''
    );
    setHasChanges(hasData);

    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
  };

  /**
   * Enviar formulario - HOMOLOGADO CON BACKEND
   */
  const handleFormSubmit = async (formData) => {
    setError(null);
    setFormLoading(true);

    try {
      console.log('📤 Enviando datos al backend:', formData);

      // TODO: Implementar createMovieService
      // const result = await createMovieService(formData);

      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Contenido creado exitosamente');

      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/admin/movies');
      }, 3000);

    } catch (err) {
      console.error('❌ Error al crear contenido:', err);

      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Error inesperado al crear el contenido';

      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // ===== DATOS INICIALES DEL FORMULARIO ===== (CORREGIDOS)
  const getInitialFormData = () => {
    if (!selectedItem) return {};

    // Mapear datos de TMDB a formato del formulario
    return {
      title: selectedItem.title || selectedItem.name || '',
      type: selectedItem.media_type === 'movie' ? 'movie' : 'tv',
      year: getItemYear(selectedItem) || '',
      overview: selectedItem.overview || '',
      poster: selectedItem.poster_path
        ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
        : ''
    };
  };

  // ===== PROPS PARA COMPONENTES ===== (CORREGIDOS)

  /**
   * Props para TMDBSearchView - NOMBRES CORREGIDOS
   */
  const tmdbSearchProps = {
    // Estados de búsqueda
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    sortBy,
    onSortChange: setSortBy,
    results: tmdbResults,
    loading: tmdbLoading,
    error: tmdbError,

    // Handlers principales - NOMBRES CORREGIDOS
    onSearch: handleTMDBSearch,
    onClearResults: handleClearTMDBResults,
    onItemSelected: handleItemSelected, // ← NOMBRE CORREGIDO
    onManualCreate: handleManualCreate,

    // Configuración
    contentType: "all",
    title: "🎬 Buscar en TMDB",
    description: "Busca películas y series en la base de datos de TMDB para agregar al catálogo",
    placeholder: "Ej: Avatar, Breaking Bad, Inception...",
    helperText: "Busca por título, año o palabras clave",
    showManualCreate: true,

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
      {/* 🎯 CONTENEDOR PRINCIPAL - SISTEMA DE DISEÑO */}
      <div className="page-container page-container--wide">

        {/* 🔧 HEADER ACTIONS - SISTEMA DE DISEÑO */}
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

        {/* ❌ MENSAJE DE ERROR - SISTEMA DE DISEÑO */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear contenido</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ✅ MENSAJE DE ÉXITO - SISTEMA DE DISEÑO */}
        {success && (
          <div className="status-message status-message--success">
            <span className="status-message__icon">✅</span>
            <div className="status-message__content">
              <strong>¡Contenido creado exitosamente!</strong>
              <span>Redirigiendo al listado en unos segundos...</span>
            </div>
          </div>
        )}

        {/* 🎬 VISTA CONDICIONAL - INTEGRACIÓN CORREGIDA */}
        {currentView === "search" ? (
          <TMDBSearchView {...tmdbSearchProps} />
        ) : (
          <MovieFormView {...movieFormProps} />
        )}

      </div>
    </AdminLayout>
  );
}

export { MovieCreatePage };