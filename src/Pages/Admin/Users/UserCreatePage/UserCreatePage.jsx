// ===== USER CREATE PAGE (CORREGIDO PARA BACKEND) =====
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
 * UserCreatePage - Página para crear nuevos usuarios (ACTUALIZADA PARA BACKEND)
 * 
 * CAMBIOS PARA BACKEND:
 * - ✅ Agregado campo username (requerido y único)
 * - ✅ Eliminado campo status (no existe en DB)
 * - ✅ Ajustado mapeo de datos para backend
 * - ✅ Actualizada validación según esquemas Joi
 */
function UserCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== CONFIGURACIÓN DEL FORMULARIO (ACTUALIZADA) =====
  
  /**
   * Configuración de campos según la estructura real del backend
   */
  const userFormFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Nombre de Usuario',
      placeholder: 'Ej: juan_perez',
      required: true,
      leftIcon: '👤',
      helperText: 'Debe ser único en el sistema (sin espacios)',
      width: 'half'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico',
      placeholder: 'usuario@ejemplo.com',
      required: true,
      leftIcon: '📧',
      helperText: 'El email será usado para iniciar sesión',
      width: 'half'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe ser alfanumérica (solo letras y números)',
      width: 'half'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirmar Contraseña',
      placeholder: 'Repite la contraseña',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe coincidir con la contraseña',
      width: 'half'
    },
    {
      name: 'roleId',
      type: 'select',
      label: 'Rol del Usuario',
      required: true,
      leftIcon: '👥',
      helperText: 'Define los permisos del usuario en el sistema',
      options: [
        { value: '', label: 'Seleccionar rol...', disabled: true },
        { value: 1, label: 'Administrador' },
        { value: 2, label: 'Editor' },
        { value: 3, label: 'Usuario Normal' }
      ],
      width: 'full'
    }
  ];

  // ===== VALIDACIONES PERSONALIZADAS =====
  
  /**
   * Validar que las contraseñas coincidan
   */
  const validatePasswords = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  /**
   * Validar formato de email
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Ingresa un email válido';
    }
    return null;
  };

  /**
   * Validar username (según backend)
   */
  const validateUsername = (username) => {
    if (username.length < 3) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Solo se permiten letras, números y guiones bajos';
    }
    if (username.includes(' ')) {
      return 'No se permiten espacios';
    }
    return null;
  };

  /**
   * Validar contraseña (según esquema Joi: alfanumérica)
   */
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return 'La contraseña debe ser alfanumérica (solo letras y números)';
    }
    return null;
  };

  // ===== HANDLERS =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    setError(null);
  };

  /**
   * Manejar envío del formulario (ACTUALIZADO PARA BACKEND)
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones específicas del backend
      const usernameError = validateUsername(formData.username);
      if (usernameError) {
        throw new Error(usernameError);
      }

      const emailError = validateEmail(formData.email);
      if (emailError) {
        throw new Error(emailError);
      }

      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      const passwordMatchError = validatePasswords(formData);
      if (passwordMatchError) {
        throw new Error(passwordMatchError);
      }

      // Preparar datos según la estructura exacta del backend
      const userData = {
        username: formData.username.trim().toLowerCase(), // Normalizar username
        email: formData.email.trim().toLowerCase(),
        password: formData.password, // Backend se encarga del hash
        roleId: parseInt(formData.roleId) // Backend espera roleId como número
      };

      console.log('Enviando datos al backend:', userData);

      // Llamar al servicio
      const response = await createUserService(userData);
      
      console.log('Usuario creado exitosamente:', response);
      
      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);

      // Mostrar mensaje de éxito
      alert(`✅ Usuario "${userData.username}" creado correctamente`);

      // Navegar a la lista después de un delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);

    } catch (err) {
      console.error('Error creating user:', err);
      
      // Manejar errores específicos del backend
      let errorMessage = 'Error al crear el usuario';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 409) {
        errorMessage = 'El email o nombre de usuario ya están registrados';
      } else if (err.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica los campos requeridos';
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
   * Manejar cancelación
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

  /**
   * Datos iniciales del formulario
   */
  const initialData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: ''
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
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="user-create">
        {/* ===== MENSAJE DE ERROR ===== */}
        {error && (
          <div className="user-create__error" role="alert">
            <span className="user-create__error-icon">⚠️</span>
            <span className="user-create__error-text">{error}</span>
            <button
              className="user-create__error-close"
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}

        {/* ===== MENSAJE DE ÉXITO ===== */}
        {success && (
          <div className="user-create__success" role="alert">
            <span className="user-create__success-icon">✅</span>
            <span className="user-create__success-text">
              Usuario creado correctamente. Redirigiendo...
            </span>
          </div>
        )}

        {/* ===== FORMULARIO DINÁMICO ===== */}
        <div className="user-create__form-container">
          <div className="user-create__form-header">
            <h2 className="user-create__form-title">
              Información del Usuario
            </h2>
            <p className="user-create__form-description">
              Completa todos los campos para crear una nueva cuenta de usuario.
            </p>
          </div>

          <DynamicForm
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
            className={`user-create__form ${success ? 'user-create__form--success' : ''}`}
          />
        </div>

        {/* ===== INFORMACIÓN ACTUALIZADA ===== */}
        <div className="user-create__info">
          <div className="user-create__info-section">
            <h3 className="user-create__info-title">
              ℹ️ Información sobre Roles
            </h3>
            <ul className="user-create__info-list">
              <li><strong>Administrador:</strong> Acceso completo al sistema y gestión de usuarios</li>
              <li><strong>Editor:</strong> Puede gestionar contenido (películas, series) pero no usuarios</li>
              <li><strong>Usuario Normal:</strong> Solo puede ver y reproducir contenido</li>
            </ul>
          </div>
          
          <div className="user-create__info-section">
            <h3 className="user-create__info-title">
              🔒 Validaciones del Sistema
            </h3>
            <ul className="user-create__info-list">
              <li><strong>Username:</strong> Único, mínimo 3 caracteres, solo letras, números y guiones bajos</li>
              <li><strong>Email:</strong> Único, formato válido</li>
              <li><strong>Contraseña:</strong> Mínimo 6 caracteres alfanuméricos</li>
              <li><strong>Roles:</strong> Deben existir en la base de datos</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserCreatePage };