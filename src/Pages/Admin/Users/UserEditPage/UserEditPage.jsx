// ===== USER EDIT PAGE - SIGUIENDO SISTEMA DE DISEÑO =====
// src/Pages/Admin/Users/UserEditPage/UserEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import './UserEditPage.css';

// Servicios de usuarios
import { getUserByIdService } from '../../../../services/Users/getUserByIdService';
import { updateUserService } from '../../../../services/Users/updateUserService';

/**
 * UserEditPage - Página de edición de usuarios
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ VALIDACIONES: Según esquemas del backend
 * ✅ UX: Estados de loading, error y success consistentes
 */
function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userData, setUserData] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // ===== VERIFICAR SI ES USUARIO ACTUAL =====
  const isCurrentUser = () => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
      return sessionUser.sub?.toString() === id;
    } catch {
      return false;
    }
  };

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos de edición - Solo campos permitidos para actualización
   * Según el updateUserService: userName, email, roleId
   */
  const getEditFormFields = () => {
    const isEditingSelf = isCurrentUser();
    
    return [
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
        required: false,
        leftIcon: '📧',
        helperText: 'Opcional: para notificaciones y recuperación',
        width: 'half'
      },
      {
        name: 'roleId',
        type: 'select',
        label: 'Rol del Usuario',
        required: true,
        leftIcon: '👥',
        disabled: isEditingSelf, // No permitir cambiar su propio rol
        helperText: isEditingSelf 
          ? 'No puedes cambiar tu propio rol por seguridad'
          : 'Define los permisos del usuario en el sistema',
        options: [
          { value: 1, label: '👑 Administrador', disabled: false },
          { value: 2, label: '✏️ Editor', disabled: false },
          { value: 3, label: '👤 Usuario', disabled: false }
        ],
        width: 'full'
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos del usuario desde el backend
   */
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando datos del usuario:', id);
      const response = await getUserByIdService(id);
      
      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      }

      if (!response.success && response.error) {
        throw new Error(response.error);
      }

      // Normalizar datos del usuario
      const user = response.data || response;
      const normalizedUserData = {
        id: user.id,
        username: user.userName || user.username,
        email: user.email || '',
        roleId: user.roleId || user.role_id || 3,
        roleName: user.roleName || getRoleName(user.roleId || user.role_id || 3),
        createdAt: user.createdAt || user.created_at,
        updatedAt: user.updatedAt || user.updated_at
      };

      console.log('📋 Datos del usuario cargados:', normalizedUserData);
      
      setUserData(normalizedUserData);
      setInitialData({ ...normalizedUserData });
      
    } catch (error) {
      console.error('💥 Error loading user data:', error);
      setError(error.message || 'Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    if (!initialData) return;
    
    // Verificar si hay cambios comparando con datos iniciales
    const hasAnyChanges = Object.keys(formData).some(key => {
      if (key === 'confirmPassword') return false; // Ignorar confirmación
      return formData[key] !== initialData[key];
    });
    
    setHasChanges(hasAnyChanges);
  };

  /**
   * Validaciones personalizadas
   */
  const validateForm = (formData) => {
    const errors = {};
    
    // Validar username
    if (!formData.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'Mínimo 3 caracteres';
    } else if (formData.username.length > 30) {
      errors.username = 'Máximo 30 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Solo letras, números y guiones bajos';
    }
    
    // Validar email (opcional pero si está presente debe ser válido)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }
    
    // Validar roleId
    if (!formData.roleId || ![1, 2, 3].includes(Number(formData.roleId))) {
      errors.roleId = 'Selecciona un rol válido';
    }
    
    return errors;
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);

      // Validar formulario
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Por favor corrige los errores en el formulario');
      }

      console.log('💾 Guardando cambios del usuario:', formData);

      // Preparar datos para actualización (solo campos que cambiaron)
      const updatedFields = {};
      if (formData.username !== initialData.username) {
        updatedFields.username = formData.username;
      }
      if (formData.email !== initialData.email) {
        updatedFields.email = formData.email;
      }
      if (Number(formData.roleId) !== Number(initialData.roleId)) {
        updatedFields.roleId = Number(formData.roleId);
      }

      // Solo enviar si hay cambios
      if (Object.keys(updatedFields).length === 0) {
        throw new Error('No hay cambios para guardar');
      }

      const response = await updateUserService(id, updatedFields);
      
      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {
        sessionStorage.clear();
        navigate('/login');
        return;
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar usuario');
      }

      console.log('✅ Usuario actualizado exitosamente');
      
      // Mostrar éxito y actualizar datos
      setSuccess(true);
      setHasChanges(false);
      
      // Recargar datos actualizados
      await loadUserData();
      
      // Redirigir después de un momento
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (error) {
      console.error('💥 Error saving user:', error);
      setError(error.message || 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancelar edición
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        '¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }
    
    navigate('/admin/users');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    if (id) {
      loadUserData();
    } else {
      setError('ID de usuario no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Mapear roleId a nombre
   */
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Administrador',
      2: 'Editor', 
      3: 'Usuario'
    };
    return roles[roleId] || 'Desconocido';
  };

  // ===== RENDER =====
  
  if (loading) {
    return (
      <AdminLayout
        title="Editar Usuario"
        subtitle="Cargando datos del usuario..."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usuarios', href: '/admin/users' },
          { label: 'Editar' }
        ]}
      >
        <div className="user-edit__loading">
          <div className="user-edit__loading-spinner">⏳</div>
          <p>Cargando información del usuario...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !userData) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar el usuario"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usuarios', href: '/admin/users' },
          { label: 'Error' }
        ]}
      >
        <div className="user-edit__error">
          <div className="user-edit__error-icon">❌</div>
          <h2>Error al cargar usuario</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/admin/users')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar Usuario: ${userData?.username || 'Usuario'}`}
      subtitle={`${userData?.roleName || 'Rol'} • Creado ${userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: userData?.username || 'Editar' }
      ]}
      headerActions={
        <div className="user-edit__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('user-edit-form')?.requestSubmit()}
            loading={saving}
            disabled={!hasChanges || saving}
            leftIcon="💾"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      }
    >
      <div className="user-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="user-edit__success">
            <div className="user-edit__success-icon">✅</div>
            <div className="user-edit__success-content">
              <h3>¡Usuario actualizado exitosamente!</h3>
              <p>Los cambios se han guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="user-edit__error-message">
            <div className="user-edit__error-icon">⚠️</div>
            <div className="user-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ===== INFORMACIÓN ACTUAL (ANTES DEL FORMULARIO) ===== */}
        <div className="user-edit__current-info">
          <div className="user-edit__current-info-section">
            <h3 className="user-edit__info-title">📋 Información Actual del Usuario</h3>
            <div className="user-edit__current-info-grid">
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">ID:</span>
                <span className="user-edit__current-info-value">{userData?.id}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Usuario:</span>
                <span className="user-edit__current-info-value">{userData?.username}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Email:</span>
                <span className="user-edit__current-info-value">{userData?.email || 'Sin email'}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Rol:</span>
                <span className="user-edit__current-info-value">{userData?.roleName}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Creado:</span>
                <span className="user-edit__current-info-value">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Actualizado:</span>
                <span className="user-edit__current-info-value">
                  {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'short',
                    day: 'numeric'
                  }) : 'Nunca'}
                </span>
              </div>
            </div>
            
            {isCurrentUser() && (
              <div className="user-edit__warning">
                <span className="user-edit__warning-icon">⚠️</span>
                <span>Estás editando tu propia cuenta. Ten cuidado con los cambios.</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== FORMULARIO DE EDICIÓN (MISMO ESTILO QUE CREATE) ===== */}
        <div className="user-edit__form-container">
          <div className="user-edit__form-header">
            <h2 className="user-edit__form-title">Información del Usuario</h2>
            <p className="user-edit__form-description">
              Modifica los campos necesarios. Solo se enviarán los campos que cambies y que existen en la base de datos.
            </p>
          </div>

          <DynamicForm
            id="user-edit-form"
            fields={getEditFormFields()}
            initialData={{
              username: userData?.username || '',
              email: userData?.email || '',
              roleId: userData?.roleId || 3
            }}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            loading={saving}
            disabled={saving || success}
            columnsPerRow={2}
            tabletColumns={1}
            mobileColumns={1}
            fieldSize="md"
            fieldRounded="md"
            submitText={saving ? 'Guardando...' : 'Guardar Cambios'}
            submitVariant="primary"
            submitSize="md"
            submitIcon="💾"
            validateOnBlur={true}
            validateOnChange={false}
            showSubmit={!success} // Ocultar botón cuando hay éxito
            className={`user-edit__form ${success ? 'user-edit__form--success' : ''}`}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserEditPage };