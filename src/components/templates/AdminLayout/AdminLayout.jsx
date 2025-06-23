// ===== ADMIN LAYOUT COMPONENT =====
// src/components/templates/AdminLayout/AdminLayout.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../../organism/AdminSidebar/AdminSidebar';
import { Button } from '../../atoms/Button/Button';
import './AdminLayout.css';

// Importar servicios para obtener contadores en tiempo real
import { getUsersService } from '../../../services/Users/getUsersService';
import { getMoviesService } from '../../../services/Movies/getMoviesService';
import { getSeriesService } from '../../../services/Series/getSeriesService';
import { getCategoriesService } from '../../../services/Categories/getCategoriesService';
import { getEpisodesService } from '../../../services/Episodes/getEpisodesService';

/**
 * AdminLayout - Template base para el panel de administración
 * 
 * Características implementadas:
 * - ✅ Sidebar integrado con contadores dinámicos
 * - ✅ Header administrativo con breadcrumbs
 * - ✅ Área de contenido principal responsive
 * - ✅ Estados de loading para contadores
 * - ✅ Manejo de autenticación admin
 * - ✅ Responsive design completo
 * - ✅ Integración con todos los servicios
 */
function AdminLayout({
  // Contenido principal
  children,
  
  // Configuración del header
  title,
  subtitle,
  breadcrumbs = [],
  
  // Acciones del header
  headerActions,
  
  // Props del layout
  sidebarCollapsed = false,
  onSidebarToggle,
  
  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'compact' | 'full'
  
  // Props adicionales
  ...restProps
}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ===== ESTADOS =====
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    movies: 0,
    series: 0,
    categories: 0,
    episodes: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [countsError, setCountsError] = useState(null);

  // ===== VERIFICAR AUTENTICACIÓN ADMIN =====
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (!sessionUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionUser);
      
      // Verificar que sea admin (ajustar según tu sistema de roles)
      const isAdmin = userData.role === 'admin' || 
                     userData.roleId === 1 || 
                     userData.isAdmin === true;
      
      if (!isAdmin) {
        // Si no es admin, redirigir al inicio
        navigate('/');
        return;
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // ===== CARGAR CONTADORES EN TIEMPO REAL =====
  useEffect(() => {
    if (!user) return;

    const loadCounts = async () => {
      try {
        setLoadingCounts(true);
        setCountsError(null);

        // Cargar todos los contadores en paralelo
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse,
          episodesResponse
        ] = await Promise.allSettled([
          getUsersService().catch(() => []),
          getMoviesService().catch(() => []),
          getSeriesService().catch(() => []),
          getCategoriesService().catch(() => []),
          getEpisodesService().catch(() => [])
        ]);

        // Procesar respuestas y extraer contadores
        const newCounts = {
          users: getArrayLength(usersResponse),
          movies: getArrayLength(moviesResponse),
          series: getArrayLength(seriesResponse),
          categories: getArrayLength(categoriesResponse),
          episodes: getArrayLength(episodesResponse)
        };

        setCounts(newCounts);
      } catch (error) {
        console.error('Error loading counts:', error);
        setCountsError('Error al cargar estadísticas');
      } finally {
        setLoadingCounts(false);
      }
    };

    // Cargar inmediatamente
    loadCounts();

    // Recargar cada 30 segundos para mantener datos actualizados
    const interval = setInterval(loadCounts, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Extrae la longitud de arrays de diferentes formatos de respuesta
   */
  const getArrayLength = (response) => {
    if (response.status === 'rejected') return 0;
    
    const data = response.value;
    if (Array.isArray(data)) return data.length;
    if (data?.data && Array.isArray(data.data)) return data.data.length;
    if (data?.items && Array.isArray(data.items)) return data.items.length;
    return 0;
  };

  /**
   * Genera breadcrumbs automáticamente basado en la ruta
   */
  const generateBreadcrumbs = () => {
    if (breadcrumbs.length > 0) return breadcrumbs;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Admin', href: '/admin' }];

    let currentPath = '';
    pathSegments.slice(1).forEach(segment => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({
        label: label.replace('-', ' '),
        href: `/admin${currentPath}`
      });
    });

    return crumbs;
  };

  /**
   * Maneja el toggle del sidebar
   */
  const handleSidebarToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsed);
    }
  };

  /**
   * Genera título automático basado en la ruta
   */
  const getPageTitle = () => {
    if (title) return title;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length <= 1) return 'Dashboard';
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  };

  /**
   * Maneja logout de admin
   */
  const handleLogout = () => {
    sessionStorage.removeItem('sessionUser');
    navigate('/login');
  };

  // ===== RENDER =====
  
  // Mostrar loading mientras verifica autenticación
  if (!user) {
    return (
      <div className="admin-layout__loading">
        <div className="admin-layout__loading-content">
          <div className="admin-layout__spinner"></div>
          <p>Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  // ===== CLASES CSS =====
  const layoutClasses = [
    'admin-layout',
    `admin-layout--${variant}`,
    isCollapsed && 'admin-layout--sidebar-collapsed',
    className
  ].filter(Boolean).join(' ');

  const currentBreadcrumbs = generateBreadcrumbs();
  const pageTitle = getPageTitle();

  return (
    <div className={layoutClasses} {...restProps}>
      {/* ===== SIDEBAR ===== */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleSidebarToggle}
        userCount={counts.users}
        movieCount={counts.movies}
        seriesCount={counts.series}
        categoryCount={counts.categories}
        episodeCount={counts.episodes}
        variant="default"
      />

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="admin-layout__main">
        {/* ===== HEADER ADMINISTRATIVO ===== */}
        <header className="admin-layout__header">
          <div className="admin-layout__header-content">
            {/* Breadcrumbs */}
            <nav className="admin-layout__breadcrumbs" aria-label="Breadcrumb">
              <ol className="admin-layout__breadcrumb-list">
                {currentBreadcrumbs.map((crumb, index) => (
                  <li key={index} className="admin-layout__breadcrumb-item">
                    {index === currentBreadcrumbs.length - 1 ? (
                      <span 
                        className="admin-layout__breadcrumb-current"
                        aria-current="page"
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <>
                        <button
                          className="admin-layout__breadcrumb-link"
                          onClick={() => navigate(crumb.href)}
                        >
                          {crumb.label}
                        </button>
                        <span className="admin-layout__breadcrumb-separator">
                          /
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Título y subtítulo */}
            <div className="admin-layout__title-section">
              <h1 className="admin-layout__title">{pageTitle}</h1>
              {subtitle && (
                <p className="admin-layout__subtitle">{subtitle}</p>
              )}
            </div>

            {/* Acciones del header */}
            <div className="admin-layout__header-actions">
              {headerActions}
              
              {/* Indicador de contadores */}
              {loadingCounts && (
                <div className="admin-layout__counts-loading">
                  <span className="admin-layout__loading-spinner"></span>
                  <span>Actualizando...</span>
                </div>
              )}
              
              {countsError && (
                <div className="admin-layout__counts-error">
                  <span>⚠️</span>
                  <span>Error en estadísticas</span>
                </div>
              )}

              {/* Info del usuario admin */}
              <div className="admin-layout__user-info">
                <div className="admin-layout__user-avatar">
                  👤
                </div>
                <div className="admin-layout__user-details">
                  <span className="admin-layout__user-name">
                    {user.username || user.email || 'Admin'}
                  </span>
                  <span className="admin-layout__user-role">
                    Administrador
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="admin-layout__logout-button"
                  title="Cerrar sesión"
                >
                  🚪
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* ===== ÁREA DE CONTENIDO ===== */}
        <main className="admin-layout__content">
          <div className="admin-layout__content-wrapper">
            {children}
          </div>
        </main>

        {/* ===== FOOTER OPCIONAL ===== */}
        <footer className="admin-layout__footer">
          <div className="admin-layout__footer-content">
            <p className="admin-layout__footer-text">
              StreamApp Admin Panel © 2024
            </p>
            <div className="admin-layout__footer-links">
              <button
                className="admin-layout__footer-link"
                onClick={() => navigate('/')}
              >
                Volver a la aplicación
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== OVERLAY PARA MÓVIL ===== */}
      {!isCollapsed && (
        <div 
          className="admin-layout__overlay"
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export { AdminLayout };