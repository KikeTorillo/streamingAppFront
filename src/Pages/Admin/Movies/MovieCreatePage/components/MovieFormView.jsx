// ===== MOVIE FORM VIEW - VERSIÓN CORREGIDA SIN CAMPOS INNECESARIOS =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Container } from '../../../../../components/atoms/Container/Container';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import './MovieFormView.css';

/**
 * MovieFormView - VERSIÓN OPTIMIZADA Y CORREGIDA
 * ❌ REMOVIDO: rating, duration (campos innecesarios)
 * ✅ CORREGIDO: Soporte completo para URL + archivo de imagen
 * ✅ MEJORADO: Indicadores visuales del tipo de imagen seleccionada
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 */
function MovieFormView({
  // Item seleccionado de TMDB (opcional)
  selectedItem = null,

  // Configuración del formulario
  formFields = [],
  initialFormData = {},

  // Estados del formulario
  formLoading = false,
  success = false,
  hasChanges = false,

  // Handlers principales
  onSubmit,
  onChange,
  onBackToSearch,

  // Datos adicionales
  categoryOptions = [],

  // Configuración de UI
  showBackButton = true,
  categoriesLoading = false
}) {

  // ===== ESTADOS LOCALES =====
  const [currentFormData, setCurrentFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState(null); // 'url', 'file', 'tmdb', null

  // ===== EFECTOS =====

  /**
   * Actualizar datos del formulario cuando cambia initialFormData
   */
  useEffect(() => {
    setCurrentFormData(initialFormData);
  }, [initialFormData]);

  /**
   * ✅ CORREGIDO: Analizar tipo de imagen y generar preview
   */
  useEffect(() => {
    const { coverImageUrl, coverImageFile } = currentFormData;

    // Prioridad: archivo > URL > TMDB
    if (coverImageFile && coverImageFile instanceof File) {
      setImageType('file');
      try {
        const previewUrl = URL.createObjectURL(coverImageFile);
        setImagePreview(previewUrl);

        // Cleanup para evitar memory leaks
        return () => URL.revokeObjectURL(previewUrl);
      } catch (error) {
        console.error('❌ Error creando preview del archivo:', error);
        setImagePreview(null);
      }
    } else if (coverImageUrl && typeof coverImageUrl === 'string' && coverImageUrl.trim()) {
      if (coverImageUrl.includes('image.tmdb.org')) {
        setImageType('tmdb');
      } else {
        setImageType('url');
      }
      setImagePreview(coverImageUrl);
    } else {
      setImageType(null);
      setImagePreview(null);
    }
  }, [currentFormData.coverImageUrl, currentFormData.coverImageFile]);

  // ===== FUNCIONES AUXILIARES =====

  const getFormTitle = () => {
    return selectedItem ? 'Confirmar Información de TMDB' : 'Información del Contenido';
  };

  const getFormDescription = () => {
    return selectedItem ?
      'Revisa y completa los datos obtenidos de TMDB. Los campos se rellenan automáticamente pero puedes modificarlos.' :
      'Completa todos los campos requeridos para agregar la película o serie al catálogo.';
  };

  /**
   * ✅ NUEVO: Obtener información descriptiva del tipo de imagen
   */
  const getImageTypeInfo = () => {
    switch (imageType) {
      case 'tmdb':
        return {
          badge: '🌐 TMDB',
          description: 'Imagen de alta calidad desde TMDB',
          bgClass: 'movie-form-view__image-info--tmdb'
        };
      case 'file':
        return {
          badge: '📁 Archivo',
          description: `Archivo subido: ${currentFormData.coverImageFile?.name || 'Unknown'}`,
          bgClass: 'movie-form-view__image-info--file'
        };
      case 'url':
        return {
          badge: '🔗 URL Externa',
          description: 'Imagen desde enlace externo',
          bgClass: 'movie-form-view__image-info--url'
        };
      default:
        return null;
    }
  };

  /**
   * Manejar envío del formulario con validaciones
   */
  const handleFormSubmit = (formData) => {
    onSubmit?.(formData);
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setCurrentFormData(formData);
    onChange?.(formData);
  };

  /**
   * ✅ NUEVO: Renderizar información de la imagen actual
   */
  const renderImageInfo = () => {
    const imageInfo = getImageTypeInfo();
    if (!imageInfo) return null;

    return (
      <div className={`movie-form-view__image-info ${imageInfo.bgClass}`}>
        <span className="movie-form-view__image-badge">{imageInfo.badge}</span>
        <span className="movie-form-view__image-text">{imageInfo.description}</span>
      </div>
    );
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="movie-form-view">

      {/* ===== VISTA PREVIA DEL ITEM SELECCIONADO (TMDB) ===== */}
      {selectedItem && (
        <Card className="movie-form-view__preview-card">
          <CardHeader>
            <div className="movie-form-view__preview-header">
              <CardTitle>
                🎬 Información de TMDB
              </CardTitle>
              {showBackButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onBackToSearch}
                  disabled={formLoading}
                  leftIcon="←"
                >
                  Buscar Otro
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="movie-form-view__preview">
              {/* Poster */}
              {selectedItem.poster_path && (
                <div className="movie-form-view__preview-poster">
                  <ContentImage
                    src={selectedItem.poster_path.startsWith('http') ?
                      selectedItem.poster_path :
                      `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
                    }
                    alt={`Poster de ${selectedItem.title || selectedItem.name}`}
                    fallbackIcon="🎬"
                    className="movie-form-view__poster-image"
                  />
                </div>
              )}

              {/* Información */}
              <div className="movie-form-view__preview-info">
                <h3 className="movie-form-view__preview-title">
                  {selectedItem.title || selectedItem.name}
                </h3>

                <div className="movie-form-view__preview-meta">
                  <span>
                    {selectedItem.type === 'tv' ? '📺 Serie' : '🎬 Película'}
                  </span>
                  {selectedItem.year && <span>📅 {selectedItem.year}</span>}
                  {selectedItem.rating && <span>⭐ {selectedItem.rating}</span>}
                </div>

                {selectedItem.overview && (
                  <p className="movie-form-view__preview-overview">
                    {selectedItem.overview}
                  </p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== FORMULARIO PRINCIPAL ===== */}
      <Card>
        <CardHeader>
          <div className="movie-form-view__form-header">
            <CardTitle>{getFormTitle()}</CardTitle>
            {!selectedItem && showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToSearch}
                disabled={formLoading}
                leftIcon="←"
              >
                Volver a Búsqueda
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <p className="movie-form-view__form-description">
            {getFormDescription()}
          </p>

          {/* ===== VISTA PREVIA DE IMAGEN ACTUAL ===== */}
          {imagePreview && (
            <div className="movie-form-view__current-image">
              <h4>🖼️ Imagen de Portada Actual</h4>

              {renderImageInfo()}

              <div className="movie-form-view__image-preview">
                <ContentImage
                  src={imagePreview}
                  alt="Vista previa de la portada"
                  fallbackIcon="🎬"
                  className="movie-form-view__preview-image"
                />
              </div>
            </div>
          )}

          {/* ===== FORMULARIO DINÁMICO ===== */}
          <div className="movie-form-view__form">
            <DynamicForm
              fields={formFields}
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              initialData={currentFormData}
              columnsPerRow={2}
              submitText={success ? "✅ Guardado Exitosamente" : "💾 Guardar Contenido"}
              submitVariant={success ? "success" : "primary"}
              submitSize="lg"
              loading={formLoading}
              disabled={formLoading || success}
              fieldSize="md"
              validateOnChange={true}
            />
          </div>

          {/* ===== MENSAJE DE ÉXITO ===== */}
          {success && (
            <div className="movie-form-view__success">
              <div className="movie-form-view__success-icon">✅</div>
              <h4 className="movie-form-view__success-title">
                ¡Contenido creado exitosamente!
              </h4>
              <p className="movie-form-view__success-message">
                El contenido ha sido agregado al catálogo y estará disponible después del procesamiento.
              </p>
            </div>
          )}

          {/* ===== INFORMACIÓN ADICIONAL ===== */}
          {!success && (
            <div className="movie-form-view__info">
              <h4>💡 Información importante:</h4>
              <ul>
                <li><strong>Portada:</strong> Puedes usar una URL externa o subir un archivo. El archivo tendrá prioridad.</li>
                <li><strong>Video:</strong> Se aceptan formatos mp4, avi, mkv y webm.</li>
                <li><strong>Procesamiento:</strong> El video será procesado automáticamente para diferentes calidades.</li>
                <li><strong>Categoría:</strong> Selecciona la categoría que mejor describa el contenido.</li>
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { MovieFormView };