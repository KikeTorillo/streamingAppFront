// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
// ✅ CORREGIDO: Alert no existe como componente separado, usar simple div o crear uno básico

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView'; // ✅ CORREGIDO: Organism existente
import { MovieFormView } from './components/MovieFormView';
import { TranscodingModal } from '../../../../components/molecules/TranscodingModal/TranscodingModal'; // ✅ NUEVO

// ===== SERVICIOS Y HOOKS =====
import { createMovieService } from '../../../../services/Movies/createMovieService';
import { createSeriesService } from '../../../../services/Series/createSeriesService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
// import { searchTMDBService } from '../../../../services/TMDB/searchTMDBService'; // ✅ COMENTADO: Crear la búsqueda directamente
import { useUploadProgress } from '../../../../hooks/useUploadProgress'; // ✅ NUEVO

// ===== ESTILOS =====
import './MovieCreatePage.css';

// ===== CONFIGURACIÓN TMDB =====
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3/search/multi";

/**
 * MovieCreatePage - CON SISTEMA DE PROGRESO INTEGRADO
 * ✅ NUEVO: Progreso de transcodificación en tiempo real
 * ✅ NUEVO: Modal que muestra estado del procesamiento
 * ✅ MEJORADO: UX completa para subida y procesamiento
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState('search'); // 'search', 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);

  // ===== ESTADOS DEL FORMULARIO =====
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== ESTADOS DE BÚSQUEDA TMDB =====
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // ===== ESTADOS DE CATEGORÍAS =====
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // ✅ NUEVO: ESTADOS DE TRANSCODIFICACIÓN
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [contentInfo, setContentInfo] = useState(null); // Info del contenido siendo procesado
  
  // ✅ NUEVO: HOOK DE PROGRESO
  const { progress, status, message, error: progressError, monitorProgress, resetProgress } = useUploadProgress();

  // ===== EFECTOS =====

  /**
   * Cargar categorías al montar el componente
   */
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * ✅ NUEVO: Cleanup del progreso al desmontar
   */
  useEffect(() => {
    return () => {
      resetProgress();
    };
  }, [resetProgress]);

  // ===== FUNCIONES DE CATEGORÍAS =====

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

  // ===== FUNCIONES DE BÚSQUEDA TMDB ===== ✅ ACTUALIZADO

  const handleSearch = async (query) => {
    if (!query?.trim() || query.length < 3) {
      setSearchError('La búsqueda debe tener al menos 3 caracteres');
      return;
    }

    if (!TMDB_API_KEY) {
      setSearchError('API key de TMDB no configurada');
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      setSearchQuery(query);
      
      console.log('🔍 Iniciando búsqueda TMDB con query:', query);
      
      // Realizar búsqueda directa en TMDB
      const url = `${TMDB_BASE_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filtrar solo películas y series
      const filteredResults = (data.results || []).filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      setSearchResults(filteredResults);
      console.log('✅ Resultados establecidos:', filteredResults.length);
      
    } catch (err) {
      console.error('Error en búsqueda TMDB:', err);
      setSearchError('Error al buscar en TMDB. Inténtalo de nuevo.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    console.log('🎬 Item seleccionado:', item);
    setSelectedItem(item);
    setCurrentView('form');
    clearError();
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedItem(null);
    clearError();
  };

  // ===== FUNCIONES DE MANEJO DE ERRORES =====

  const clearError = () => {
    setError(null);
    setSearchError(null);
  };

  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    navigate('/admin/movies');
  };

  // ===== FUNCIONES DE TRANSCODIFICACIÓN ===== ✅ NUEVO

  /**
   * ✅ NUEVO: Iniciar monitoreo de progreso
   */
  const startTranscodingProgress = (receivedTaskId, contentData) => {
    console.log('🚀 Iniciando monitoreo de transcodificación:', {
      taskId: receivedTaskId,
      content: contentData.title
    });

    setTaskId(receivedTaskId);
    setIsTranscoding(true);
    setContentInfo(contentData);
    
    // Iniciar monitoreo
    const stopMonitoring = monitorProgress(
      receivedTaskId,
      contentData.type === 'movie' ? 'movies' : 'series',
      (newStatus) => {
        console.log('📊 Estado actualizado:', newStatus);
      },
      (success, errorMsg) => {
        console.log('🏁 Transcodificación finalizada:', { success, errorMsg });
        handleTranscodingFinished(success, errorMsg);
      }
    );

    // Guardar función de cleanup (opcional)
    return stopMonitoring;
  };

  /**
   * ✅ NUEVO: Manejar finalización de transcodificación
   */
  const handleTranscodingFinished = (success, errorMsg) => {
    if (success) {
      console.log('✅ Contenido procesado exitosamente');
      setSuccess(true);
      setFormLoading(false);
      setHasChanges(false);
    } else {
      console.error('❌ Error en transcodificación:', errorMsg);
      setError(`Error en el procesamiento: ${errorMsg}`);
      setFormLoading(false);
    }
  };

  /**
   * ✅ NUEVO: Cerrar modal de transcodificación
   */
  const handleCloseTranscodingModal = () => {
    setIsTranscoding(false);
    setTaskId(null);
    setContentInfo(null);
    resetProgress();
    
    if (status === 'completed') {
      // Redirigir después de cerrar si está completado
      setTimeout(() => {
        navigate('/admin/movies');
      }, 1000);
    }
  };

  /**
   * ✅ NUEVO: Reintentar procesamiento
   */
  const handleRetryTranscoding = () => {
    // Resetear estados y permitir nuevo intento
    setIsTranscoding(false);
    setTaskId(null);
    setContentInfo(null);
    resetProgress();
    setFormLoading(false);
    setError(null);
  };

  /**
   * ✅ NUEVO: Ver contenido procesado
   */
  const handleViewContent = () => {
    navigate('/admin/movies');
  };

  // ===== FUNCIONES DE FORMULARIO ===== ✅ ACTUALIZADO

  /**
   * Generar datos iniciales del formulario basado en item de TMDB
   */
  const generateInitialFormData = (selectedItem) => {
    if (!selectedItem) return {};

    const initialData = {
      title: selectedItem.title || selectedItem.name || '',
      overview: selectedItem.overview || '',
      year: selectedItem.release_date 
        ? new Date(selectedItem.release_date).getFullYear()
        : selectedItem.first_air_date 
        ? new Date(selectedItem.first_air_date).getFullYear()
        : '',
      type: selectedItem.media_type || (selectedItem.title ? 'movie' : 'tv'),
      categoryId: categories.length > 0 ? categories[0].id : ''
    };

    // IMPORTANTE: Para portada de TMDB, pasamos la URL
    if (selectedItem.poster_path) {
      initialData.coverImage = `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`;
    }

    return initialData;
  };

  const handleFormChange = (formData) => {
    setHasChanges(true);
    clearError();
  };

  /**
   * ✅ ACTUALIZADO: Enviar formulario con progreso de transcodificación
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
      
      console.log('✅ Respuesta del backend:', result);
      
      // ✅ NUEVO: Si el backend devuelve taskId, iniciar progreso
      if (result.taskId) {
        startTranscodingProgress(result.taskId, {
          title: formData.title,
          type: formData.type
        });
      } else {
        // Fallback para respuestas directas (series sin video)
        setSuccess(true);
        setHasChanges(false);
        setFormLoading(false);
        
        // Redireccionar después de 3 segundos
        setTimeout(() => {
          navigate('/admin/movies');
        }, 3000);
      }
      
    } catch (err) {
      console.error('❌ Error creando contenido:', err);
      
      // Mejorar mensajes de error para el usuario
      let errorMessage = 'Error al crear el contenido';
      
      if (err.message.includes('descargar la imagen')) {
        errorMessage = 'Error al procesar la imagen de TMDB. Inténtalo de nuevo.';
      } else if (err.message.includes('requerido')) {
        errorMessage = err.message;
      } else if (err.message.includes('session expired')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Este contenido ya existe en el sistema.';
      } else if (err.response?.status === 413) {
        errorMessage = 'El archivo es demasiado grande.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setFormLoading(false);
    }
  };

  // ===== GENERACIÓN DE CAMPOS DEL FORMULARIO =====

  const generateFormFields = () => {
    const typeOptions = [
      { value: 'movie', label: 'Película' },
      { value: 'tv', label: 'Serie' }
    ];

    const categoryOptions = categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }));

    return [
      {
        name: 'type',
        type: 'select',
        label: 'Tipo de Contenido',
        placeholder: 'Selecciona el tipo',
        required: true,
        options: typeOptions,
        leftIcon: '🎭',
        width: 'half',
        helperText: 'Películas requieren archivo de video. Series se configuran después.'
      },
      {
        name: 'title',
        type: 'text',
        label: 'Título',
        placeholder: 'Nombre de la película o serie',
        required: true,
        leftIcon: '🎬',
        width: 'half'
      },
      {
        name: 'year',
        type: 'number',
        label: 'Año de Lanzamiento',
        placeholder: '2024',
        required: true,
        leftIcon: '📅',
        width: 'half',
        min: 1900,
        max: new Date().getFullYear() + 2
      },
      {
        name: 'categoryId',
        type: 'select',
        label: 'Categoría',
        placeholder: categoriesLoading ? 'Cargando...' : 'Selecciona una categoría',
        required: true,
        options: categoryOptions,
        leftIcon: '🏷️',
        width: 'half',
        disabled: categoriesLoading
      },
      {
        name: 'overview',
        type: 'textarea',
        label: 'Descripción',
        placeholder: 'Sinopsis o descripción del contenido...',
        required: false,
        leftIcon: '📝',
        width: 'full',
        rows: 4
      },
      {
        name: 'video',
        type: 'file',
        label: 'Archivo de Video',
        placeholder: 'Arrastra o selecciona el archivo de video',
        required: false, // Dinámico según tipo
        accept: 'video/*',
        leftIcon: '🎥',
        width: 'full',
        helperText: 'Solo requerido para películas. Formatos: MP4, WebM, AVI (máx. 500MB)'
      },
      {
        name: 'coverImage',
        type: 'file',
        label: 'Imagen de Portada',
        placeholder: 'Arrastra o selecciona una imagen',
        required: false, // Se rellena automáticamente desde TMDB
        accept: 'image/*',
        leftIcon: '🖼️',
        width: 'full',
        helperText: 'Opcional si seleccionaste desde TMDB. Formatos: JPG, PNG, WebP (máx. 10MB)'
      }
    ];
  };

  // ===== RENDER =====
  return (
    <AdminLayout>
      <Container size="xl">
        
        {/* Header */}
        <div className="page-header">
          <div className="page-header__main">
            <h1 className="page-title">Agregar Contenido</h1>
            <p className="page-description">
              Busca en TMDB o agrega manualmente películas y series al catálogo
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleGoBack}
            disabled={formLoading || isTranscoding}
          >
            ← Volver
          </Button>
        </div>

        {/* Errores de categorías */}
        {categoriesError && (
          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-danger-light)',
            border: '0.1rem solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger-dark)',
            marginBottom: 'var(--space-lg)'
          }}>
            <h4 style={{ margin: '0 0 var(--space-sm) 0', fontWeight: 'var(--font-weight-semibold)' }}>
              Error de Categorías
            </h4>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>{categoriesError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCategories}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Error general */}
        {error && (
          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-danger-light)',
            border: '0.1rem solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger-dark)',
            marginBottom: 'var(--space-lg)'
          }}>
            <h4 style={{ margin: '0 0 var(--space-sm) 0', fontWeight: 'var(--font-weight-semibold)' }}>
              Error
            </h4>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
            >
              Cerrar
            </Button>
          </div>
        )}

        {/* Éxito */}
        {success && !isTranscoding && (
          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-success-light)',
            border: '0.1rem solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-success-dark)',
            marginBottom: 'var(--space-lg)'
          }}>
            <h4 style={{ margin: '0 0 var(--space-sm) 0', fontWeight: 'var(--font-weight-semibold)' }}>
              ¡Contenido Creado!
            </h4>
            <p style={{ margin: '0' }}>El contenido se ha agregado exitosamente al catálogo.</p>
          </div>
        )}

        {/* Vista actual */}
        {currentView === 'search' && (
          <TMDBSearchView
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            sortBy="year-desc" 
            onSortChange={() => {}} // Implementar si necesitas sorting
            results={searchResults}
            loading={searchLoading}
            error={searchError}
            onSearch={handleSearch}
            onClearResults={() => {
              setSearchResults([]);
              setSearchQuery('');
              setSearchError(null);
            }}
            onSelectItem={handleItemSelect}
            onManualCreate={() => setCurrentView('form')}
            contentType="all"
            title="🎬 Buscar en TMDB"
            description="Busca películas y series en la base de datos de TMDB para agregar al catálogo"
            placeholder="Ej: Avatar, Breaking Bad, Inception..."
            helperText="Busca por título, año o palabras clave"
            showManualCreate={true}
          />
        )}

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

      {/* ✅ NUEVO: Modal de Progreso de Transcodificación */}
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
        allowClose={false} // No permitir cerrar durante procesamiento
        showRetry={true}
        showViewContent={true}
      />

    </AdminLayout>
  );
}

export { MovieCreatePage };