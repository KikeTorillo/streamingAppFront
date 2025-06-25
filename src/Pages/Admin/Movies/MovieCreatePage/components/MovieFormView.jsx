// ===== MOVIE FORM VIEW - HOMOLOGADO CON SISTEMA DE DISEÑO =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import './MovieFormView.css';

/**
 * MovieFormView - HOMOLOGADO CON SISTEMA DE DISEÑO
 * 
 * ✅ ESPECÍFICO: Solo para creación de películas en MovieCreatePage
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ PATRÓN: Sigue exactamente CategoryCreatePage y UserCreatePage
 * ✅ ESTRUCTURA: Usa form-container en lugar de Cards para el formulario principal
 * ✅ CSS: Variables del sistema y clases unificadas
 * 
 * @param {Object} props - Propiedades del componente
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

  // ===== HANDLERS =====
  const handleFormSubmit = (formData) => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleFormChange = (formData) => {
    if (onChange) {
      onChange(formData);
    }
  };

  const handleBackToSearch = () => {
    if (onBackToSearch) {
      onBackToSearch();
    }
  };

  // ===== RENDER =====
  return (
    <div className="movie-form-view">
      
      {/* ===== VISTA PREVIA DEL ITEM SELECCIONADO (OPCIONAL) ===== */}
      {selectedItem && (
        <Card className="movie-form-view__preview-card">
          <CardHeader>
            <div className="movie-form-view__preview-header">
              <CardTitle>
                🎬 Contenido Seleccionado de TMDB
              </CardTitle>
              {showBackButton && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon="←"
                  onClick={handleBackToSearch}
                  disabled={formLoading || success}
                >
                  Cambiar Selección
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="movie-form-view__preview">
              {/* Poster */}
              <div className="movie-form-view__preview-poster">
                <ContentImage
                  src={selectedItem.poster_path ? 
                    `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}` : 
                    null
                  }
                  alt={selectedItem.title || selectedItem.name}
                  fallback="🎬"
                  className="movie-form-view__poster-image"
                />
              </div>
              
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

      {/* ===== FORMULARIO DINÁMICO - SISTEMA DE DISEÑO (SIN CARD) ===== */}
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">
            {getFormTitle()}
          </h2>
          <p className="form-description">
            {getFormDescription()}
          </p>
        </div>

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
      </div>      
    </div>
  );
}

export { MovieFormView };