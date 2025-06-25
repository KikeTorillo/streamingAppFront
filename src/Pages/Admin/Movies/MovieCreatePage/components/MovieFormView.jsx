// ===== MOVIE FORM VIEW - COMPONENTE ESPECÍFICO CON SISTEMA DE DISEÑO =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import './MovieFormView.css';

/**
 * MovieFormView - COMPONENTE ESPECÍFICO HOMOLOGADO CON SISTEMA DE DISEÑO
 * 
 * ✅ ESPECÍFICO: Solo para creación de películas en MovieCreatePage
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ RESPONSABILIDAD: Formulario + vista previa + información adicional
 * ✅ PROPS CLARAS: Recibe configuración y handlers desde MovieCreatePage
 * ✅ PATRÓN: Sigue el mismo patrón que CategoryCreatePage y UserCreatePage
 * ✅ ESTRUCTURA: Usa form-container en lugar de Cards para el formulario principal
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
 * @param {boolean} props.categoriesLoading - Estado de carga de categorías
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
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres volver a la búsqueda?\n\n" +
        "Se perderán los cambios no guardados."
      );
      if (!confirmLeave) return;
    }
    
    if (onBackToSearch) {
      onBackToSearch();
    }
  };

  // ===== RENDER =====
  
  return (
    <div className="movie-form-view">
      
      {/* ===== VISTA PREVIA DEL ITEM SELECCIONADO (TMDB) ===== */}
      {selectedItem && (
        <Card className="movie-form-view__preview-card">
          <CardHeader>
            <div className="movie-form-view__preview-header">
              <CardTitle>
                Vista Previa de TMDB
              </CardTitle>
              {showBackButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackClick}
                  leftIcon="🔍"
                  disabled={formLoading}
                >
                  Volver a Búsqueda
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="movie-form-view__preview">
              <div className="movie-form-view__preview-poster">
                <ContentImage
                  src={selectedItem.poster}
                  alt={selectedItem.title}
                  width={120}
                  height={180}
                  fallbackIcon="🎬"
                  className="movie-form-view__poster-image"
                />
              </div>
              <div className="movie-form-view__preview-info">
                <h3 className="movie-form-view__preview-title">
                  {selectedItem.title}
                </h3>
                <p className="movie-form-view__preview-meta">
                  {getItemTypeLabel(selectedItem.type)} • {selectedItem.year}
                </p>
                <p className="movie-form-view__preview-overview">
                  {selectedItem.overview || 'Sin descripción disponible'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== INFORMACIÓN ADICIONAL (SIN ITEM SELECCIONADO) ===== */}
      {!selectedItem && (
        <Card className="movie-form-view__info-card">
          <CardHeader>
            <CardTitle>
              💡 Crear Contenido Manualmente
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="movie-form-view__info-text">
              Estás creando contenido sin usar la búsqueda de TMDB. 
              Completa todos los campos requeridos para agregar la película o serie al catálogo.
            </p>
            <div className="movie-form-view__info-tips">
              <h4>💡 Consejos:</h4>
              <ul>
                <li>Asegúrate de que el título sea preciso</li>
                <li>Selecciona la categoría correcta</li>
                <li>Verifica que la URL del video sea válida</li>
                <li>La imagen del poster es opcional pero recomendada</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== FORMULARIO DINÁMICO (SISTEMA DE DISEÑO - SIN CARD) ===== */}
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
          className={`movie-form-view__form ${success ? 'movie-form-view__form--success' : ''}`}
        />
      </div>

      {/* ===== INFORMACIÓN DE AYUDA (OPCIONAL - SOLO CARD INFORMATIVA) ===== */}
      <Card className="movie-form-view__help-card">
        <CardHeader>
          <CardTitle>
            📋 Información sobre los Campos
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="movie-form-view__help-content">
            <div className="movie-form-view__help-section">
              <h4>🎬 Tipo de Contenido</h4>
              <p>
                <strong>Película:</strong> Contenido de duración completa, típicamente 90-180 minutos.<br/>
                <strong>Serie:</strong> Contenido episódico, duración por episodio.
              </p>
            </div>
            
            <div className="movie-form-view__help-section">
              <h4>🎭 Categorías</h4>
              <p>
                {categoriesLoading ? (
                  'Cargando categorías...'
                ) : categoryOptions.length > 0 ? (
                  `Selecciona entre ${categoryOptions.length} categorías disponibles para clasificar el contenido.`
                ) : (
                  'No hay categorías disponibles. Crea categorías primero en el panel de administración.'
                )}
              </p>
            </div>
            
            <div className="movie-form-view__help-section">
              <h4>⏱️ Duración</h4>
              <p>
                <strong>Películas:</strong> Duración total en minutos.<br/>
                <strong>Series:</strong> Duración promedio por episodio.
              </p>
            </div>

            <div className="movie-form-view__help-section">
              <h4>🔗 URLs</h4>
              <p>
                <strong>Video:</strong> URL directa al archivo de video o stream.<br/>
                <strong>Poster:</strong> URL de la imagen (opcional, mejora la presentación).
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export { MovieFormView };