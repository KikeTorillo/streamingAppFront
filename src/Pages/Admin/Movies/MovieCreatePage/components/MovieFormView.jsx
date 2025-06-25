// ===== MOVIE FORM VIEW - COMPONENTE ESPECÍFICO =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import './MovieFormView.css';

/**
 * MovieFormView - Componente específico para formulario de películas
 * 
 * ✅ ESPECÍFICO: Solo para creación de películas en MovieCreatePage
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ RESPONSABILIDAD: Formulario + vista previa + información adicional
 * ✅ PROPS CLARAS: Recibe configuración y handlers desde MovieCreatePage
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedItem - Item seleccionado de TMDB (opcional)
 * @param {Array} props.formFields - Configuración de campos del formulario
 * @param {Object} props.initialFormData - Datos iniciales del formulario
 * @param {boolean} props.formLoading - Estado de carga del formulario
 * @param {boolean} props.success - Estado de éxito
 * @param {boolean} props.hasChanges - Si hay cambios sin guardar
 * @param {Function} props.onSubmit - Handler para envío del formulario
 * @param {Function} props.onChange - Handler para cambios en el formulario
 * @param {Function} props.onBackToSearch - Handler para volver a la búsqueda
 * @param {Array} props.typeOptions - Opciones de tipo (película/serie)
 * @param {Array} props.categoryOptions - Opciones de categoría
 * @param {boolean} props.showBackButton - Mostrar botón de volver a búsqueda
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
  showBackButton = true
}) {

  // ===== FUNCIONES AUXILIARES =====
  const getFormTitle = () => {
    return selectedItem ? 'Confirmar Información' : 'Información del Contenido';
  };

  const getFormDescription = () => {
    return selectedItem ? 
      'Revisa y completa los datos obtenidos de TMDB. Los campos se rellenan automáticamente pero puedes modificarlos.' :
      'Completa los campos requeridos para agregar el contenido manualmente al catálogo.';
  };

  const getItemTypeLabel = (type) => {
    switch (type) {
      case 'movie':
        return '🎬 Película';
      case 'tv':
        return '📺 Serie';
      default:
        return '🎭 Contenido';
    }
  };

  // ===== HANDLERS LOCALES =====
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

  const handleBackClick = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres volver a la búsqueda?"
      );
      if (!confirmLeave) return;
    }
    
    if (onBackToSearch) {
      onBackToSearch();
    }
  };

  return (
    <div className="movie-form-view">
      
      {/* ===== VISTA PREVIA DEL ITEM SELECCIONADO ===== */}
      {selectedItem && (
        <Card variant="elevated" size="lg" className="movie-form-view__preview-card">
          <CardHeader>
            <div className="movie-form-view__preview-header">
              <CardTitle>🎯 Vista Previa de TMDB</CardTitle>
              {showBackButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackClick}
                  leftIcon="←"
                  disabled={formLoading}
                >
                  Volver a Búsqueda
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="movie-form-view__preview">
              <ContentImage
                src={selectedItem.poster}
                alt={selectedItem.title}
                className="movie-form-view__preview-poster"
                fallbackIcon="🎬"
              />
              <div className="movie-form-view__preview-info">
                <h3 className="movie-form-view__preview-title">
                  {selectedItem.title}
                </h3>
                <p className="movie-form-view__preview-meta">
                  {getItemTypeLabel(selectedItem.type)} • 
                  {selectedItem.year} • 
                  ⭐ {selectedItem.rating?.toFixed(1) || 'N/A'}
                </p>
                <p className="movie-form-view__preview-overview">
                  {selectedItem.overview || 'Sin descripción disponible'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== FORMULARIO PRINCIPAL ===== */}
      <Card variant="default" size="lg" className="movie-form-view__form-card">
        <CardHeader>
          <CardTitle>{getFormTitle()}</CardTitle>
          <p className="movie-form-view__form-description">
            {getFormDescription()}
          </p>
        </CardHeader>
        <CardBody>
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
            fieldSize="md"
            fieldRounded="md"
            submitText={formLoading ? "Creando..." : "Crear Contenido"}
            submitVariant="primary"
            submitSize="md"
            submitIcon="➕"
            validateOnBlur={true}
            validateOnChange={false}
            showSubmit={!success}
            className={`movie-form-view__form ${success ? 'movie-form-view__form--success' : ''}`}
          />
        </CardBody>
      </Card>
      
      {/* ===== INFORMACIÓN ADICIONAL ===== */}
      <div className="movie-form-view__info-grid">
        
        {/* Tipos de Contenido */}
        {typeOptions.length > 0 && (
          <Card variant="outlined" size="md">
            <CardBody>
              <h4 className="movie-form-view__info-title">📋 Tipos de Contenido</h4>
              <ul className="movie-form-view__info-list">
                {typeOptions.map(option => (
                  <li key={option.value}>
                    <strong>{option.label}:</strong> {
                      option.value === 'movie' ? 
                        'Contenido cinematográfico de duración estándar' :
                      option.value === 'tv' ?
                        'Contenido episódico o por temporadas' :
                        'Otro tipo de contenido audiovisual'
                    }
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}
        
        {/* Categorías Disponibles */}
        {categoryOptions.length > 0 && (
          <Card variant="outlined" size="md">
            <CardBody>
              <h4 className="movie-form-view__info-title">🎭 Categorías Disponibles</h4>
              <ul className="movie-form-view__info-list">
                {categoryOptions.slice(0, 6).map(option => (
                  <li key={option.value}>
                    <strong>{option.label}</strong>
                  </li>
                ))}
                {categoryOptions.length > 6 && (
                  <li><em>Y {categoryOptions.length - 6} categorías más...</em></li>
                )}
              </ul>
            </CardBody>
          </Card>
        )}
        
        {/* Consejos de Creación */}
        <Card variant="outlined" size="md" className="movie-form-view__info-tips">
          <CardBody>
            <h4 className="movie-form-view__info-title">💡 Consejos de Creación</h4>
            <ul className="movie-form-view__info-list">
              <li><strong>Títulos:</strong> Usa nombres oficiales y reconocibles</li>
              <li><strong>Descripciones:</strong> Sé conciso pero informativo (150-300 palabras)</li>
              <li><strong>Posters:</strong> URLs de alta calidad mejoran la experiencia del usuario</li>
              <li><strong>Categorías:</strong> Elige la más representativa del contenido principal</li>
              <li><strong>Duración:</strong> Para series, usa la duración promedio por episodio</li>
              <li><strong>Año:</strong> Usa el año de estreno original, no de remasterización</li>
            </ul>
          </CardBody>
        </Card>

        {/* Información Técnica */}
        <Card variant="outlined" size="md" className="movie-form-view__info-technical">
          <CardBody>
            <h4 className="movie-form-view__info-title">⚙️ Información Técnica</h4>
            <ul className="movie-form-view__info-list">
              <li><strong>Formatos soportados:</strong> MP4, WebM, AVI</li>
              <li><strong>Resolución recomendada:</strong> 1080p o superior</li>
              <li><strong>Tamaño de poster:</strong> 500x750px (proporción 2:3)</li>
              <li><strong>URLs de video:</strong> Deben ser accesibles públicamente</li>
              <li><strong>Validación:</strong> Todos los campos se validan antes del envío</li>
            </ul>
          </CardBody>
        </Card>

        {/* Estado de TMDB si hay item seleccionado */}
        {selectedItem && (
          <Card variant="outlined" size="md" className="movie-form-view__info-tmdb">
            <CardBody>
              <h4 className="movie-form-view__info-title">🔗 Información de TMDB</h4>
              <ul className="movie-form-view__info-list">
                <li><strong>ID TMDB:</strong> {selectedItem.id}</li>
                <li><strong>Tipo:</strong> {getItemTypeLabel(selectedItem.type)}</li>
                <li><strong>Puntuación:</strong> {selectedItem.rating?.toFixed(1) || 'N/A'}/10</li>
                <li><strong>Datos prellenados:</strong> Título, año, descripción y poster</li>
                <li><strong>Editable:</strong> Puedes modificar cualquier campo antes de guardar</li>
              </ul>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export { MovieFormView };