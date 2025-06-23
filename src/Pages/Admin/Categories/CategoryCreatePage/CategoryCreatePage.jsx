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
 * CategoryCreatePage - HOMOLOGADO CON BACKEND
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend (solo name)
 * ✅ VALIDACIONES: Según esquemas Joi del backend (max 100 caracteres)
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ ESTILO: Mismo patrón visual que UserCreatePage
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
      helperText: 'Nombre único de la categoría, máximo 100 caracteres',
      width: 'full',
      maxLength: 100
    }
  ];

  // ===== DATOS INICIALES =====
  const initialData = {
    name: ''
  };

  // ===== VALIDACIONES =====
  
  /**
   * ✅ Validar nombre según schema del backend
   */
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'El nombre es obligatorio';
    }
    
    if (name.trim().length > 100) {
      return 'El nombre no debe exceder 100 caracteres';
    }
    
    // Verificar caracteres especiales (solo permitir letras, números, espacios y algunos símbolos)
    const validNameRegex = /^[a-zA-ZÀ-ÿ0-9\s\-\&\(\)]+$/;
    if (!validNameRegex.test(name.trim())) {
      return 'El nombre solo puede contener letras, números, espacios, guiones y paréntesis';
    }
    
    return null;
  };

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    console.log('📝 Cambios en formulario de categoría:', formData);
    
    // Verificar si hay cambios
    const hasRealChanges = formData.name && formData.name.trim().length > 0;
    setHasChanges(hasRealChanges);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error && hasRealChanges) {
      setError(null);
    }
  };

  /**
   * ✅ MANEJAR envío con validaciones completas
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📋 Datos del formulario de categoría:', formData);

      // ✅ VALIDACIONES PRE-ENVÍO
      const nameError = validateName(formData.name);
      if (nameError) throw new Error(nameError);

      // ✅ PREPARAR datos según estructura EXACTA del backend
      const categoryData = {
        name: formData.name.trim() // Backend espera solo `name` como string
      };

      console.log('📤 Enviando categoría al backend:', categoryData);

      // ✅ LLAMAR servicio existente (ya recibe el name directamente)
      const response = await createCategoryService(categoryData.name);
      
      console.log('📥 Respuesta del backend:', response);

      // ✅ El servicio existente devuelve directamente la data o lanza un error
      // Si llegamos aquí, la categoría se creó exitosamente

      // ✅ ÉXITO
      setSuccess(true);
      setHasChanges(false);
      
      console.log('✅ Categoría creada exitosamente');

      // Navegar después de un delay
      setTimeout(() => {
        navigate('/admin/categories');
      }, 1500);

    } catch (err) {
      console.error('💥 Error creating category:', err);
      
      // ✅ MANEJO de errores específicos del backend
      let errorMessage = 'Error al crear la categoría';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 409 || err.message?.includes('existe')) {
        errorMessage = 'Ya existe una categoría con ese nombre';
      } else if (err.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica que el nombre sea correcto';
      } else if (err.response?.status === 401) {
        // Manejar sesión expirada
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear categorías';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir? ' +
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

        {/* ===== FORMULARIO DINÁMICO (COMPONENTE CON STORY) ===== */}
        <div className="category-create__form-container">
          <div className="category-create__form-header">
            <h2 className="category-create__form-title">
              Información de la Categoría
            </h2>
            <p className="category-create__form-description">
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