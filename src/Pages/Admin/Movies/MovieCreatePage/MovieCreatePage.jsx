// ===== MOVIE CREATE PAGE - VERSIÓN CORREGIDA =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';
import { TranscodingModal } from '../../../../components/molecules/TranscodingModal/TranscodingModal';

// ===== SERVICIOS Y HOOKS =====
import { createMovieService } from '../../../../services/Movies/createMovieService';
import { createSeriesService } from '../../../../services/Series/createSeriesService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { useUploadProgress } from '../../../../hooks/useUploadProgress';

// ===== ESTILOS =====
import './MovieCreatePage.css';

// ===== CONFIGURACIÓN TMDB - CORREGIDA =====
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "tu_api_key_aqui";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - VERSIÓN CORREGIDA
 * ✅ CORREGIDO: Comunicación perfecta con TMDBSearchView
 * ✅ CORREGIDO: Manejo de estados centralizado
 * ✅ CORREGIDO: API key configurada correctamente
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState('search'); // 'search' | 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== ESTADOS DE BÚSQUEDA TMDB - CORREGIDOS =====
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [sortBy, setSortBy] = useState("year-desc");

  // ===== ESTADOS DE FORMULARIO =====
  const [formLoading, setFormLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [error, setError] = useState(null);

  // ===== HOOK DE PROGRESO =====
  const {
    isTranscoding,
    progress,
    status,
    message,
    error: progressError,
    contentInfo,
    startProgress,
    stopProgress,
    clearProgress
  } = useUploadProgress();

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
    
    // Validar API Key al cargar
    if (!TMDB_API_KEY || TMDB_API_KEY === "tu_api_key_aqui") {
      console.warn('⚠️ TMDB API Key no configurada. Agrega VITE_TMDB_API_KEY a tu .env');
      setSearchError('API Key de TMDB no configurada. Contacta al administrador.');
    }
  }, []);

  // ===== FUNCIONES DE CARGA INICIAL =====
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      
      const response = await getCategoriesService();
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.error || 'Error al cargar categorías');
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setCategoriesError('Error al cargar las categorías');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ===== FUNCIONES DE BÚSQUEDA TMDB - CORREGIDAS =====
  
  /**
   * Maneja la búsqueda en TMDB
   * ✅ CORREGIDO: Función simplificada y robusta
   */
  const handleSearch = async () => {
    const query = searchQuery.trim();
    
    if (!query || query.length < 2) {
      setSearchError('La búsqueda debe tener al menos 2 caracteres');
      return;
    }

    if (!TMDB_API_KEY || TMDB_API_KEY === "tu_api_key_aqui") {
      setSearchError('API Key de TMDB no configurada. Agrega VITE_TMDB_API_KEY a tu archivo .env');
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      
      console.log('🔍 Buscando en TMDB:', query);
      
      // Realizar búsqueda directa en TMDB
      const url = `${TMDB_BASE_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API Key de TMDB inválida');
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results) {
        throw new Error('Respuesta de TMDB inválida');
      }
      
      // Filtrar y formatear resultados
      const filteredResults = data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(item => ({
          id: item.id,
          title: item.title || item.name,
          type: item.media_type,
          year: item.release_date || item.first_air_date ? 
                new Date(item.release_date || item.first_air_date).getFullYear() : 
                null,
          rating: item.vote_average,
          overview: item.overview,
          poster: item.poster_path,
          // Datos adicionales para el formulario
          original_title: item.original_title || item.original_name,
          tmdb_id: item.id,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
          genre_ids: item.genre_ids || []
        }));
      
      setSearchResults(filteredResults);
      console.log('✅ Resultados encontrados:', filteredResults.length);
      
    } catch (err) {
      console.error('❌ Error en búsqueda TMDB:', err);
      setSearchError(err.message || 'Error al buscar en TMDB. Verifica tu conexión.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * Limpia los resultados de búsqueda
   * ✅ NUEVO: Función para resetear búsqueda
   */
  const handleClearResults = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchError(null);
    console.log('🧹 Resultados limpiados');
  };

  /**
   * Maneja la selección de un item de TMDB
   * ✅ CORREGIDO: Mejor manejo del item seleccionado
   */
  const handleItemSelect = (item) => {
    console.log('🎬 Item seleccionado:', item);
    setSelectedItem(item);
    setCurrentView('form');
    setError(null);
  };

  /**
   * Regresa a la vista de búsqueda
   */
  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedItem(null);
    setError(null);
    setHasChanges(false);
  };

  // ===== FUNCIONES DE FORMULARIO =====
  
  /**
   * Genera los campos del formulario dinámico
   */
  const generateFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título',
        placeholder: 'Nombre de la película o serie',
        required: true,
        helperText: 'Título principal que aparecerá en el catálogo'
      },
      {
        name: 'original_title',
        type: 'text',
        label: 'Título Original',
        placeholder: 'Título original (si es diferente)',
        helperText: 'Título en el idioma original'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción',
        placeholder: 'Descripción de la trama...',
        required: true,
        rows: 4,
        helperText: 'Sinopsis que aparecerá en los detalles'
      },
      {
        name: 'year',
        type: 'number',
        label: 'Año',
        placeholder: '2024',
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5
      },
      {
        name: 'duration',
        type: 'number',
        label: selectedItem?.type === 'tv' ? 'Episodios' : 'Duración (min)',
        placeholder: selectedItem?.type === 'tv' ? '10' : '120',
        required: true,
        min: 1
      },
      {
        name: 'category_id',
        type: 'select',
        label: 'Categoría',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        required: true,
        loading: categoriesLoading,
        helperText: categoriesError || 'Selecciona la categoría principal'
      },
      {
        name: 'rating',
        type: 'number',
        label: 'Calificación',
        placeholder: '8.5',
        min: 0,
        max: 10,
        step: 0.1,
        helperText: 'Calificación promedio (0-10)'
      },
      {
        name: 'poster_url',
        type: 'text',
        label: 'URL del Poster',
        placeholder: 'https://...',
        helperText: 'URL de la imagen de portada'
      },
      {
        name: 'video_file',
        type: 'file',
        label: 'Archivo de Video',
        accept: 'video/*',
        required: true,
        helperText: 'Archivo de video a subir (formatos soportados: mp4, avi, mkv)'
      }
    ];
  };

  /**
   * Genera datos iniciales del formulario
   */
  const generateInitialFormData = (item) => {
    if (!item) return {};

    return {
      title: item.title || '',
      original_title: item.original_title || '',
      description: item.overview || '',
      year: item.year || new Date().getFullYear(),
      duration: item.type === 'tv' ? 1 : 120,
      rating: item.rating || 0,
      poster_url: item.poster ? `https://image.tmdb.org/t/p/w500${item.poster}` : '',
      category_id: categories.length > 0 ? categories[0].id : '',
      // Datos TMDB para referencia
      tmdb_id: item.tmdb_id,
      media_type: item.type
    };
  };

  /**
   * Maneja el envío del formulario
   */
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);
      
      console.log('📋 Enviando formulario:', formData);
      
      // Iniciar seguimiento de progreso
      startProgress({
        title: formData.title,
        type: formData.media_type || 'movie'
      });
      
      // Preparar datos para el servicio
      const serviceData = {
        ...formData,
        type: formData.media_type || 'movie'
      };
      
      // Llamar al servicio apropiado
      const response = serviceData.type === 'tv' ? 
        await createSeriesService(serviceData) : 
        await createMovieService(serviceData);
      
      if (response.success) {
        setSuccess(true);
        setHasChanges(false);
        console.log('✅ Contenido creado exitosamente');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/admin/movies');
        }, 3000);
      } else {
        throw new Error(response.error || 'Error al crear el contenido');
      }
      
    } catch (err) {
      console.error('❌ Error creando contenido:', err);
      setError(err.message || 'Error al crear el contenido');
      stopProgress();
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Maneja cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    setError(null);
  };

  // ===== FUNCIONES DE NAVEGACIÓN =====
  
  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    navigate('/admin/movies');
  };

  // ===== FUNCIONES DEL MODAL DE PROGRESO =====
  
  const handleCloseTranscodingModal = () => {
    if (status === 'completed' || status === 'error') {
      clearProgress();
    }
  };

  const handleRetryTranscoding = () => {
    // Lógica para reintentar
    console.log('🔄 Reintentando transcodificación...');
  };

  const handleViewContent = () => {
    navigate('/admin/movies');
  };

  // ===== RENDERIZADO =====
  return (
    <AdminLayout>
      <Container maxWidth="xl" className="movie-create-page">
        
        {/* Header */}
        <div className="movie-create-page__header">
          <div className="movie-create-page__title-section">
            <h1>🎬 Agregar Contenido</h1>
            <p>Busca en TMDB o crea contenido manualmente</p>
          </div>
          
          <Button
            variant="outline"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={formLoading}
          >
            Volver
          </Button>
        </div>

        {/* Error general */}
        {error && (
          <div className="movie-create-page__error">
            <span>❌</span>
            <p>{error}</p>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div className="movie-create-page__success">
            <span>✅</span>
            <h4>¡Contenido agregado exitosamente!</h4>
            <p>El contenido se ha agregado al catálogo y será procesado en segundo plano.</p>
          </div>
        )}

        {/* Vista de búsqueda TMDB */}
        {currentView === 'search' && (
          <TMDBSearchView
            // Estados de búsqueda - CORREGIDOS
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            results={searchResults}
            loading={searchLoading}
            error={searchError}
            
            // Handlers principales - CORREGIDOS
            onSearch={handleSearch}
            onClearResults={handleClearResults}
            onSelectItem={handleItemSelect}
            onManualCreate={() => setCurrentView('form')}
            
            // Configuración
            contentType="all"
            title="🎬 Buscar en TMDB"
            description="Busca películas y series en la base de datos de TMDB para agregar al catálogo"
            placeholder="Ej: Avatar, Breaking Bad, Inception..."
            helperText="Busca por título, año o palabras clave"
            showManualCreate={true}
          />
        )}

        {/* Vista de formulario */}
        {currentView === 'form' && (
          <MovieFormView
            selectedItem={selectedItem}
            formFields={generateFormFields()}
            initialFormData={generateInitialFormData(selectedItem)}
            formLoading={formLoading}
            success={success}
            hasChanges={hasChanges}
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            onBackToSearch={handleBackToSearch}
            categoriesLoading={categoriesLoading}
            showBackButton={selectedItem !== null}
          />
        )}

      </Container>

      {/* Modal de progreso de transcodificación */}
      <TranscodingModal
        isOpen={isTranscoding}
        progress={progress}
        status={status}
        message={message}
        error={progressError}
        contentTitle={contentInfo?.title}
        contentType={contentInfo?.type === 'movie' ? 'película' : 'serie'}
        onClose={handleCloseTranscodingModal}
        onRetry={handleRetryTranscoding}
        onViewContent={handleViewContent}
        allowClose={false}
        showRetry={true}
        showViewContent={true}
      />

    </AdminLayout>
  );
}

export { MovieCreatePage };