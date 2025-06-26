// ===== MOVIE FORM VIEW - MIGRADO A CONTAINER ANIDADO =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Container } from '../../../../../components/atoms/Container/Container'; // ← NUEVA IMPORTACIÓN
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
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
    // Validaciones específicas de película si necesario
    onSubmit?.(formData);
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    onChange?.(formData);
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
        
        {/* Header del formulario */}
        <div className="form-header">
          <h2 className="form-title">
            {getFormTitle()}
          </h2>
          <p className="form-description">
            {getFormDescription()}
          </p>
        </div>

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

        {/* Información adicional sobre películas */}
        <div className="form-footer">
          <div className="info-card">
            <h4>🎬 Información sobre el Contenido</h4>
            <ul>
              <li><strong>Video:</strong> Sube archivo MP4, WebM o AVI (máximo 100MB)</li>
              <li><strong>Poster:</strong> Imagen promocional en formato JPG o PNG</li>
              <li><strong>Categoría:</strong> Clasifica el contenido para facilitar búsquedas</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>📊 Datos de TMDB</h4>
            <ul>
              <li>Los datos de TMDB se prellenan automáticamente si seleccionaste un item</li>
              <li>Puedes modificar cualquier campo según tus necesidades</li>
              <li>La información ayuda a mantener consistencia en el catálogo</li>
            </ul>
          </div>
        </div>
    </div>
  );
}

export { MovieFormView };