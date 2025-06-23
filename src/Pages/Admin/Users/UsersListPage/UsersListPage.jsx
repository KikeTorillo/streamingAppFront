// ===== USERS LIST PAGE (CORREGIDO PARA BACKEND) =====
// src/Pages/Admin/Users/UsersListPage/UsersListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './UsersListPage.css';

// Importar servicios de usuarios
import { getUsersService } from '../../../../services/Users/getUsersService';
import { getUserByIdService } from '../../../../services/Users/getUserByIdService';
import { deleteUserService } from '../../../../services/Users/deleteUserService';

/**
 * UsersListPage - Página de gestión de usuarios (ACTUALIZADA PARA BACKEND)
 * 
 * CAMBIOS PARA BACKEND:
 * - ✅ Corregido mapeo de role_id desde backend
 * - ✅ Agregado campo username que existe en DB
 * - ✅ Eliminado campo status simulado
 * - ✅ Actualizada estructura de datos según respuesta real
 * - ✅ Mejorado manejo de fechas created_at/updated_at
 */
function UsersListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== EFECTOS =====
  useEffect(() => {
    loadUsers();
  }, []);

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar lista de usuarios desde el servicio (ACTUALIZADA)
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando usuarios desde el backend...');
      const response = await getUsersService();
      console.log('Respuesta del backend:', response);
      
      // Manejar diferentes formatos de respuesta
      let userData = [];
      if (Array.isArray(response)) {
        userData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        userData = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        userData = response.items;
      }

      console.log('Datos de usuarios extraídos:', userData);

      // Mapear datos según la estructura REAL del backend
      const mappedUsers = userData.map(user => {
        console.log('Mapeando usuario:', user);
        
        return {
          id: user.id,
          username: user.username || 'Sin username',
          email: user.email || 'Sin email',
          // Backend devuelve role_id (snake_case)
          roleId: user.role_id || user.roleId || 3, // Default a Usuario Normal
          roleName: getRoleName(user.role_id || user.roleId || 3),
          // El backend no tiene campo status, lo calculamos basado en datos existentes
          isActive: user.recovery_token ? false : true, // Si tiene token de recovery, posiblemente inactivo
          createdAt: user.created_at || user.createdAt || new Date().toISOString(),
          updatedAt: user.updated_at || user.updatedAt || new Date().toISOString(),
          recoveryToken: user.recovery_token || null,
          // Datos originales para debugging
          _original: user
        };
      });

      console.log('Usuarios mapeados:', mappedUsers);
      setUsers(mappedUsers);
      
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar la lista de usuarios. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener nombre del rol basado en roleId (ACTUALIZADO)
   */
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Administrador',
      2: 'Editor', 
      3: 'Usuario Normal'
    };
    return roles[roleId] || 'Usuario Normal';
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  /**
   * Calcular tiempo transcurrido desde la creación
   */
  const getTimeSinceCreated = (createdAt) => {
    if (!createdAt) return 'No disponible';
    
    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Hoy';
      if (diffInDays === 1) return 'Ayer';
      if (diffInDays < 30) return `Hace ${diffInDays} días`;
      if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
      return `Hace ${Math.floor(diffInDays / 365)} años`;
    } catch {
      return 'No disponible';
    }
  };

  // ===== HANDLERS DE ACCIONES =====
  
  /**
   * Ver detalles de un usuario
   */
  const handleViewUser = async (user) => {
    try {
      console.log('Viendo detalles de usuario:', user);
      
      // Intentar obtener datos completos del usuario
      const response = await getUserByIdService(user.id);
      console.log('Detalles completos del usuario:', response);
      
      // Mostrar información completa del usuario
      const userDetails = `
=== DETALLES DEL USUARIO ===
ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Rol: ${user.roleName} (ID: ${user.roleId})
Estado: ${user.isActive ? 'Activo' : 'Inactivo'}
Creado: ${formatDate(user.createdAt)}
Actualizado: ${formatDate(user.updatedAt)}
Token de Recovery: ${user.recoveryToken ? 'Sí' : 'No'}

=== DATOS ORIGINALES ===
${JSON.stringify(user._original, null, 2)}
      `;
      
      alert(userDetails);
      
    } catch (err) {
      console.error('Error viewing user:', err);
      alert('Error al obtener los detalles del usuario');
    }
  };

  /**
   * Editar un usuario
   */
  const handleEditUser = (user) => {
    console.log('Editando usuario:', user);
    // TODO: Navegar a página de edición cuando esté lista
    navigate(`/admin/users/${user.id}/edit`);
  };

  /**
   * Eliminar un usuario con confirmación
   */
  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar al usuario?\n\n` +
      `Username: ${user.username}\n` +
      `Email: ${user.email}\n` +
      `Rol: ${user.roleName}\n\n` +
      'Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    try {
      setDeleting(user.id);
      console.log('Eliminando usuario:', user);
      
      // Llamar al servicio de eliminación
      await deleteUserService(user.id);
      
      // Remover usuario de la lista local
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      
      // Mostrar mensaje de éxito
      alert(`✅ Usuario "${user.username}" eliminado correctamente.`);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      
      let errorMessage = 'Error al eliminar el usuario.';
      if (err.response?.status === 404) {
        errorMessage = 'El usuario no existe o ya fue eliminado.';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar este usuario.';
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Crear nuevo usuario
   */
  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  /**
   * Refrescar lista de usuarios
   */
  const handleRefresh = () => {
    loadUsers();
  };

  // ===== CONFIGURACIÓN DE COLUMNAS (ACTUALIZADA) =====
  const userColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ getValue }) => (
        <span className="users-list__id">
          #{getValue()}
        </span>
      )
    },
    {
      accessorKey: 'username',
      header: 'Username',
      size: 150,
      cell: ({ getValue }) => (
        <span className="users-list__username" title={getValue()}>
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="users-list__email" title={getValue()}>
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'roleName',
      header: 'Rol',
      size: 120,
      cell: ({ getValue, row }) => {
        const role = getValue();
        const roleId = row.original.roleId;
        const badgeClass = 
          roleId === 1 ? 'info' :     // Administrador
          roleId === 2 ? 'warning' :  // Editor
          'success';                  // Usuario Normal
        
        return (
          <span className={`data-table__badge data-table__badge--${badgeClass}`}>
            {role}
          </span>
        );
      }
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      size: 100,
      cell: ({ getValue, row }) => {
        const isActive = getValue();
        const hasRecoveryToken = row.original.recoveryToken;
        
        let status, variant;
        if (hasRecoveryToken) {
          status = 'En Recovery';
          variant = 'warning';
        } else if (isActive) {
          status = 'Activo';
          variant = 'success';
        } else {
          status = 'Inactivo';
          variant = 'danger';
        }
        
        return (
          <span className={`data-table__badge data-table__badge--${variant}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      size: 180,
      cell: ({ getValue, row }) => (
        <div className="users-list__date-cell">
          <span className="users-list__date">
            {formatDate(getValue())}
          </span>
          <span className="users-list__date-relative">
            {getTimeSinceCreated(getValue())}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      size: 180,
      cell: ({ getValue }) => (
        <span className="users-list__date">
          {formatDate(getValue())}
        </span>
      )
    }
  ];

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Usuarios"
      subtitle={`${users.length} usuario${users.length !== 1 ? 's' : ''} registrado${users.length !== 1 ? 's' : ''}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios' }
      ]}
      headerActions={
        <div className="users-list__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
            icon="🔄"
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateUser}
            icon="➕"
          >
            Crear Usuario
          </Button>
        </div>
      }
    >
      <div className="users-list">
        {/* ===== INFORMACIÓN ADICIONAL (ACTUALIZADA) ===== */}
        {!loading && !error && users.length > 0 && (
          <div className="users-list__summary">
            <div className="users-list__stats">
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {users.filter(u => u.roleId === 1).length}
                </span>
                <span className="users-list__stat-label">Administradores</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {users.filter(u => u.roleId === 2).length}
                </span>
                <span className="users-list__stat-label">Editores</span>
              </div>
              <div className="users-list__stat">
                <span className="users-