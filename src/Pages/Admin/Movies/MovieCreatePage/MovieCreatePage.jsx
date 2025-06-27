// ===== MOVIE CREATE PAGE - VERSIÓN CORREGIDA CON TMDB FUNCIONANDO =====
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
 * MovieCreatePage - VERSIÓN CORREGIDA CON TMDB FUNCIONANDO
 * ✅ CORREGIDO: TMDBSearchView maneja su propia búsqueda
 * ✅ CORREGIDO: Carga de categorías funcional
 * ✅ CORREGIDO: Separación clara de responsabilidades
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

  // ===== DEBUG: Estado de categorías =====
  useEffect(() => {
    console.log('🎬 MovieCreatePage - Estado de categorías:', {
      loading: categoriesLoading,
      error: categoriesError,
      count: categories.length,
      categories: categories.slice(0, 3) // Solo las primeras 3 para debug
    });
  }, [categoriesLoading, categoriesError, categories]);

  // ===== FUNCIONES DE CARGA INICIAL - CORREGIDAS =====

  /**
   * ✅ FUNCIÓN COMPLETAMENTE CORREGIDA: loadCategories
   * Maneja correctamente la respuesta directa del servicio
   */
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      console.log('📋 Cargando categorías desde el servicio...');

      // ✅ CORRECCIÓN: El servicio getCategoriesService() devuelve directamente un array
      const response = await getCategoriesService();
      console.log('📋 Respuesta cruda del servicio:', response);

      // ✅ NORMALIZAR: Asegurar que tenemos un array válido
      let categoriesArray = [];

      if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (response && response.categories && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      } else {
        console.warn('⚠️ Respuesta inesperada del servicio:', response);
        categoriesArray = [];
      }

      // Validar datos
      if (categoriesArray.length === 0) {
        console.warn('⚠️ No hay categorías disponibles');
        setCategoriesError('No hay categorías disponibles. Ve a Administrar > Categorías para crear al menos una.');
        setCategories([]);
        return;
      }

      // ✅ MAPEAR: Asegurar estructura consistente
      const normalizedCategories = categoriesArray
        .filter(cat => cat && cat.id && cat.name) // Filtrar categorías válidas
        .map(cat => ({
          id: Number(cat.id), // Asegurar que sea número
          name: String(cat.name).trim() // Asegurar que sea string limpio
        }));

      if (normalizedCategories.length === 0) {
        setCategoriesError('Las categorías disponibles no tienen el formato correcto.');
        setCategories([]);
        return;
      }

      console.log('✅ Categorías normalizadas:', normalizedCategories);
      setCategories(normalizedCategories);

    } catch (err) {
      console.error('❌ Error al cargar categorías:', err);

      // ✅ MANEJO DE ERRORES ESPECÍFICOS
      let errorMessage = 'Error desconocido al cargar categorías';

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

  // ===== FUNCIONES DE NAVEGACIÓN - SIMPLIFICADAS =====

  /**
   * ✅ SIMPLIFICADO: Seleccionar item de TMDB y ir al formulario
   * TMDBSearchView maneja su propia búsqueda, nosotros solo recibimos el resultado
   */
  const handleItemSelect = (item) => {
    console.log('🎯 Item seleccionado de TMDB:', item);
    setSelectedItem(item);
    setCurrentView('form');
    setHasChanges(false);
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
  };

  /**
   * ✅ SIMPLIFICADO: Crear contenido directamente sin TMDB
   */
  const handleCreateDirect = () => {
    console.log('✏️ Creación directa sin TMDB');
    setSelectedItem(null);
    setCurrentView('form');
    setHasChanges(false);
  };

  // ===== FUNCIONES DEL FORMULARIO - CORREGIDAS =====

  /**
   * ✅ CORREGIDO: Genera campos del formulario con categorías funcionando
   */
  const generateFormFields = (item) => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título',
        placeholder: 'Título de la película o serie',
        required: true,
        maxLength: 255
      },
      {
        name: 'original_title',
        type: 'text',
        label: 'Título Original',
        placeholder: 'Título en idioma original',
        maxLength: 255
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción',
        placeholder: 'Sinopsis o descripción del contenido',
        required: true,
        rows: 4,
        maxLength: 1000
      },
      {
        name: 'year',
        type: 'number',
        label: 'Año de Lanzamiento',
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
        label: 'Categoría *',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        required: true,
        loading: categoriesLoading,
        disabled: categoriesLoading || categories.length === 0,
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
   * ✅ CORREGIDO: Genera datos iniciales del formulario con valores por defecto
   */
  const generateInitialFormData = (item) => {
    const baseData = {
      title: '',
      original_title: '',
      description: '',
      year: new Date().getFullYear(),
      duration: 120,
      rating: 0,
      poster_url: '',
      category_id: categories.length > 0 ? categories[0].id : '',
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
        duration: item.type === 'tv' || item.media_type === 'tv' ? 1 : 120,
        rating: item.vote_average || item.rating || baseData.rating,
        poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` :
          item.poster ? (item.poster.startsWith('http') ? item.poster : `https://image.tmdb.org/t/p/w500${item.poster}`) :
            baseData.poster_url,
        tmdb_id: item.id || item.tmdb_id,
        media_type: item.media_type || item.type || 'movie'
      };
    }

    return baseData;
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

      console.log('✅ Respuesta del servicio:', response);

      // Mostrar éxito
      setSuccess(true);
      setHasChanges(false);

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/movies');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear contenido:', err);
      setError(`Error al crear el contenido: ${err.message}`);
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
  };

  // ===== VALIDACIÓN UI =====

  /**
   * ✅ VALIDACIÓN: No mostrar formulario si no hay categorías cargadas
   */
  const canShowForm = !categoriesLoading && categories.length > 0;

  // ===== RENDER =====

  return (
    <AdminLayout
      title={currentView === 'search' ? 'Agregar Contenido' : 'Configurar Contenido'}
      subtitle={currentView === 'search' ?
        'Busca en TMDB o crea contenido manualmente' :
        'Completa la información del contenido'
      }
    >
      <Container
        size="full"
        className={`${formLoading ? 'movie-create--loading' : ''}`}
      >

        {/* ===== VISTA DE BÚSQUEDA TMDB - SIMPLIFICADA ===== */}
        {currentView === 'search' && (
          <TMDBSearchView
            // ✅ SIMPLIFICADO: Solo handlers esenciales
            onSelectItem={handleItemSelect}
            onManualCreate={handleCreateDirect}

            // Configuración básica
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
                      <h3>⏳ Cargando configuración...</h3>
                      <p>Obteniendo categorías disponibles...</p>
                    </>
                  ) : (
                    <>
                      <h3>⚠️ Configuración requerida</h3>
                      <p>No hay categorías disponibles para clasificar el contenido.</p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/admin/categories/create')}
                        leftIcon="➕"
                      >
                        Crear Primera Categoría
                      </Button>
                      <br />
                      <Button
                        variant="outline"
                        onClick={() => setCurrentView('search')}
                        style={{ marginTop: 'var(--space-md)' }}
                      >
                        Volver a Búsqueda
                      </Button>
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
                showBackButton={true}
                categoriesLoading={categoriesLoading}
              />
            )}
          </>
        )}

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

      </Container>
    </AdminLayout>
  );
}

export { MovieCreatePage };