// ===== USER CREATE PAGE - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO =====
// src/Pages/Admin/Users/UserCreatePage/UserCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import './UserCreatePage.css';

// Importar servicio para crear usuarios
import { createUserService } from '../../../../services/Users/createUserService';

/**
 * UserCreatePage - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Usa clases del sistema centralizado
 * ✅ BACKEND: Solo campos que existen en la DB
 * ✅ COMPONENTES: Solo componentes con stories de Storybook
 * ✅ VALIDACIONES: Según esquemas Joi del backend
 * ✅ UX: Estados de loading, error y success consistentes
 */
function UserCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== CONFIGURACIÓN HOMOLOGADA CON BACKEND =====
  
  /**
   * ✅ CAMPOS según schema del backend: solo campos que existen en DB
   */
  const userFormFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Nombre de Usuario',
      placeholder: 'Ej: juan_perez',
      required: true,
      leftIcon: '👤',
      helperText: 'Único, 3-30 caracteres, solo letras/números/guiones bajos',
      width: 'half'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico',
      placeholder: 'usuario@ejemplo.com',
      required: false, // Email es OPCIONAL en backend
      leftIcon: '📧',
      helperText: 'Opcional: para notificaciones y recuperación de contraseña',
      width: 'half'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Solo letras y números',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe ser alfanumérica (solo letras y números según Joi)',
      width: 'half'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirmar Contraseña',
      placeholder: 'Repite la contraseña',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe coincidir exactamente con la contraseña',
      width: 'half'
    },
    {
      name: 'roleId',
      type: 'select',
      label: 'Rol del Usuario',
      required: true,
      leftIcon: '👥',
      helperText: 'Define los permisos y nivel de acceso del usuario',
      options: [
        { value: 1, label: '👑 Administrador - Acceso total al sistema' },
        { value: 2, label: '👤 Usuario Regular - Acceso limitado al contenido' }
      ],
      width: 'full'
    }
  ];

  /**
   * ✅ DATOS INICIALES: Objeto limpio para formulario
   */
  const initialData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: ''
  };

  // ===== HANDLERS =====

  /**
   * ✅ HANDLE SUBMIT: Procesar envío del formulario
   */
  const handleSubmit = async (formData) => {
    console.log('[UserCreate] Submit iniciado:', formData);

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Preparar datos para el backend (excluir confirmPassword)
    const { confirmPassword, ...userData } = formData;
    
    // Convertir roleId a número
    userData.roleId = parseInt(userData.roleId);

    setLoading(true);
    setError(null);

    try {
      // Llamar al servicio del backend
      const result = await createUserService(userData);
      
      console.log('[UserCreate] Usuario creado:', result);
      
      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
      
    } catch (err) {
      console.error('[UserCreate] Error:', err);
      
      let errorMessage = 'Error al crear el usuario';
      
      if (err.response?.data?.details) {
        errorMessage = 'Verifica todos los campos';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ HANDLE FORM CHANGE: Rastrea cambios para mostrar advertencias
   * DynamicForm solo pasa formData completo como parámetro único
   */
  const handleFormChange = (formData) => {
    console.log('[UserCreate] Datos del formulario cambiados:', formData);
    
    // Verificar si formData es válido
    if (!formData || typeof formData !== 'object') {
      console.warn('[UserCreate] formData no es válido:', formData);
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
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres salir?\n\nSe perderán todos los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }
    
    navigate('/admin/users');
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Usuario"
      subtitle="Agregar un nuevo usuario al sistema"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: 'Crear Usuario' }
      ]}
      headerActions={
        <div className="user-create__header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('user-create-form')?.requestSubmit()}
            loading={loading}
            disabled={!hasChanges || loading}
            leftIcon="➕"
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </div>
      }
    >
      <div className="user-create">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="user-create__success">
            <div className="user-create__success-icon">✅</div>
            <div className="user-create__success-content">
              <h3>¡Usuario creado exitosamente!</h3>
              <p>El nuevo usuario ya puede acceder al sistema con sus credenciales.</p>
            </div>
            <span className="user-create__success-redirect">
              Redirigiendo...
            </span>
          </div>
        )}

        {error && (
          <div className="user-create__error">
            <div className="user-create__error-icon">⚠️</div>
            <div className="user-create__error-content">
              <h4>Error al crear usuario</h4>
              <p>{error}</p>
            </div>
            <button
              className="user-create__error-close"
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}



        {/* ===== FORMULARIO DINÁMICO (SISTEMA DE DISEÑO) ===== */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              Información del Usuario
            </h2>
            <p className="form-description">
              Completa los campos requeridos para crear una nueva cuenta. Solo se almacenan datos que existen en la base de datos.
            </p>
          </div>

          <DynamicForm
            id="user-create-form"
            fields={userFormFields}
            initialData={initialData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            loading={loading}
            disabled={loading || success}
            columnsPerRow={2}
            tabletColumns={1}
            mobileColumns={1}
            fieldSize="md"
            fieldRounded="md"
            submitText={loading ? "Creando Usuario..." : "Crear Usuario"}
            submitVariant="primary"
            submitSize="md"
            submitIcon="➕"
            validateOnBlur={true}
            validateOnChange={false}
            showSubmit={!success} // Ocultar botón cuando hay éxito
            className={`user-create__form ${success ? 'user-create__form--success' : ''}`}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserCreatePage };