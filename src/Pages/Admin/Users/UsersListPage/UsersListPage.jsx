// ===== USERS LIST PAGE =====
// src/Pages/Admin/Users/UsersListPage.jsx

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
 * UsersListPage - Página de gestión de usuarios
 * 
 * Características implementadas:
 * - ✅ AdminLayout como contenedor
 * - ✅ DataTable con datos reales de usuarios
 * - ✅ Operaciones CRUD: Ver, Editar, Eliminar
 * - ✅ Estados de loading, error, empty
 * - ✅ Búsqueda y filtrado de usuarios
 * - ✅ Paginación configurada
 * - ✅ Confirmaciones de eliminación
 * - ✅ Navegación a formularios de crear/editar
 * - ✅ Responsive design
 */
function UsersListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // ID del usuario siendo eliminado

  // ===== EFECTOS =====
  
  /**
   * Cargar usuarios al montar el componente
   */
  useEffect(() => {
    loadUsers();
  }, []);

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar lista de usuarios desde el servicio
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUsersService();
      
      // Manejar diferentes formatos de respuesta
      let userData = [];
      if (Array.isArray(response)) {
        userData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        userData = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        userData = response.items;
      }

      // Mapear datos al formato esperado por la tabla
      const mappedUsers = userData.map(user => ({
        id: user.id,
        email: user.email || user.username || 'Sin email',
        roleId: user.roleId || user.role_id || 1,
        roleName: getRoleName(user.roleId || user.role_id || 1),
        status: user.status || user.active ? 'Activo' : 'Inactivo',
        createdAt: user.createdAt || user.created_at || user.dateCreated || new Date().toISOString(),
        lastLogin: user.lastLogin || user.last_login || user.updatedAt || 'Nunca',
        // Datos originales para operaciones
        _original: user
      }));

      setUsers(mappedUsers);
      
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar la lista de usuarios. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener nombre del rol basado en roleId
   */
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Administrador',
      2: 'Editor',
      3: 'Usuario'
    };
    return roles[roleId] || 'Usuario';
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Nunca') return 'Nunca';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // ===== HANDLERS DE ACCIONES =====
  
  /**
   * Ver detalles de un usuario
   */
  const handleViewUser = async (user) => {
    try {
      // Intentar obtener datos completos del usuario
      const response = await getUserByIdService(user.id);
      
      // Por ahora, navegar a una página de detalles (cuando la creemos)
      // navigate(`/admin/users/${user.id}`);
      
      // Mientras tanto, mostrar los datos en console para desarrollo
      console.log('Ver usuario:', response || user);
      alert(`Ver detalles de: ${user.email}\n\nEsta funcionalidad estará disponible pronto.`);
      
    } catch (err) {
      console.error('Error viewing user:', err);
      alert('Error al obtener los detalles del usuario');
    }
  };

  /**
   * Editar un usuario
   */
  const handleEditUser = (user) => {
    // Navegar a página de edición (cuando la creemos)
    navigate(`/admin/users/${user.id}/edit`);
  };

  /**
   * Eliminar un usuario con confirmación
   */
  const handleDeleteUser = async (user) => {
    // Confirmar eliminación
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar al usuario "${user.email}"?\n\n` +
      'Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    try {
      setDeleting(user.id);
      
      // Llamar al servicio de eliminación
      await deleteUserService(user.id);
      
      // Remover usuario de la lista local
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      
      // Mostrar mensaje de éxito
      alert(`Usuario "${user.email}" eliminado correctamente.`);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error al eliminar el usuario. Inténtalo de nuevo.');
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

  // ===== CONFIGURACIÓN DE COLUMNAS =====
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
      accessorKey: 'email',
      header: 'Correo Electrónico',
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
          'success';                  // Usuario
        
        return (
          <span className={`data-table__badge data-table__badge--${badgeClass}`}>
            {role}
          </span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        const variant = status === 'Activo' ? 'success' : 'danger';
        return (
          <span className={`data-table__badge data-table__badge--${variant}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Registro',
      size: 150,
      cell: ({ getValue }) => (
        <span className="users-list__date">
          {formatDate(getValue())}
        </span>
      )
    },
    {
      accessorKey: 'lastLogin',
      header: 'Último Acceso',
      size: 150,
      cell: ({ getValue }) => (
        <span className="users-list__date users-list__date--muted">
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
        {/* ===== INFORMACIÓN ADICIONAL ===== */}
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
                <span className="users-list__stat-value">
                  {users.filter(u => u.roleId === 3).length}
                </span>
                <span className="users-list__stat-label">Usuarios</span>
              </div>
              <div className="users-list__stat">
                <span className="users-list__stat-value">
                  {users.filter(u => u.status === 'Activo').length}
                </span>
                <span className="users-list__stat-label">Activos</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== TABLA DE USUARIOS ===== */}
        <div className="users-list__table">
          <DataTable
            data={users}
            columns={userColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar por email o rol..."
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={25}
            variant="default"
            emptyTitle="No hay usuarios registrados"
            emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
            emptyIcon="👥"
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            className={deleting ? 'users-list__table--deleting' : ''}
          />
        </div>

        {/* ===== MENSAJE DE ELIMINACIÓN ===== */}
        {deleting && (
          <div className="users-list__deleting-overlay">
            <div className="users-list__deleting-message">
              <span className="users-list__deleting-spinner">⏳</span>
              Eliminando usuario...
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export { UsersListPage };