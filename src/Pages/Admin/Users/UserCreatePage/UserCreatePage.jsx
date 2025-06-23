// ===== USER CREATE PAGE =====
// src/Pages/Admin/Users/UserCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../components/atoms/Button/Button';
import './UserCreatePage.css';

// Importar servicio para crear usuarios
import { createUserService } from '../../../services/Users/createUserService';

/**
 * UserCreatePage - Página para crear nuevos usuarios
 * 
 * Características implementadas:
 * - ✅ AdminLayout con breadcrumbs
 * - ✅ DynamicForm del sistema de diseño
 * - ✅ Validaciones de campos
 * - ✅ Integración con createUserService
 * - ✅ Estados de loading, success, error
 * - ✅ Navegación después de crear
 * - ✅ Confirmación de salida sin guardar
 */
function UserCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Configuración de campos para el formulario de usuario
   */
  const userFormFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico',
      placeholder: 'usuario@ejemplo.com',
      required: true,
      leftIcon: '📧',
      helperText: 'El email será usado para iniciar sesión',
      width: 'full'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe tener al menos 8 caracteres',
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
      leftIcon: '👤',
      helperText: 'Define los permisos del usuario',
      options: [
        { value: '', label: 'Seleccionar rol...', disabled: true },
        { value: 1, label: 'Administrador' },
        { value: 2, label: 'Editor' },
        { value: 3, label: 'Usuario' }
      ],
      width: 'half'
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado Inicial',
      required: true,
      leftIcon: '🔘',
      helperText: 'El usuario puede activarse/desactivarse después',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ],
      width: 'half'
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
   * Validar fortaleza de contraseña
   */
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return 'Debe contener al menos una mayúscula y una minúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Debe contener al menos un número';
    }
    return null;
  };

  // ===== HANDLERS =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    setError(null); // Limpiar errores al cambiar datos
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones adicionales
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

      // Preparar datos para el servicio
      const userData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roleId: parseInt(formData.roleId),
        status: formData.status,
        // Campos adicionales que el backend podría esperar
        active: formData.status === 'active',
        createdAt: new Date().toISOString()
      };

      // Llamar al servicio
      const response = await createUserService(userData);
      
      console.log('Usuario creado:', response);
      
      // Marcar como exitoso
      setSuccess(true);
      setHasChanges(false);

      // Mostrar mensaje de éxito
      const userName = formData.email;
      alert(`✅ Usuario "${userName}" creado correctamente`);

      // Navegar a la lista de usuarios después de un delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 1000);

    } catch (err) {
      console.error('Error creating user:', err);
      
      // Manejar diferentes tipos de error
      let errorMessage = 'Error al crear el usuario';
      
      if (err.message) {
        errorMessage = err.message;
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
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    status: 'active'
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

        {/* ===== INFORMACIÓN ADICIONAL ===== */}
        <div className="user-create__info">
          <div className="user-create__info-section">
            <h3 className="user-create__info-title">
              ℹ️ Información sobre Roles
            </h3>
            <ul className="user-create__info-list">
              <li><strong>Administrador:</strong> Acceso completo al sistema</li>
              <li><strong>Editor:</strong> Puede gestionar contenido pero no usuarios</li>
              <li><strong>Usuario:</strong> Solo puede ver y reproducir contenido</li>
            </ul>
          </div>
          
          <div className="user-create__info-section">
            <h3 className="user-create__info-title">
              🔒 Seguridad de Contraseñas
            </h3>
            <ul className="user-create__info-list">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una mayúscula y una minúscula</li>
              <li>Al menos un número</li>
              <li>Se recomienda usar símbolos especiales</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserCreatePage };