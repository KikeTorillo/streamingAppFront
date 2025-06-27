// ===== MOVIE CREATE PAGE - VERSIÓN SIMPLIFICADA Y CORREGIDA =====
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

/**
 * MovieCreatePage - VERSIÓN SIMPLIFICADA CON TMDBSearchView AUTOCONTENIDO
 * ✅ SIMPLIFICADO: TMDBSearchView maneja su propia búsqueda internamente
 * ✅ CORREGIDO: Campos de formulario optimizados sin rating/duration innecesarios
 * ✅ MEJORADO: Mejor integración con sistema de diseño
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState('search'); // 'search' | 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
  }, []);

  // ===== CARGA DE CATEGORÍAS =====
  const loadCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      console.log('📋 Cargando categorías...');
      const categoriesData = await getCategoriesService();

      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData);
        console.log(`✅ ${categoriesData.length} categorías cargadas`);
      } else {
        throw new Error('No se encontraron categorías');
      }

    } catch (err) {
      console.error('❌ Error cargando categorías:', err);

      let errorMessage = 'Error desconocido al cargar categorías.';
      if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para ver las categorías.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Servicio de categorías no encontrado.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setCategoriesError(errorMessage);

      // ✅ FALLBACK: Categorías de ejemplo para desarrollo
      console.log('🔧 Aplicando fallback de categorías para desarrollo');
      setCategories([
        { id: 1, name: 'General' },
        { id: 2, name: 'Acción' },
        { id: 3, name: 'Drama' },
        { id: 4, name: 'Comedia' },
        { id: 5, name: 'Terror' }
      ]);

    } finally {
      setCategoriesLoading(false);
    }
  };

  // ===== FUNCIONES DE NAVEGACIÓN =====

  /**
   * ✅ SIMPLIFICADO: Seleccionar item de TMDB y ir al formulario
   */
  const handleItemSelect = (item) => {
    console.log('🎯 Item seleccionado de TMDB:', item);
    setSelectedItem(item);
    setCurrentView('form');
    setHasChanges(false);
    setError(null);
  };

  /**
   * Volver a la búsqueda desde el formulario
   */
  const handleBackToSearch = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres volver? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }

    setCurrentView('search');
    setSelectedItem(null);
    setHasChanges(false);
    setSuccess(false);
    setError(null);
    clearProgress();
  };

  /**
   * ✅ SIMPLIFICADO: Crear contenido directamente sin TMDB
   */
  const handleCreateDirect = () => {
    console.log('✏️ Creación directa sin TMDB');
    setSelectedItem(null);
    setCurrentView('form');
    setHasChanges(false);
    setError(null);
  };

  // ===== CAMPOS DEL FORMULARIO OPTIMIZADOS =====

  /**
   * ✅ CAMPOS OPTIMIZADOS: Solo los campos esenciales que necesitas
   * ❌ REMOVIDO: rating, duration (calificación y duración innecesarias)
   * ✅ AGREGADO: Soporte completo para coverImage (URL + File)
   */
  const generateFormFields = (item) => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título *',
        placeholder: 'Título de la película o serie',
        required: true,
        maxLength: 255,
        leftIcon: '🎬'
      },
      {
        name: 'original_title',
        type: 'text',
        label: 'Título Original',
        placeholder: 'Título en idioma original',
        maxLength: 255,
        leftIcon: '🌍'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción *',
        placeholder: 'Sinopsis o descripción del contenido',
        required: true,
        rows: 4,
        maxLength: 1000,
        leftIcon: '📝'
      },
      {
        name: 'year',
        type: 'number',
        label: 'Año de Lanzamiento *',
        placeholder: '2024',
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5,
        leftIcon: '📅'
      },
      {
        name: 'category_id',
        type: 'select',
        label: 'Categoría *',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        required: true,
        loading: categoriesLoading,
        disabled: categoriesLoading || categories.length === 0,
        leftIcon: '📋',
        helperText: (() => {
          if (categoriesLoading) return '⏳ Cargando categorías disponibles...';
          if (categoriesError) return `❌ ${categoriesError}`;
          if (categories.length === 0) return '⚠️ No hay categorías. Ve a Administrar > Categorías para crear una.';
          return `📋 Selecciona la categoría principal (${categories.length} disponibles)`;
        })(),
        placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
        defaultValue: categories.length > 0 ? categories[0].id : undefined
      },
      {
        name: 'coverImageUrl',
        type: 'text',
        label: 'URL de Portada',
        placeholder: 'https://ejemplo.com/imagen.jpg',
        leftIcon: '🔗',
        helperText: 'URL de la imagen de portada (opcional si subes archivo)'
      },
      {
        name: 'coverImageFile',
        type: 'file',
        label: 'Archivo de Portada',
        accept: 'image/*',
        leftIcon: '🖼️',
        helperText: 'Sube una imagen como portada (opcional si usas URL)'
      },
      {
        name: 'video_file',
        type: 'file',
        label: 'Archivo de Video *',
        accept: 'video/*',
        required: true,
        leftIcon: '🎥',
        helperText: 'Archivo de video a subir (formatos: mp4, avi, mkv, webm)'
      }
    ];
  };

  /**
   * ✅ DATOS INICIALES OPTIMIZADOS: Sin campos innecesarios
   */
  const generateInitialFormData = (item) => {
    const baseData = {
      title: '',
      original_title: '',
      description: '',
      year: new Date().getFullYear(),
      category_id: categories.length > 0 ? categories[0].id : '',
      coverImageUrl: '',
      coverImageFile: null,
      video_file: null,
      tmdb_id: null,
      media_type: 'movie'
    };

    // Si hay un item de TMDB, llenar con sus datos
    if (item) {
      return {
        ...baseData,
        title: item.title || item.name || baseData.title,
        original_title: item.original_title || item.original_name || baseData.original_title,
        description: item.overview || baseData.description,
        year: item.year || (item.release_date ? new Date(item.release_date).getFullYear() :
          item.first_air_date ? new Date(item.first_air_date).getFullYear() : baseData.year),
        coverImageUrl: item.poster_path ?
          `https://image.tmdb.org/t/p/w500${item.poster_path}` :
          (item.poster && item.poster.startsWith('http') ? item.poster : baseData.coverImageUrl),
        tmdb_id: item.id || item.tmdb_id || baseData.tmdb_id,
        media_type: item.type || item.media_type || (item.name ? 'tv' : 'movie')
      };
    }

    return baseData;
  };

  // ===== FUNCIONES DEL FORMULARIO =====

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);
    startProgress();

    try {
      console.log('📤 Enviando formulario:', formData);

      // Preparar datos para envío
      const submitData = new FormData();

      // Campos básicos
      submitData.append('title', formData.title || '');
      submitData.append('original_title', formData.original_title || '');
      submitData.append('description', formData.description || '');
      submitData.append('year', formData.year || new Date().getFullYear());
      submitData.append('category_id', formData.category_id || '');

      // Imagen de portada: priorizar archivo sobre URL
      if (formData.coverImageFile) {
        submitData.append('coverImage', formData.coverImageFile);
      } else if (formData.coverImageUrl) {
        submitData.append('coverImageUrl', formData.coverImageUrl);
      }

      // Video (requerido)
      if (formData.video_file) {
        submitData.append('video', formData.video_file);
      }

      // Datos TMDB (si aplica)
      if (formData.tmdb_id) {
        submitData.append('tmdb_id', formData.tmdb_id);
      }
      submitData.append('media_type', formData.media_type || 'movie');

      // Seleccionar servicio según tipo de contenido
      const createService = formData.media_type === 'tv' ? createSeriesService : createMovieService;

      const result = await createService(submitData);

      console.log('✅ Contenido creado exitosamente:', result);
      setSuccess(true);
      setHasChanges(false);

      // Mostrar mensaje de éxito
      setTimeout(() => {
        navigate('/admin/movies');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear contenido:', err);

      let errorMessage = 'Error desconocido al crear el contenido.';
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear contenido.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setFormLoading(false);
      stopProgress();
    }
  };

  const handleFormChange = (formData) => {
    setHasChanges(true);
  };

  // ===== VALIDACIONES =====
  const canShowForm = !categoriesLoading && categories.length > 0;

  // ===== RENDER PRINCIPAL =====
  return (
    <>
      <AdminLayout
        title={currentView === 'search' ?
          'Agregar Contenido' : 'Configurar Contenido'}
        subtitle={currentView === 'search' ?
          'Busca en TMDB o crea contenido manualmente' :
          'Completa la información del contenido'
        }
      >
        <Container
          size="full"
          className={`${formLoading ? 'movie-create--loading' : ''}`}
        >

          {/* ===== VISTA DE BÚSQUEDA TMDB ===== */}
          {currentView === 'search' && (
            <TMDBSearchView
              onSelectItem={handleItemSelect}
              onManualCreate={handleCreateDirect}
              contentType="all"
              title="🎬 Buscar en TMDB"
              description="Busca películas y series en la base de datos de TMDB para agregar al catálogo"
              placeholder="Ej: Avatar, Breaking Bad, Inception..."
              helperText="Busca por título, año o palabras clave"
              showManualCreate={true}
            />
          )}

          {/* ===== VISTA DE FORMULARIO ===== */}
          {currentView === 'form' && (
            <>
              {!canShowForm ? (
                <Container size="md">
                  <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-xl)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-default)'
                  }}>
                    {categoriesLoading ? (
                      <>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⏳</div>
                        <h3>Cargando categorías...</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          Espera mientras cargamos las categorías disponibles.
                        </p>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>❌</div>
                        <h3>Error al cargar categorías</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                          {categoriesError}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                          <Button
                            variant="primary"
                            onClick={loadCategories}
                          >
                            🔄 Reintentar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleBackToSearch}
                          >
                            ← Volver a Búsqueda
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Container>
              ) : (
                <MovieFormView
                  selectedItem={selectedItem}
                  formFields={generateFormFields(selectedItem)}
                  initialFormData={generateInitialFormData(selectedItem)}
                  formLoading={formLoading}
                  success={success}
                  hasChanges={hasChanges}
                  onSubmit={handleFormSubmit}
                  onChange={handleFormChange}
                  onBackToSearch={handleBackToSearch}
                  categoryOptions={categories}
                  categoriesLoading={categoriesLoading}
                  showBackButton={true}
                />
              )}

              {error && (
                <Container size="md" style={{ marginTop: 'var(--space-lg)' }}>
                  <div style={{
                    padding: 'var(--space-lg)',
                    background: 'var(--color-danger-light)',
                    border: '1px solid var(--color-danger)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-danger-dark)'
                  }}>
                    <h4 style={{ margin: '0 0 var(--space-sm) 0' }}>❌ Error</h4>
                    <p style={{ margin: 0 }}>{error}</p>
                  </div>
                </Container>
              )}
            </>
          )}
        </Container>
      </AdminLayout>

      {/* ===== MODAL DE PROGRESO ===== */}
      {isTranscoding && (
        <TranscodingModal
          isOpen={isTranscoding}
          progress={progress}
          status={status}
          message={message}
          error={progressError}
          contentInfo={contentInfo}
          onClose={() => {
            stopProgress();
            clearProgress();
          }}
        />
      )}
    </>
  );
}

export { MovieCreatePage };