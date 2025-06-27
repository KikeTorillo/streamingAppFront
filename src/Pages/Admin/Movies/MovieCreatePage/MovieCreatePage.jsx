// ===== MOVIE CREATE PAGE - VERSIÓN ACTUALIZADA CON TMDB REAL =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';

// ===== SERVICIOS Y HOOKS =====
import { createMovieService } from '../../../../services/Movies/createMovieService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { tmdbService } from '../../../../services/tmdb/TMDBService';
import { UploadProgress } from "../../../../components/atoms/UploadProgress/UploadProgress";
import { useUploadProgress } from "../../../../hooks/useUploadProgress";

// ===== ESTILOS =====
import './MovieCreatePage.css';

/**
 * MovieCreatePage - VERSIÓN ACTUALIZADA CON TMDB REAL
 * ✅ INTEGRACIÓN TMDB: Conecta con la API real usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas y series desde TMDB
 * ✅ FORMULARIO OPTIMIZADO: Campos correctos según el sistema de diseño
 * ✅ MANEJO DE ERRORES: Validaciones y estados de error mejorados
 * ✅ UX MEJORADA: Estados de carga, confirmaciones, navegación fluida
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
  const [submitError, setSubmitError] = useState(null);

  // ===== ESTADO DE PROGRESO DE SUBIDA =====
  const { progress, status, message, error: progressError, monitorProgress, resetProgress } = useUploadProgress();

  // ===== CARGAR CATEGORÍAS AL INICIO =====
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        console.log('📂 Cargando categorías...');
        const response = await getCategoriesService();

        const data = Array.isArray(response) ? response : response?.data;

        if (Array.isArray(data)) {
          setCategories(data);
          console.log(`✅ Categorías cargadas: ${data.length}`);
        } else {
          setCategories([]);
          setCategoriesError('No se encontraron categorías disponibles');
        }
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
        setCategoriesError('Error al cargar las categorías. Verifica tu conexión.');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ===== HANDLERS DE TMDB SEARCH =====
  const handleSelectFromTMDB = async (item) => {
    console.log('🎯 Item seleccionado desde TMDB:', item);
    
    try {
      // Obtener detalles completos del item seleccionado
      let detailedItem = item;
      
      if (item.type === 'movie') {
        console.log('🎬 Obteniendo detalles de película...');
        detailedItem = await tmdbService.getMovieDetails(item.tmdb_id);
      } else if (item.type === 'tv') {
        console.log('📺 Obteniendo detalles de serie...');
        detailedItem = await tmdbService.getTVDetails(item.tmdb_id);
      }

      setSelectedItem(detailedItem);
      setCurrentView('form');
      setHasChanges(true);

      console.log('✅ Datos completos obtenidos:', detailedItem);
      
    } catch (error) {
      console.error('❌ Error al obtener detalles:', error);
      // Si no se pueden obtener detalles, usar los datos básicos
      setSelectedItem(item);
      setCurrentView('form');
      setHasChanges(true);
    }
  };

  const handleManualCreate = () => {
    console.log('✏️ Creación manual seleccionada');
    setSelectedItem(null);
    setCurrentView('form');
    setHasChanges(true);
  };

  // ===== HANDLER DE VUELTA A BÚSQUEDA =====
  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }

    setSelectedItem(null);
    setCurrentView('search');
    setHasChanges(false);
    setSubmitError(null);
  };

  // ===== GENERACIÓN DE CAMPOS DEL FORMULARIO =====
  const generateFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título *',
        placeholder: 'Ej: Avatar: El Camino del Agua',
        required: true,
        leftIcon: '🎬',
        helperText: 'Título principal que aparecerá en el catálogo'
      },
      {
        name: 'original_title',
        type: 'text',
        label: 'Título Original',
        placeholder: 'Ej: Avatar: The Way of Water',
        leftIcon: '🌐',
        helperText: 'Título en el idioma original (opcional)'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción *',
        placeholder: 'Escribe una descripción atractiva del contenido...',
        required: true,
        rows: 4,
        leftIcon: '📝',
        helperText: 'Descripción que aparecerá en la página de detalles'
      },
      {
        name: 'releaseYear',
        type: 'number',
        label: 'Año de Estreno *',
        placeholder: new Date().getFullYear().toString(),
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5,
        leftIcon: '📅',
        helperText: 'Año de estreno original'
      },
      {
        name: 'categoryId',
        type: 'select',
        label: (() => {
          if (categoriesLoading) return '⏳ Cargando categorías...';
          if (categoriesError) return '❌ Error al cargar categorías';
          if (categories.length === 0) return '📋 Sin categorías disponibles - Ve a Administrar > Categorías para crear una.';
          return `📋 Selecciona la categoría principal (${categories.length} disponibles)`;
        })(),
        placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
        required: true,
        leftIcon: '🏷️',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        disabled: categoriesLoading || categories.length === 0,
        helperText: categoriesError || 'Categoría principal para organizar el contenido'
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
        name: 'video',
        type: 'file',
        label: 'Archivo de Video *',
        accept: 'video/*',
        required: true,
        leftIcon: '🎥',
        helperText: 'Archivo de video a subir (formatos: mp4, avi, mkv, webm)'
      }
    ];
  };

  // ===== GENERACIÓN DE DATOS INICIALES =====
  const generateInitialFormData = (item) => {
    const baseData = {
      title: '',
      original_title: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      categoryId: categories.length > 0 ? categories[0].id : '',
      coverImageUrl: '',
      coverImageFile: null,
      video: null,
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
        releaseYear: item.year || (item.release_date ? new Date(item.release_date).getFullYear() :
          item.first_air_date ? new Date(item.first_air_date).getFullYear() : baseData.releaseYear),
        coverImageUrl: item.poster_path || baseData.coverImageUrl,
        tmdb_id: item.id || item.tmdb_id || baseData.tmdb_id,
        media_type: item.type || item.media_type || (item.name ? 'tv' : 'movie')
      };
    }

    return baseData;
  };

  // ===== HANDLER DEL FORMULARIO =====
  const handleFormSubmit = async (movieData) => {
    setFormLoading(true);
    setSubmitError(null);

    try {
      console.log('📤 Enviando datos:', movieData);

      const result = await createMovieService(movieData);

      console.log('✅ Contenido creado exitosamente:', result);

      const taskId = result?.taskId || result?.task_id || result?.id;

      if (taskId) {
        monitorProgress(taskId, 'movies', null, (finished, err) => {
          if (finished) {
            setSuccess(true);
            setHasChanges(false);
            setTimeout(() => {
              navigate('/admin/movies');
              resetProgress();
            }, 2000);
          } else if (err) {
            setSubmitError(err);
            resetProgress();
          }
        });
      } else {
        setSuccess(true);
        setHasChanges(false);
        setTimeout(() => {
          navigate('/admin/movies');
        }, 2000);
      }

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

      setSubmitError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <AdminLayout>
      <Container>
        <div className="movie-create-page">
          {/* Header */}
          <Card className="movie-create-page__header">
            <CardHeader>
              <CardTitle>
                {currentView === 'search' ? '🔍 Buscar Contenido' : '📝 Crear Contenido'}
              </CardTitle>
              <p className="movie-create-page__description">
                {currentView === 'search' 
                  ? 'Busca películas y series en TMDB o crea contenido manualmente'
                  : selectedItem 
                    ? `Creando: ${selectedItem.title || selectedItem.name || 'Contenido desde TMDB'}`
                    : 'Creando contenido manualmente'
                }
              </p>
            </CardHeader>
            
            {currentView === 'form' && (
              <CardBody>
                <Button
                  variant="ghost"
                  leftIcon="←"
                  onClick={handleBackToSearch}
                  disabled={formLoading}
                >
                  Volver a búsqueda
                </Button>
              </CardBody>
            )}
          </Card>

          {/* Contenido principal */}
          {currentView === 'search' && (
            <TMDBSearchView
              onSelectItem={handleSelectFromTMDB}
              onManualCreate={handleManualCreate}
              contentType="all"
              title="🎬 Buscar en TMDB"
              description="Busca películas y series en The Movie Database para agregar a tu catálogo"
              placeholder="Ej: Avatar, Breaking Bad, Inception..."
              helperText="Busca por título, año o palabras clave"
              showManualCreate={true}
            />
          )}

          {currentView === 'form' && (
            <MovieFormView
              fields={generateFormFields()}
              initialData={generateInitialFormData(selectedItem)}
              onSubmit={handleFormSubmit}
              categoryOptions={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              loading={formLoading}
              error={submitError}
              success={success}
              hasChanges={hasChanges}
              onChange={() => setHasChanges(true)}
            />
          )}

        </div>
      </Container>
      {status !== 'idle' && (
        <div className="movie-create-page__progress">
          <UploadProgress
            progress={progress}
            status={status}
            message={progressError || message}
            size="md"
          />
        </div>
      )}
    </AdminLayout>
  );
}

export { MovieCreatePage };