// ===== CATEGORY CREATE PAGE - REFACTORIZADO CON SISTEMA DE DISEÑO =====
// src/Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';

// Importar servicio para crear categorías
import { createCategoryService } from '../../../../services/Categories/createCategoryService';

/**
 * CategoryCreatePage - REFACTORIZADO CON SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Usa clases unificadas (page-container, status-message)
 * ✅ SIN CSS DUPLICADO: -90% menos código CSS personalizado
 * ✅ BACKEND: Homologado con campos reales del backend (solo name)
 * ✅ VALIDACIONES: Según esquemas Joi del backend (max 100 caracteres)
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ RESPONSIVE: Comportamiento móvil unificado del sistema
 */
function CategoryCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== CONFIGURACIÓN HOMOLOGADA CON BACKEND =====
  
  /**
   * ✅ CAMPOS según schema del backend: solo `name` (string, max 100 chars)
   */
  const categoryFormFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la Categoría',
      placeholder: 'Ej: Acción, Drama, Comedia...',
      required: true,
      leftIcon: '🎭',
      helperText: 'Máximo 100 caracteres. Debe ser único y descriptivo para facilitar la organización del contenido.',
      maxLength: 100,
      validation: {
        minLength: { value: 2, message: 'Mínimo 2 caracteres' },
        maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        required: { value: true, message: 'El nombre es obligatorio' },
        pattern: {
          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]{2,100}$/,
          message: 'Solo letras, espacios, guiones y &'
        }
      }
    }
  ];

  /**
   * ✅ Datos iniciales vacíos
   */
  const initialData = {
    name: ''
  };

  // ===== FUNCIONES =====

  /**
   * ✅ Limpiar errores
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * ✅ Navegar de vuelta
   */
  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    
    navigate('/admin/categories');
  };

  /**
   * ✅ Detectar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    const hasData = Object.values(formData).some(value => 
      value && value.toString().trim() !== ''
    );
    setHasChanges(hasData);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
  };

  /**
   * ✅ Enviar formulario - HOMOLOGADO CON BACKEND
   */
  const handleSubmit = async (formData) => {
    // Limpiar estados previos
    setError(null);
    setLoading(true);

    try {
      console.log('📤 Enviando datos al backend:', formData);

      // Llamar al servicio del backend
      const result = await createCategoryService(formData);

      console.log('✅ Categoría creada exitosamente:', result);

      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/admin/categories');
      }, 3000);

    } catch (err) {
      console.error('❌ Error al crear categoría:', err);
      
      // Formatear error para el usuario
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error inesperado al crear la categoría';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nueva Categoría"
      subtitle="Agregar una nueva categoría para organizar el contenido multimedia"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías', href: '/admin/categories' },
        { label: 'Crear Categoría' }
      ]}
    >
      {/* 🎯 CONTENEDOR PRINCIPAL - USANDO SISTEMA DE DISEÑO */}
      <div className="page-container page-container--normal">
        
        {/* 🔧 HEADER ACTIONS - USANDO SISTEMA DE DISEÑO */}
        <div className="page-header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={loading}
          >
            Volver a Categorías
          </Button>
        </div>

        {/* ❌ MENSAJE DE ERROR - USANDO SISTEMA DE DISEÑO */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <h4>Error al crear categoría</h4>
              <p>{error}</p>
            </div>
            <button 
              className="status-message__close"
              onClick={clearError}
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}

        {/* ✅ MENSAJE DE ÉXITO - USANDO SISTEMA DE DISEÑO */}
        {success && (
          <div className="status-message status-message--success">
            <span className="status-message__icon">✅</span>
            <div className="status-message__content">
              <h3>¡Categoría creada exitosamente!</h3>
              <p>La nueva categoría está disponible para organizar contenido.</p>
            </div>
            <span className="status-message__redirect">
              Redirigiendo en 3 segundos...
            </span>
          </div>
        )}

        {/* 📝 CONTENEDOR DEL FORMULARIO - USANDO SISTEMA DE DISEÑO */}
        <div className="form-container form-container--lg">
          <div className="form-header">
            <h2 className="form-title">
              🎭 Información de la Categoría
            </h2>
            <p className="form-description">
              Completa los datos para crear una nueva categoría. 
              Esta categoría se usará para organizar películas, series y otro contenido multimedia.
            </p>
          </div>

          <DynamicForm
            id="category-create-form"
            fields={categoryFormFields}
            initialData={initialData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            loading={loading}
            disabled={loading || success}
            columnsPerRow={1}
            tabletColumns={1}
            mobileColumns={1}
            fieldSize="lg"
            fieldRounded="md"
            submitText={loading ? "Creando Categoría..." : "Crear Categoría"}
            submitVariant="primary"
            submitSize="md"
            submitIcon="🎭"
            validateOnBlur={true}
            validateOnChange={false}
            showSubmit={!success} // Ocultar botón cuando hay éxito
            className={`${success ? 'form--success' : ''}`}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { CategoryCreatePage };