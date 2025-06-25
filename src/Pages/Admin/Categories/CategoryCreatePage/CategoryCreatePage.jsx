// ===== CATEGORY CREATE PAGE - HOMOLOGADO CON BACKEND Y STORYBOOK =====
// src/Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import './CategoryCreatePage.css';

// Importar servicio para crear categorías
import { createCategoryService } from '../../../../services/Categories/createCategoryService';

/**
 * CategoryCreatePage - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend (solo name)
 * ✅ VALIDACIONES: Según esquemas Joi del backend (max 100 caracteres)
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ ESTILO: Usa clases del sistema de diseño centralizado
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
      helperText: 'Máximo 100 caracteres. Debe ser único y descriptivo',
      validation: {
        required: {
          value: true,
          message: 'El nombre de la categoría es obligatorio'
        },
        maxLength: {
          value: 100,
          message: 'El nombre no puede exceder los 100 caracteres'
        },
        minLength: {
          value: 2,
          message: 'El nombre debe tener al menos 2 caracteres'
        },
        pattern: {
          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          message: 'Solo se permiten letras y espacios'
        }
      }
    }
  ];

  /**
   * ✅ DATOS INICIALES: Objeto vacío para formulario limpio
   */
  const initialData = {
    name: ''
  };

  // ===== HANDLERS =====

  /**
   * ✅ HANDLE SUBMIT: Envía datos al backend usando el servicio
   */
  const handleSubmit = async (formData) => {
    console.log('[CategoryCreate] Submit iniciado:', formData);
    
    setLoading(true);
    setError(null);

    try {
      // Llamar al servicio del backend
      const result = await createCategoryService(formData);
      
      console.log('[CategoryCreate] Categoría creada:', result);
      
      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/categories');
      }, 2000);
      
    } catch (err) {
      console.error('[CategoryCreate] Error:', err);
      setError(err.message || 'Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ HANDLE FORM CHANGE: Rastrea cambios para mostrar advertencias
   * DynamicForm solo pasa formData completo como parámetro único
   */
  const handleFormChange = (formData) => {
    console.log('[CategoryCreate] Datos del formulario cambiados:', formData);
    
    // Verificar si formData es válido
    if (!formData || typeof formData !== 'object') {
      console.warn('[CategoryCreate] formData no es válido:', formData);
      return;
    }
    
    // Verificar si hay cambios respecto al estado inicial
    const hasDataChanges = Object.keys(formData).some(key => 
      formData[key] !== initialData[key]
    );
    
    setHasChanges(hasDataChanges);
    
    // Limpiar errores cuando el usuario modifica algo
    if (error) {
      setError(null);
    }
  };

  /**
   * ✅ HANDLE CANCEL: Navegar de vuelta con confirmación si hay cambios
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        '¿Estás seguro de que quieres salir? ' +
        'Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }
    
    navigate('/admin/categories');
  };

  // ===== RENDER =====
  
  return (
    <AdminLayout
      title="Crear Nueva Categoría"
      subtitle="Crea una categoría para organizar el contenido multimedia"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías', href: '/admin/categories' },
        { label: 'Crear' }
      ]}
      headerActions={
        <div className="category-create__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('category-create-form')?.requestSubmit()}
            loading={loading}
            disabled={!hasChanges || loading}
            leftIcon="🎭"
          >
            {loading ? 'Creando...' : 'Crear Categoría'}
          </Button>
        </div>
      }
    >
      <div className="category-create">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="category-create__success">
            <div className="category-create__success-icon">✅</div>
            <div className="category-create__success-content">
              <h3>¡Categoría creada exitosamente!</h3>
              <p>La nueva categoría está disponible para usar en contenido multimedia.</p>
            </div>
            <span className="category-create__success-redirect">
              Redirigiendo...
            </span>
          </div>
        )}

        {error && (
          <div className="category-create__error">
            <div className="category-create__error-icon">⚠️</div>
            <div className="category-create__error-content">
              <h4>Error al crear categoría</h4>
              <p>{error}</p>
            </div>
          </div>
        )}



        {/* ===== FORMULARIO DINÁMICO (SISTEMA DE DISEÑO) ===== */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              Información de la Categoría
            </h2>
            <p className="form-description">
              Completa el nombre de la nueva categoría. Debe ser único y descriptivo para facilitar la organización del contenido.
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
            className={`category-create__form ${success ? 'category-create__form--success' : ''}`}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { CategoryCreatePage };