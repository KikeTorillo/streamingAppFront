// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx
import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Container } from '../../../../../components/atoms/Container/Container';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import { getImageInfo } from '../../../../../utils/imageUtils';
import './MovieFormView.css';

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
  typeOptions = [],
  categoryOptions = [],
  
  // Configuración de UI
  showBackButton = true,
  categoriesLoading = false
}) {

  // ===== ESTADOS LOCALES =====
  const [currentFormData, setCurrentFormData] = useState(initialFormData);
  const [imageInfo, setImageInfo] = useState(null);

  // ===== EFECTOS =====
  
  /**
   * Actualizar datos del formulario cuando cambia initialFormData
   */
  useEffect(() => {
    setCurrentFormData(initialFormData);
  }, [initialFormData]);

  /**
   * Analizar información de la imagen cuando cambia coverImage
   */
  useEffect(() => {
    if (currentFormData.coverImage) {
      const info = getImageInfo(currentFormData.coverImage);
      setImageInfo(info);
    } else {
      setImageInfo(null);
    }
  }, [currentFormData.coverImage]);

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
   * Renderizar información de la imagen actual
   */
  const renderImageInfo = () => {
    if (!imageInfo) return null;

    if (imageInfo.type === 'url' && imageInfo.isTMDB) {
      return (
        <div className="movie-form-view__image-info movie-form-view__image-info--tmdb">
          <span className="movie-form-view__image-badge">🌐 TMDB</span>
          <span className="movie-form-view__image-text">
            Se usará la imagen de TMDB automáticamente
          </span>
        </div>
      );
    }

    if (imageInfo.type === 'file') {
      return (
        <div className="movie-form-view__image-info movie-form-view__image-info--file">
          <span className="movie-form-view__image-badge">📁 Archivo</span>
          <span className="movie-form-view__image-text">
            {imageInfo.name} ({imageInfo.sizeFormatted})
          </span>
        </div>
      );
    }

    if (imageInfo.type === 'url') {
      return (
        <div className="movie-form-view__image-info movie-form-view__image-info--url">
          <span className="movie-form-view__image-badge">🔗 URL</span>
          <span className="movie-form-view__image-text">
            Imagen externa desde {imageInfo.hostname}
          </span>
        </div>
      );
    }

    return null;
  };

  // ===== RENDER =====
  return (
    <div className="movie-form-view">

      {/* ===== BOTÓN DE VOLVER (OPCIONAL) ===== */}
      {showBackButton && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={onBackToSearch}
            disabled={formLoading}
          >
            Volver a la Búsqueda
          </Button>
        </div>
      )}

      {/* ===== VISTA PREVIA DE TMDB (SI HAY ITEM SELECCIONADO) ===== */}
      {selectedItem && (
        <Card variant="default" className="movie-form-view__preview-card">
          <CardHeader>
            <div className="movie-form-view__preview-header">
              <CardTitle>📽️ Vista Previa de TMDB</CardTitle>
              <Button
                variant="outline"
                size="xs"
                onClick={onBackToSearch}
                disabled={formLoading}
              >
                Cambiar selección
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="movie-form-view__preview">
              {/* Poster */}
              {selectedItem.poster_path && (
                <div className="movie-form-view__preview-poster">
                  <ContentImage
                    src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                    alt={`Poster de ${selectedItem.title || selectedItem.name}`}
                    aspectRatio="2/3"
                    objectFit="cover"
                    contentType="movie"
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
                  {selectedItem.release_date && (
                    <span>📅 {new Date(selectedItem.release_date).getFullYear()}</span>
                  )}
                  {selectedItem.first_air_date && (
                    <span>📅 {new Date(selectedItem.first_air_date).getFullYear()}</span>
                  )}
                  {selectedItem.media_type && (
                    <span>🎭 {selectedItem.media_type === 'movie' ? 'Película' : 'Serie'}</span>
                  )}
                  {selectedItem.vote_average && (
                    <span>⭐ {selectedItem.vote_average.toFixed(1)}</span>
                  )}
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
      <Container size="full">
        
        {/* Header del formulario */}
        <div className="form-header">
          <h2 className="form-title">
            {getFormTitle()}
          </h2>
          <p className="form-description">
            {getFormDescription()}
          </p>
        </div>

        {/* Información de la imagen actual */}
        {imageInfo && (
          <div className="movie-form-view__current-image">
            <h4>🖼️ Imagen de Portada Actual</h4>
            {renderImageInfo()}
            
            {/* Mostrar preview de la imagen */}
            {(imageInfo.type === 'url' || imageInfo.type === 'file') && (
              <div className="movie-form-view__image-preview">
                <ContentImage
                  src={imageInfo.type === 'url' ? imageInfo.url : URL.createObjectURL(currentFormData.coverImage)}
                  alt="Vista previa de portada"
                  aspectRatio="16/9"
                  objectFit="cover"
                  contentType="movie"
                  style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Formulario */}
        <DynamicForm
          id="movie-create-form"
          fields={formFields}
          initialData={initialFormData}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          loading={formLoading}
          disabled={formLoading || success}
          columnsPerRow={2}
          tabletColumns={1}
          mobileColumns={1}
          fieldSize="lg"
          fieldRounded="md"
          submitText={formLoading ? "Creando Contenido..." : "Crear Contenido"}
          submitVariant="primary"
          submitSize="md"
          submitIcon="🎬"
          validateOnBlur={true}
          validateOnChange={false}
          showSubmit={!success} // Ocultar botón cuando hay éxito
          className={`movie-form-view__form ${success ? 'form--success' : ''}`}
        />

        {/* Información adicional sobre el contenido */}
        <div className="form-footer">
          <div className="info-card">
            <h4>🎬 Información sobre el Contenido</h4>
            <ul>
              <li><strong>Video:</strong> Sube archivo MP4, WebM o AVI (máximo 500MB) - Solo para películas</li>
              <li><strong>Portada:</strong> Se puede usar imagen de TMDB o subir archivo JPG/PNG (máximo 10MB)</li>
              <li><strong>Categoría:</strong> Clasifica el contenido para facilitar búsquedas</li>
              <li><strong>Series:</strong> Después de crear la serie, podrás agregar episodios individualmente</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>📊 Datos de TMDB</h4>
            <ul>
              <li>Los datos de TMDB se prellenan automáticamente si seleccionaste un ítem</li>
              <li>La imagen de portada se descarga automáticamente desde TMDB</li>
              <li>Puedes modificar cualquier campo según tus necesidades</li>
              <li>La información ayuda a mantener consistencia en el catálogo</li>
            </ul>
          </div>

          {/* Información específica según tipo */}
          {currentFormData.type === 'movie' && (
            <div className="info-card info-card--highlight">
              <h4>🎥 Configuración de Película</h4>
              <ul>
                <li>Debes subir el archivo de video completo</li>
                <li>El sistema procesará automáticamente diferentes calidades</li>
                <li>Se generarán subtítulos automáticos si están disponibles</li>
              </ul>
            </div>
          )}

          {currentFormData.type === 'tv' && (
            <div className="info-card info-card--highlight">
              <h4>📺 Configuración de Serie</h4>
              <ul>
                <li>No necesitas subir video en este paso</li>
                <li>Después de crear la serie, agrega episodios individualmente</li>
                <li>Cada episodio puede tener su propio archivo de video</li>
              </ul>
            </div>
          )}
        </div>

      </Container>
    </div>
  );
}

export { MovieFormView };