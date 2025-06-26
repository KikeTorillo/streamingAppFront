// ===== MOVIE CREATE PAGE - MIGRADO A CONTAINER COMPONENT =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container'; // ← NUEVA IMPORTACIÓN
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
 * MovieCreatePage - MIGRADO A CONTAINER COMPONENT
 * 
 * ✅ CONTAINER: Usa <Container size="lg" /> en lugar de .page-container--wide
 * ✅ EQUIVALENCIA: Container LG = 1200px = page-container--wide
 * ✅ CONSISTENCIA: Misma funcionalidad, mejor arquitectura
 * ✅ SISTEMA: Homologado con el resto de componentes
 */
function MovieCreatePage() {
  const navigate = useNavigate();

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
      min: 1900,
      max: new Date().getFullYear() + 5,
      width: 'half'
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      placeholder: 'Selecciona una categoría',
      required: true,
      leftIcon: '🎪',
      options: [], // Se llena dinámicamente
      helperText: 'Clasificación del contenido',
      width: 'half'
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
      rows: 4,
      width: 'half'
    },
    {
      name: 'poster',
      type: 'url',
      label: 'URL del Poster',
      placeholder: 'https://example.com/poster.jpg',
      required: false,
      leftIcon: '🖼️',
      helperText: 'Imagen de portada (opcional)',
      width: 'half'
    },
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video',
      accept: 'video/*',
      required: true,
      text: 'Seleccionar archivo de video',
      helperText: 'MP4, WebM, AVI, MOV (máx. 100MB)',
      width: 'half'
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
   * Navegar de vuelta
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

  // ===== HANDLERS DE TMDB =====

  /**
   * Buscar en TMDB API - VERSIÓN SIMPLIFICADA
   */
  const handleTmdbSearch = async (formData) => {
    console.log('🔍 handleTmdbSearch llamado con:', formData);
    
    // Extraer query desde formData o usar directamente
    let query = '';
    let sortByParam = sortBy;
    
    if (typeof formData === 'object' && formData !== null) {
      query = formData.searchQuery || formData.query || '';
      sortByParam = formData.sortBy || sortBy;
    } else if (typeof formData === 'string') {
      query = formData;
    }

    console.log('🔍 Query extraído:', query);
    console.log('🔍 Sort by:', sortByParam);

    // Validar que query existe y no está vacío
    if (!query || typeof query !== 'string' || !query.trim()) {
      console.log('❌ Query vacío o inválido');
      setTmdbResults([]);
      return;
    }

    console.log('✅ Iniciando búsqueda para:', query.trim());
    setTmdbLoading(true);
    setTmdbError(null);
    
    try {
      const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}`;
      console.log('🌐 URL de búsqueda:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda de TMDB');
      }
      
      const data = await response.json();
      console.log('📦 Datos recibidos de TMDB:', data);
      
      // Filtrar y formatear resultados
      let filteredResults = data.results?.filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [];

      console.log('🎬 Resultados filtrados:', filteredResults.length);

      // Aplicar ordenamiento
      filteredResults = sortTmdbResults(filteredResults, sortByParam);
      
      setTmdbResults(filteredResults);
      console.log('✅ Resultados establecidos:', filteredResults.length);
      
    } catch (err) {
      console.error('❌ Error buscando en TMDB:', err);
      setTmdbError('Error al buscar en TMDB. Intenta de nuevo.');
      setTmdbResults([]);
    } finally {
      setTmdbLoading(false);
    }
  };

  /**
   * Ordenar resultados de TMDB
   */
  const sortTmdbResults = (results, sortBy) => {
    const sorted = [...results];
    
    switch (sortBy) {
      case 'year-desc':
        return sorted.sort((a, b) => {
          const yearA = new Date(a.release_date || a.first_air_date || '').getFullYear() || 0;
          const yearB = new Date(b.release_date || b.first_air_date || '').getFullYear() || 0;
          return yearB - yearA;
        });
      case 'year-asc':
        return sorted.sort((a, b) => {
          const yearA = new Date(a.release_date || a.first_air_date || '').getFullYear() || 0;
          const yearB = new Date(b.release_date || b.first_air_date || '').getFullYear() || 0;
          return yearA - yearB;
        });
      case 'popularity':
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      default:
        return sorted;
    }
  };

  /**
   * Seleccionar item de TMDB y pasar al formulario
   */
  const handleSelectTmdbItem = (item) => {
    setSelectedItem(item);
    setCurrentView("form");
    clearError();
  };

  /**
   * Volver a la búsqueda de TMDB
   */
  const handleBackToSearch = () => {
    setCurrentView("search");
    setSelectedItem(null);
    clearError();
  };

  // ===== HANDLERS DEL FORMULARIO =====

  /**
   * Datos iniciales del formulario basados en TMDB
   */
  const getInitialFormData = () => {
    if (!selectedItem) return {};

    return {
      title: selectedItem.title || selectedItem.name || '',
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

  // ===== PROPS PARA COMPONENTES =====

  /**
   * Props para TMDBSearchView - NOMBRES CORREGIDOS
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
    onItemSelected: handleSelectTmdbItem,
    onClearResults: () => {
      setTmdbResults([]);
      setSearchQuery('');
      setTmdbError(null);
    },
    onManualCreate: () => {
      setCurrentView("form");
      setSelectedItem(null);
    },
    
    // Configuración UI
    title: "🎬 Buscar en TMDB",
    description: "Encuentra información completa de películas y series desde la base de datos de TMDB.",
    placeholder: "Ej: Avatar, Breaking Bad, Inception...",
    helperText: "Busca por título, año o palabras clave",
    showManualCreate: true,
    contentType: "all"
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
      {/* 🎯 CONTENEDOR PRINCIPAL - MIGRADO A CONTAINER COMPONENT */}
      <Container size="lg" className={success ? 'movie-create--loading' : ''}>

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

      </Container>
    </AdminLayout>
  );
}

export { MovieCreatePage };