// ===== SERIES CREATE PAGE - BASADO EN MOVIECREATEPAGE =====
// src/Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { SeriesFormView } from './components/SeriesFormView';

// ===== SERVICIOS Y HOOKS =====
import { createSeriesService } from '../../../../services/Series/createSeriesService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { tmdbService } from '../../../../services/tmdb/TMDBService';
import { UploadProgress } from "../../../../components/atoms/UploadProgress/UploadProgress";
import { useUploadProgress } from "../../../../hooks/useUploadProgress";

// ===== ESTILOS =====
import './SeriesCreatePage.css';

/**
 * SeriesCreatePage - Página para crear series usando TMDB y formulario manual
 * ✅ INTEGRACIÓN TMDB: Conecta con la API real para buscar series
 * ✅ FORMULARIO OPTIMIZADO: Campos específicos para series según el sistema de diseño
 * ✅ SERVICIO CORRECTO: Usa createSeriesService existente
 * ✅ FILTRO DE CAMPOS: Solo envía campos con valores al backend
 * ✅ MANEJO DE ERRORES: Validaciones y estados de error mejorados
 * ✅ UX MEJORADA: Estados de carga, confirmaciones, navegación fluida
 */
function SeriesCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [currentView, setCurrentView] = useState('search'); // 'search' | 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== HOOK DE PROGRESO =====
  const { progress, status, message, progressError, startProgress, updateProgress, completeProgress, errorProgress } = useUploadProgress();

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
  }, []);

  // ===== FUNCIONES DE CARGA =====
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await getCategoriesService();
      setCategories(data || []);
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      setCategoriesError('Error al cargar categorías');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ===== MANEJADORES DE EVENTOS =====

  /**
   * Manejar selección de elemento desde TMDB
   */
  const handleSelectFromTMDB = (item) => {
    console.log('📺 Serie seleccionada desde TMDB:', item);
    setSelectedItem(item);
    setCurrentView('form');
    setSubmitError(null);
    setSuccess(false);
    setHasChanges(false);
  };

  /**
   * Manejar creación manual (sin TMDB)
   */
  const handleManualCreate = () => {
    console.log('📝 Creación manual de serie');
    setSelectedItem(null);
    setCurrentView('form');
    setSubmitError(null);
    setSuccess(false);
    setHasChanges(false);
  };

  /**
   * Regresar a la búsqueda
   */
  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }
    
    setCurrentView('search');
    setSelectedItem(null);
    setSubmitError(null);
    setSuccess(false);
    setHasChanges(false);
  };

  /**
   * Filtrar campos vacíos antes de enviar
   */
  const filterEmptyFields = (formData) => {
    const filteredData = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File) {
          filteredData[key] = value;
        } else if (typeof value === 'string' && value.trim()) {
          filteredData[key] = value.trim();
        } else if (typeof value === 'number' && !isNaN(value)) {
          filteredData[key] = value;
        } else if (typeof value === 'boolean') {
          filteredData[key] = value;
        }
      }
    });

    return filteredData;
  };

  /**
   * Manejar envío del formulario
   */
  const handleFormSubmit = async (formData) => {
    console.log('📤 Enviando datos de serie:', formData);
    
    try {
      setFormLoading(true);
      setSubmitError(null);
      startProgress();

      // Validar campos requeridos específicos para series
      if (!formData.title?.trim()) {
        throw new Error('El título es requerido');
      }
      
      if (!formData.categoryId) {
        throw new Error('La categoría es requerida');
      }

      // Determinar imagen de portada (prioridad: archivo > URL > TMDB)
      let coverImage = null;
      if (formData.coverImageFile && formData.coverImageFile instanceof File) {
        coverImage = formData.coverImageFile;
      } else if (formData.coverImageUrl?.trim()) {
        coverImage = formData.coverImageUrl.trim();
      } else if (selectedItem?.poster_path) {
        coverImage = selectedItem.poster_path;
      }

      if (!coverImage) {
        throw new Error('La imagen de portada es requerida');
      }

      // Filtrar campos vacíos y preparar datos finales
      const filteredData = filterEmptyFields({
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        releaseYear: formData.releaseYear || new Date().getFullYear(),
        tmdb_id: selectedItem?.id || formData.tmdb_id,
        media_type: 'tv' // Series siempre son 'tv'
      });

      // Agregar imagen de portada
      filteredData.coverImage = coverImage;

      updateProgress(50, 'Procesando datos de la serie...');

      // Llamar al servicio para crear la serie
      const result = await createSeriesService(filteredData);
      
      updateProgress(100, 'Serie creada exitosamente');
      completeProgress();
      
      console.log('✅ Serie creada exitosamente:', result);
      setSuccess(true);
      setHasChanges(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/series');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear serie:', err);
      errorProgress();
      
      let errorMessage = 'Error inesperado al crear la serie';
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear series.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Esta serie ya existe en el sistema.';
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

  // ===== GENERACIÓN DE CAMPOS DEL FORMULARIO =====
  const generateFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título de la Serie *',
        placeholder: 'Ej: Breaking Bad, Game of Thrones...',
        required: true,
        leftIcon: '📺',
        helperText: 'Nombre oficial o título principal de la serie',
        maxLength: 200,
        showCharCount: true
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Sinopsis/Descripción',
        placeholder: 'Escribe una descripción atractiva de la serie...',
        leftIcon: '📝',
        helperText: 'Resumen de la trama y características principales',
        maxLength: 1000,
        showCharCount: true,
        rows: 4
      },
      {
        name: 'releaseYear',
        type: 'number',
        label: 'Año de Estreno *',
        placeholder: new Date().getFullYear(),
        required: true,
        leftIcon: '📅',
        helperText: 'Año en que se estrenó la primera temporada',
        min: 1900,
        max: new Date().getFullYear() + 5
      },
      {
        name: 'categoryId',
        type: 'select',
        label: (() => {
          if (categoriesError) return '❌ Error al cargar categorías';
          if (categoriesLoading) return '⏳ Cargando categorías...';
          return `📋 Categoría Principal * (${categories.length} disponibles)`;
        })(),
        placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
        required: true,
        leftIcon: '🏷️',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        disabled: categoriesLoading || categories.length === 0,
        helperText: categoriesError || 'Categoría principal para organizar la serie'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'opcional@ejemplo.com',
        leftIcon: '📧',
        helperText: 'Correo de contacto opcional (no se enviará si está vacío)'
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
      }
    ];
  };

  // ===== GENERACIÓN DE DATOS INICIALES =====
  const generateInitialFormData = (item) => {
    const baseData = {
      title: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      categoryId: categories.length > 0 ? categories[0].id : '',
      email: '',
      coverImageUrl: '',
      coverImageFile: null,
      tmdb_id: null,
      media_type: 'tv'
    };

    // Si hay un item de TMDB, llenar con sus datos
    if (item) {
      return {
        ...baseData,
        title: item.name || item.title || baseData.title,
        description: item.overview || baseData.description,
        releaseYear: item.year || (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 
          item.release_date ? new Date(item.release_date).getFullYear() : baseData.releaseYear),
        coverImageUrl: item.poster_path || baseData.coverImageUrl,
        tmdb_id: item.id || item.tmdb_id || baseData.tmdb_id,
        media_type: 'tv'
      };
    }

    return baseData;
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <AdminLayout>
      <Container size='lg'>
        <div className={`series-create-page ${formLoading ? 'series-create--loading' : ''}`}>
          {/* Header */}
          <Card className="series-create-page__header">
            <CardHeader>
              <CardTitle>
                {currentView === 'search' ? '🔍 Buscar Series' : '📺 Crear Serie'}
              </CardTitle>
              <p className="series-create-page__description">
                {currentView === 'search'
                  ? 'Busca series en TMDB o crea series manualmente'
                  : selectedItem
                    ? `Creando: ${selectedItem.name || selectedItem.title || 'Serie desde TMDB'}`
                    : 'Creando serie manualmente'
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
              contentType="tv"
              title="📺 Buscar Series en TMDB"
              description="Busca series en The Movie Database para agregar a tu catálogo"
              placeholder="Ej: Breaking Bad, Game of Thrones, The Office..."
              helperText="Busca por título, año o palabras clave"
              showManualCreate={true}
            />
          )}

          {currentView === 'form' && (
            <SeriesFormView
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
        <div className="series-create-page__progress">
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

export { SeriesCreatePage };