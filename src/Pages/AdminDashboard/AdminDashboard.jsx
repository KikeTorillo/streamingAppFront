// ===== ADMIN DASHBOARD PAGE =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/templates/AdminLayout/AdminLayout';
import { StatsCard } from '../../components/molecules/StatsCard/StatsCard';
import { DataTable } from '../../components/organism/DataTable/DataTable';
import { Button } from '../../components/atoms/Button/Button';
import './AdminDashboard.css';

// Importar servicios para datos reales (SIN episodios)
import { getUsersService } from '../../services/Users/getUsersService';
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { getSeriesService } from '../../services/Series/getSeriesService';
import { getCategoriesService } from '../../services/Categories/getCategoriesService';
// ❌ ELIMINADO: import { getEpisodesService } from '../../services/Episodes/getEpisodesService';

/**
 * AdminDashboard - Página principal del panel de administración
 * 
 * Características implementadas:
 * - ✅ AdminLayout como contenedor base
 * - ✅ Grid de StatsCard con métricas principales
 * - ✅ Tabla de actividad reciente con DataTable
 * - ✅ Acciones rápidas para administradores
 * - ✅ Datos en tiempo real desde servicios (SIN episodios)
 * - ✅ Estados de loading y error
 * - ✅ Responsive design
 * - ✅ Navegación a páginas específicas
 */
function AdminDashboard() {
  const navigate = useNavigate();

  // ===== ESTADOS (SIN EPISODIOS) =====
  const [stats, setStats] = useState({
    users: { count: 0, change: 0 },
    movies: { count: 0, change: 0 },
    series: { count: 0, change: 0 },
    categories: { count: 0, change: 0 }
    // ❌ ELIMINADO: episodes: { count: 0, change: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== EFECTOS =====
  
  /**
   * Cargar estadísticas desde servicios (SIN episodios)
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ejecutar llamadas en paralelo (SIN episodios)
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse
          // ❌ ELIMINADO: episodesResponse
        ] = await Promise.allSettled([
          getUsersService(),
          getMoviesService(),
          getSeriesService(),
          getCategoriesService()
          // ❌ ELIMINADO: getEpisodesService()
        ]);

        // Procesar respuestas y extraer contadores (SIN episodios)
        const newStats = {
          users: {
            count: getArrayLength(usersResponse),
            change: Math.floor(Math.random() * 20) - 5 // Simulado por ahora
          },
          movies: {
            count: getArrayLength(moviesResponse),
            change: Math.floor(Math.random() * 15) - 3
          },
          series: {
            count: getArrayLength(seriesResponse),
            change: Math.floor(Math.random() * 10) - 2
          },
          categories: {
            count: getArrayLength(categoriesResponse),
            change: Math.floor(Math.random() * 5) - 1
          }
          // ❌ ELIMINADO: episodes: { count: getArrayLength(episodesResponse), change: Math.floor(Math.random() * 25) - 8 }
        };

        setStats(newStats);

        // Generar actividad reciente simulada (SIN episodios)
        const mockActivity = generateMockActivity();
        setRecentActivity(mockActivity);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Extraer longitud de arrays de respuestas de Promise.allSettled
   */
  const getArrayLength = (promiseResult) => {
    if (promiseResult.status === 'fulfilled' && Array.isArray(promiseResult.value)) {
      return promiseResult.value.length;
    }
    if (promiseResult.status === 'fulfilled' && promiseResult.value?.data && Array.isArray(promiseResult.value.data)) {
      return promiseResult.value.data.length;
    }
    return 0;
  };

  /**
   * Generar actividad reciente simulada (SIN episodios)
   */
  const generateMockActivity = () => {
    const types = ['user', 'movie', 'series', 'category']; // ❌ ELIMINADO: 'episode'
    const actions = ['Creado', 'Actualizado', 'Eliminado'];
    const statuses = ['success', 'info', 'warning'];
    
    return Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      type: types[Math.floor(Math.random() * types.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      details: `Elemento ${index + 1} modificado por administrador`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };

  /**
   * Formatear timestamp para mostrar
   */
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // ===== CONFIGURACIÓN DE ESTADÍSTICAS (SIN EPISODIOS) =====
  const statsCards = [
    {
      title: 'Usuarios',
      value: stats.users.count,
      icon: '👥',
      change: `${stats.users.change > 0 ? '+' : ''}${stats.users.change}%`,
      changeLabel: 'último mes',
      color: 'blue',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Películas',
      value: stats.movies.count,
      icon: '🎬',
      change: `${stats.movies.change > 0 ? '+' : ''}${stats.movies.change}%`,
      changeLabel: 'esta semana',
      color: 'green',
      onClick: () => navigate('/admin/movies')
    },
    {
      title: 'Series',
      value: stats.series.count,
      icon: '📺',
      change: `${stats.series.change > 0 ? '+' : ''}${stats.series.change}%`,
      changeLabel: 'último mes',
      color: 'purple',
      onClick: () => navigate('/admin/series')
    },
    {
      title: 'Categorías',
      value: stats.categories.count,
      icon: '📂',
      change: `${stats.categories.change > 0 ? '+' : ''}${stats.categories.change}%`,
      changeLabel: 'este año',
      color: 'yellow',
      onClick: () => navigate('/admin/categories')
    }
    // ❌ ELIMINADO: Card de episodios
  ];

  // ===== CONFIGURACIÓN DE TABLA DE ACTIVIDAD =====
  const activityColumns = [
    {
      accessorKey: 'type',
      header: 'Tipo',
      size: 100,
      cell: ({ getValue }) => {
        const type = getValue();
        const icons = {
          user: '👤',
          movie: '🎬',
          series: '📺',
          category: '📂'
          // ❌ ELIMINADO: episode: '🎞️'
        };
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{icons[type] || '📄'}</span>
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </span>
        );
      }
    },
    {
      accessorKey: 'action',
      header: 'Acción',
      cell: ({ getValue }) => (
        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'details',
      header: 'Detalles',
      cell: ({ getValue }) => (
        <span style={{ color: 'var(--text-secondary)' }}>
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'timestamp',
      header: 'Cuándo',
      size: 120,
      cell: ({ getValue }) => (
        <span style={{ 
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)'
        }}>
          {formatTimestamp(getValue())}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        const variants = {
          success: 'success',
          info: 'info',
          warning: 'warning',
          error: 'danger'
        };
        return (
          <span className={`data-table__badge data-table__badge--${variants[status] || 'info'}`}>
            {status}
          </span>
        );
      }
    }
  ];

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Visión general de tu plataforma de streaming"
      headerActions={
        <Button
          variant="primary"
          onClick={() => navigate('/admin/settings')}
          leftIcon="⚙️"
        >
          Configuración
        </Button>
      }
    >
      <div className="admin-dashboard">
        
        {/* ===== ESTADO DE ERROR ===== */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error en el Dashboard</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ===== ESTADÍSTICAS PRINCIPALES ===== */}
        <section className="admin-dashboard__stats">
          <h2 className="admin-dashboard__section-title">
            📊 Estadísticas Generales
          </h2>
          
          {loading ? (
            <div className="admin-dashboard__stats-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="stats-card--loading">
                  <div className="stats-card__skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__stats-grid">
              {statsCards.map((card, index) => (
                <StatsCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  change={card.change}
                  changeLabel={card.changeLabel}
                  color={card.color}
                  onClick={card.onClick}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        <section className="admin-dashboard__quick-actions">
          <h2 className="admin-dashboard__section-title">
            ⚡ Acciones Rápidas
          </h2>
          
          <div className="admin-dashboard__actions-grid">
            <Button
              variant="outline"
              size="lg"
              leftIcon="👥"
              onClick={() => navigate('/admin/users/create')}
              className="admin-dashboard__action-button"
            >
              Crear Usuario
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="🎬"
              onClick={() => navigate('/admin/movies/create')}
              className="admin-dashboard__action-button"
            >
              Agregar Película
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="📺"
              onClick={() => navigate('/admin/series/create')}
              className="admin-dashboard__action-button"
            >
              Crear Serie
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              leftIcon="📂"
              onClick={() => navigate('/admin/categories/create')}
              className="admin-dashboard__action-button"
            >
              Nueva Categoría
            </Button>
          </div>
        </section>

        {/* ===== ACTIVIDAD RECIENTE ===== */}
        <section className="admin-dashboard__activity">
          <div className="admin-dashboard__activity-header">
            <h2 className="admin-dashboard__section-title">
              📈 Actividad Reciente
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/activity')}
            >
              Ver todo →
            </Button>
          </div>
          
          {loading ? (
            <div className="data-table--loading">
              <div className="data-table__skeleton"></div>
            </div>
          ) : (
            <DataTable
              data={recentActivity}
              columns={activityColumns}
              searchable={false}
              pagination={{
                pageSize: 5,
                showSizeSelector: false
              }}
              emptyMessage="No hay actividad reciente"
              loading={loading}
            />
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export { AdminDashboard };