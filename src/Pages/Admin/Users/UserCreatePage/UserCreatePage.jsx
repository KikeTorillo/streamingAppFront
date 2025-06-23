// ===== USER CREATE PAGE - HOMOLOGADO CON BACKEND Y STORYBOOK =====
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
 * UserCreatePage - HOMOLOGADO CON BACKEND
 * 
 * ✅ CORREGIDO: Solo campos que existen en la DB
 * ✅ CORREGIDO: Usa solo componentes con stories de Storybook
 * ✅ CORREGIDO: Mapeo correcto backend userName/email/password/roleId
 * ✅ CORREGIDO: Validaciones según esquemas Joi del backend
 * ✅ CORREGIDO: Manejo de respuestas estructuradas
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
   * ✅ CORREGIDO: Solo campos que existen en DB + schema del backend
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
      required: false, // ✅ CORREGIDO: Email es OPCIONAL en backend
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
      helperText: 'Define los permisos del usuario en el sistema',
      options: [
        { value: '', label: 'Seleccionar rol...', disabled: true },
        { value: 1, label: 'Administrador - Acceso completo' },
        { value: 2, label: 'Editor - Gestión de contenido' },
        { value: 3, label: 'Usuario - Solo visualización' }
      ],
      width: 'full'
    }
  ];

  // ===== VALIDACIONES SEGÚN BACKEND SCHEMAS =====
  
  /**
   * ✅ CORREGIDO: Validar userName según Joi schema del backend
   */
  const validateUsername = (username) => {
    if (!username || username.trim() === '') {
      return 'El nombre de usuario es obligatorio';
    }
    if (username.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (username.length > 30) {
      return 'El nombre debe tener máximo 30 caracteres';
    }
    // ✅ IMPORTANTE: Backend Joi schema es .alphanum() + guiones bajos
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Solo se permiten letras, números y guiones bajos';
    }
    return null;
  };

  /**
   * ✅ CORREGIDO: Validar email (opcional pero si se proporciona debe ser válido)
   */
  const validateEmail = (email) => {
    // Email es opcional en el backend
    if (!email || email.trim() === '') {
      return null; // Válido: email opcional
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Si proporcionas email, debe tener formato válido';
    }
    return null;
  };

  /**
   * ✅ CORREGIDO: Validar password según Joi schema (.alphanum())
   */
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'La contraseña es obligatoria';
    }
    // ✅ IMPORTANTE: Backend Joi schema requiere .alphanum() (solo letras y números)
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return 'La contraseña debe ser alfanumérica (solo letras y números)';
    }
    if (password.length < 3) {
      return 'La contraseña debe tener al menos 3 caracteres';
    }
    return null;
  };

  /**
   * ✅ CORREGIDO: Validar roleId
   */
  const validateRoleId = (roleId) => {
    if (!roleId) {
      return 'Debes seleccionar un rol';
    }
    const validRoles = [1, 2, 3];
    if (!validRoles.includes(parseInt(roleId))) {
      return 'Rol inválido';
    }
    return null;
  };

  /**
   * ✅ VALIDAR: Contraseñas coincidentes
   */
  const validatePasswordMatch = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  // ===== HANDLERS =====
  
  /**
   * ✅ CORREGIDO: Manejar envío con validaciones completas
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📋 Datos del formulario:', formData);

      // ✅ VALIDACIONES PRE-ENVÍO
      const usernameError = validateUsername(formData.username);
      if (usernameError) throw new Error(usernameError);

      const emailError = validateEmail(formData.email);
      if (emailError) throw new Error(emailError);

      const passwordError = validatePassword(formData.password);
      if (passwordError) throw new Error(passwordError);

      const roleError = validateRoleId(formData.roleId);
      if (roleError) throw new Error(roleError);

      const passwordMatchError = validatePasswordMatch(formData);
      if (passwordMatchError) throw new Error(passwordMatchError);

      // ✅ PREPARAR datos según estructura EXACTA del backend
      const userData = {
        username: formData.username.trim(), // Frontend 'username' → Backend 'userName'
        email: formData.email?.trim() || undefined, // Email opcional
        password: formData.password.trim(), // Backend hará bcrypt.hash()
        roleId: parseInt(formData.roleId) // Backend espera number
      };

      console.log('📤 Enviando al backend:', userData);

      // ✅ LLAMAR servicio
      const response = await createUserService(userData);
      
      console.log('📥 Respuesta del backend:', response);

      // ✅ MANEJAR respuesta estructurada
      if (response.message === 'session expired' && response.error) {
        sessionStorage.clear();
        navigate('/login');
        return;
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al crear usuario');
      }

      // ✅ ÉXITO
      setSuccess(true);
      setHasChanges(false);
      
      console.log('✅ Usuario creado exitosamente');
      alert(`✅ Usuario "${userData.username}" creado correctamente`);

      // Navegar después de un delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);

    } catch (err) {
      console.error('💥 Error creating user:', err);
      
      // ✅ MANEJO de errores específicos del backend
      let errorMessage = 'Error al crear el usuario';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 409) {
        errorMessage = 'El username o email ya están registrados';
      } else if (err.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica todos los campos';
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
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    setHasChanges(true);
    setError(null); // Limpiar errores al cambiar
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
            leftIcon="←"
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

        {/* ===== FORMULARIO DINÁMICO (COMPONENTE CON STORY) ===== */}
        <div className="user-create__form-container">
          <div className="user-create__form-header">
            <h2 className="user-create__form-title">
              Información del Usuario
            </h2>
            <p className="user-create__form-description">
              Completa los campos requeridos para crear una nueva cuenta. Solo se almacenan datos que existen en la base de datos.
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
      </div>
    </AdminLayout>
  );
}

export { UserCreatePage };