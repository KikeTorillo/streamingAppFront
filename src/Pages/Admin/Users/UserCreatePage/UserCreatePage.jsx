// ===== USER CREATE PAGE - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO =====
// src/Pages/Admin/Users/UserCreatePage/UserCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import './UserCreatePage.css';
import { createUserService } from '../../../../services/Users/createUserService';

/**
 * UserCreatePage - HOMOLOGADO CON BACKEND Y SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ VALIDACIONES: Según esquemas Joi del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ ESTILO: Usa clases del sistema de diseño centralizado
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que CategoryCreatePage
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
      helperText: 'Opcional. Si se proporciona, debe ser válido y único',
      width: 'half'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      required: true,
      leftIcon: '🔒',
      helperText: 'Mínimo 8 caracteres, debe incluir letras y números',
      width: 'half'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirmar Contraseña',
      placeholder: 'Repite la contraseña',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe coincidir con la contraseña anterior',
      width: 'half'
    },
    {
      name: 'roleId',
      type: 'select',
      label: 'Rol del Usuario',
      required: true,
      leftIcon: '🎭',
      helperText: 'Define los permisos y funcionalidades disponibles',
      options: [
        { value: '', label: 'Selecciona un rol' },
        { value: 1, label: '👑 Administrador - Acceso completo al sistema' },
        { value: 2, label: '👤 Usuario - Acceso básico al contenido' }
      ],
      width: 'half'
    },
    {
      name: 'isActive',
      type: 'select',
      label: 'Estado del Usuario',
      required: true,
      leftIcon: '🔄',
      helperText: 'Define si el usuario puede acceder al sistema',
      options: [
        { value: '', label: 'Selecciona un estado' },
        { value: true, label: '✅ Activo - Puede iniciar sesión' },
        { value: false, label: '❌ Inactivo - Sin acceso al sistema' }
      ],
      width: 'half'
    }
  ];

  /**
   * ✅ Datos iniciales del formulario
   */
  const initialData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    isActive: ''
  };

  // ===== FUNCIONES DE NEGOCIO =====

  /**
   * ✅ Validar contraseñas coincidentes
   */
  const validatePasswords = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
  };

  /**
   * ✅ Limpiar datos antes de enviar al backend
   */
  const cleanFormData = (formData) => {
    const cleanData = { ...formData };

    // Eliminar confirmPassword (no va al backend)
    delete cleanData.confirmPassword;

    // Convertir valores string a boolean/number según corresponda
    cleanData.roleId = parseInt(cleanData.roleId);
    cleanData.isActive = cleanData.isActive === 'true' || cleanData.isActive === true;

    // Si email está vacío, no enviarlo (es opcional)
    if (!cleanData.email || cleanData.email.trim() === '') {
      delete cleanData.email;
    }

    return cleanData;
  };

  /**
   * ✅ Manejar envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar contraseñas
      validatePasswords(formData);

      // Limpiar datos para backend
      const cleanData = cleanFormData(formData);

      console.log('🚀 Creando usuario:', cleanData);

      // Llamar al servicio
      const response = await createUserService(cleanData);

      console.log('✅ Usuario creado:', response);

      // Estado de éxito
      setSuccess(true);
      setHasChanges(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear usuario:', err);

      // Manejar diferentes tipos de errores
      if (err.message === 'Las contraseñas no coinciden') {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error inesperado al crear el usuario. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Detectar cambios en el formulario
   */
  const handleFormChange = (changedData) => {
    setHasChanges(true);
    setError(null); // Limpiar errores al hacer cambios
  };

  /**
   * ✅ Cancelar creación
   */
  const handleCancel = () => {
    if (hasChanges && !success) {
      const confirmCancel = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?\n\n' +
        'Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }

    navigate('/admin/users');
  };

  // ===== RENDER =====

  return (
    <AdminLayout
      title="Crear Nuevo Usuario"
      subtitle="Registra un nuevo usuario con acceso al sistema de gestión de contenido"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: 'Crear' }
      ]}
    >
      <div className="page-container page-container--wide">

        {/* 🔧 HEADER ACTIONS - USANDO SISTEMA DE DISEÑO */}
        <div className="page-header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleCancel}
            disabled={loading}
          >
            Volver a Usuarios
          </Button>
        </div>

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
            fieldSize="lg"
            fieldRounded="md"
            submitText={loading ? "Creando Usuario..." : "Crear Usuario"}
            submitVariant="primary"
            submitSize="md"
            submitIcon="👤"
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