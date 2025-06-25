// ===== ADMINSIDEBAR COMPONENT =====
// src/components/organism/AdminSidebar/AdminSidebar.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import './AdminSidebar.css';

/**
 * AdminSidebar - Navegación lateral para panel de administración
 * 
 * Características implementadas:
 * - ✅ Navegación colapsible 
 * - ✅ Menús y submenús expandibles
 * - ✅ Estados activos/hover
 * - ✅ Badges con contadores dinámicos
 * - ✅ Responsive (oculto en móvil)
 * - ✅ Consistente con sistema de diseño
 * - ✅ Accesibilidad completa
 */
function AdminSidebar({
  // Estados del sidebar
  isCollapsed = false,
  onToggleCollapse,
  
  // Datos dinámicos para badges
  userCount = 0,
  movieCount = 0,
  seriesCount = 0,
  categoryCount = 0,
  episodeCount = 0,
  
  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'dark' | 'minimal'
  
  // Handlers opcionales para Storybook
  onNavigate,
  
  // Props adicionales
  ...restProps
}) {
  // Hooks de router con manejo de errores
  let navigate, location;
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Fallback para cuando no hay router (Storybook)
    navigate = onNavigate || ((route) => console.log('Navigate to:', route));
    location = { pathname: '/admin' };
  }

  const [expandedMenus, setExpandedMenus] = useState(new Set(['dashboard']));

  // ===== CONFIGURACIÓN DE MENÚS =====
  const sidebarItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      route: '/admin',
      exact: true,
      description: 'Panel principal con estadísticas'
    },
    {
      id: 'users',
      icon: '👥',
      label: 'Usuarios',
      route: '/admin/users',
      badge: userCount,
      description: 'Gestionar usuarios del sistema',
      submenu: [
        { label: 'Listar Usuarios', route: '/admin/users', icon: '📋' },
        { label: 'Crear Usuario', route: '/admin/users/create', icon: '➕' }
      ]
    },
    {
      id: 'categories',
      icon: '📂',
      label: 'Categorías',
      route: '/admin/categories',
      badge: categoryCount,
      description: 'Gestionar categorías de contenido',
      submenu: [
        { label: 'Listar Categorías', route: '/admin/categories', icon: '📋' },
        { label: 'Crear Categoría', route: '/admin/categories/create', icon: '➕' }
      ]
    },
    {
      id: 'movies',
      icon: '🎬',
      label: 'Películas',
      route: '/admin/movies',
      badge: movieCount,
      description: 'Gestionar películas',
      submenu: [
        { label: 'Listar Películas', route: '/admin/movies', icon: '📋' },
        { label: 'Crear Película', route: '/admin/movies/create', icon: '➕' }
      ]
    },
    {
      id: 'series',
      icon: '📺',
      label: 'Series',
      route: '/admin/series',
      badge: seriesCount,
      description: 'Gestionar series',
      submenu: [
        { label: 'Listar Series', route: '/admin/series', icon: '📋' },
        { label: 'Crear Serie', route: '/admin/series/create', icon: '➕' }
      ]
    },
    {
      id: 'episodes',
      icon: '🎞️',
      label: 'Episodios',
      route: '/admin/episodes',
      badge: episodeCount,
      description: 'Gestionar episodios de series',
      submenu: [
        { label: 'Listar Episodios', route: '/admin/episodes', icon: '📋' },
        { label: 'Crear Episodio', route: '/admin/episodes/create', icon: '➕' }
      ]
    }
  ];

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Verifica si una ruta está activa
   */
  const isRouteActive = (route, exact = false) => {
    if (!location) return false;
    if (exact) {
      return location.pathname === route;
    }
    return location.pathname.startsWith(route);
  };

  /**
   * Verifica si un menú tiene rutas activas
   */
  const hasActiveSubmenu = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some(subitem => isRouteActive(subitem.route));
  };

  /**
   * Maneja la navegación a una ruta
   */
  const handleNavigation = (route, event) => {
    event.preventDefault();
    if (navigate) {
      navigate(route);
    }
  };

  /**
   * Alterna la expansión de un menú
   */
  const toggleMenu = (menuId, event) => {
    event.stopPropagation();
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  /**
   * Maneja el click en un item principal
   */
  const handleItemClick = (item, event) => {
    if (item.submenu) {
      // Si tiene submenú, alternar expansión
      toggleMenu(item.id, event);
    } else {
      // Si no tiene submenú, navegar directamente
      handleNavigation(item.route, event);
    }
  };

  /**
   * Maneja el botón de volver al inicio
   */
  const handleBackToHome = () => {
    if (navigate) {
      navigate('/main-page');
    }
  };

  // ===== EFECTOS =====
  
  // Auto-expandir menú activo
  useEffect(() => {
    if (!location) return;
    
    sidebarItems.forEach(item => {
      if (hasActiveSubmenu(item) || isRouteActive(item.route)) {
        setExpandedMenus(prev => new Set([...prev, item.id]));
      }
    });
  }, [location?.pathname]);

  // ===== CLASES CSS =====
  const sidebarClasses = [
    'admin-sidebar',
    `admin-sidebar--${variant}`,
    isCollapsed && 'admin-sidebar--collapsed',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER =====
  return (
    <aside 
      className={sidebarClasses}
      role="navigation"
      aria-label="Panel de administración"
      {...restProps}
    >
      {/* ===== HEADER DEL SIDEBAR ===== */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          {!isCollapsed && (
            <>
              <span className="admin-sidebar__logo">⚙️</span>
              <div className="admin-sidebar__brand-text">
                <h2 className="admin-sidebar__title">Admin Panel</h2>
                <p className="admin-sidebar__subtitle">StreamApp</p>
              </div>
            </>
          )}
        </div>
        
        {/* Botón para colapsar/expandir */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="admin-sidebar__toggle"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* ===== NAVEGACIÓN PRINCIPAL ===== */}
      <nav className="admin-sidebar__nav">
        <ul className="admin-sidebar__menu" role="menubar">
          {sidebarItems.map((item) => {
            const isActive = item.exact 
              ? isRouteActive(item.route, true)
              : isRouteActive(item.route) || hasActiveSubmenu(item);
            const isExpanded = expandedMenus.has(item.id);
            const hasSubmenu = Boolean(item.submenu);

            return (
              <li 
                key={item.id}
                className="admin-sidebar__menu-item"
                role="none"
              >
                {/* Item principal */}
                <button
                  className={[
                    'admin-sidebar__item',
                    isActive && 'admin-sidebar__item--active',
                    hasSubmenu && 'admin-sidebar__item--has-submenu'
                  ].filter(Boolean).join(' ')}
                  onClick={(e) => handleItemClick(item, e)}
                  role="menuitem"
                  aria-expanded={hasSubmenu ? isExpanded : undefined}
                  aria-describedby={!isCollapsed ? `${item.id}-desc` : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="admin-sidebar__item-icon">
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <>
                      <span className="admin-sidebar__item-label">
                        {item.label}
                      </span>
                      
                      {/* Badge con contador */}
                      {item.badge > 0 && (
                        <span 
                          className="admin-sidebar__badge"
                          aria-label={`${item.badge} elementos`}
                        >
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Flecha para submenús */}
                      {hasSubmenu && (
                        <span 
                          className={[
                            'admin-sidebar__arrow',
                            isExpanded && 'admin-sidebar__arrow--expanded'
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Descripción para accesibilidad */}
                {!isCollapsed && (
                  <span 
                    id={`${item.id}-desc`}
                    className="admin-sidebar__description"
                  >
                    {item.description}
                  </span>
                )}

                {/* Submenú */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <ul 
                    className="admin-sidebar__submenu"
                    role="menu"
                    aria-label={`Submenú de ${item.label}`}
                  >
                    {item.submenu.map((subitem, index) => (
                      <li 
                        key={index}
                        className="admin-sidebar__submenu-item"
                        role="none"
                      >
                        <button
                          className={[
                            'admin-sidebar__subitem',
                            isRouteActive(subitem.route, true) && 'admin-sidebar__subitem--active'
                          ].filter(Boolean).join(' ')}
                          onClick={(e) => handleNavigation(subitem.route, e)}
                          role="menuitem"
                        >
                          <span className="admin-sidebar__subitem-icon">
                            {subitem.icon}
                          </span>
                          <span className="admin-sidebar__subitem-label">
                            {subitem.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== FOOTER DEL SIDEBAR ===== */}
      {!isCollapsed && (
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user-info">
            <div className="admin-sidebar__user-avatar">👤</div>
            <div className="admin-sidebar__user-details">
              <p className="admin-sidebar__user-name">Administrador</p>
              <p className="admin-sidebar__user-role">Panel de Control</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToHome}
            className="admin-sidebar__back-button"
          >
            ← Volver al inicio
          </Button>
        </div>
      )}
    </aside>
  );
}

export { AdminSidebar };