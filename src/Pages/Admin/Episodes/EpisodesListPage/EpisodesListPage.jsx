// ===== EPISODES LIST PAGE - HOMOLOGADO CON SERIES, CATEGORIES Y MOVIES =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import './EpisodesListPage.css';

// Servicios de episodios
import { getEpisodesService } from '../../../../services/Episodes/getEpisodesService';
import { deleteEpisodeService } from '../../../../services/Episodes/deleteEpisodeService';

/**
 * EpisodesListPage - Página de gestión de episodios COMPLETA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con servicios existentes
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que SeriesListPage, CategoriesListPage y MoviesListPage
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CRUD: Operaciones de Ver, Editar y Eliminar implementadas
 */
function EpisodesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ Formatear fechas (adaptado para episodios)
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
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  /**
   * ✅ Formatear temporada y episodio
   */
  const formatSeasonEpisode = (season, episodeNumber) => {
    if (!season && !episodeNumber) return 'Sin especificar';
    if (!season) return `Ep. ${episodeNumber}`;
    if (!episodeNumber) return `T${season}`;
    return `T${season}E${episodeNumber}`;
  };

  /**
   * ✅ Formatear nombre de serie
   */
  const formatSerieName = (serie) => {
    if (!serie) return 'Sin serie';
    return typeof serie === 'object' ? serie.title : serie;
  };

  /**
   * ✅ Formatear duración del episodio
   */
  const formatDuration = (duration) => {
    if (!duration) return 'Sin duración';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ===== CONFIGURACIÓN DE COLUMNAS =====
  
  /**
   * ✅ Columnas de la tabla - SIN columna de acciones personalizada (usa DataTable integrado)
   */
  const episodesColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ row }) => (
        <span className="episodes-list__id">
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'title',
      header: 'Título del Episodio',
      cell: ({ row }) => (
        <div className="episodes-list__title">
          <span className="episodes-list__title-text">
            {row.original.title}
          </span>
          <span className="episodes-list__title-badge">
            🎬 Episodio
          </span>
        </div>
      )
    },
    {
      accessorKey: 'serie',
      header: 'Serie',
      size: 180,
      cell: ({ row }) => (
        <span className="episodes-list__serie">
          {formatSerieName(row.original.serie)}
        </span>
      )
    },
    {
      accessorKey: 'seasonEpisode',
      header: 'T/E',
      size: 100,
      cell: ({ row }) => (
        <span className="episodes-list__season-episode">
          {formatSeasonEpisode(row.original.season, row.original.episodeNumber)}
        </span>
      )
    },
    {
      accessorKey: 'duration',
      header: 'Duración',
      size: 100,
      cell: ({ row }) => (
        <span className="episodes-list__duration">
          {formatDuration(row.original.duration)}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      size: 180,
      cell: ({ row }) => (
        <span className="episodes-list__date">
          {formatDate(row.original.createdAt)}
        </span>
      )
    }
  ];

  // ===== EFECTOS =====
  
  /**
   * ✅ Cargar episodios al montar el componente
   */
  useEffect(() => {
    loadEpisodes();
  }, []);

  // ===== FUNCIONES DE CARGA =====
  
  /**
   * ✅ Cargar episodios desde el backend
   */
  const loadEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎬 Cargando lista de episodios...');
      const response = await getEpisodesService();
      
      // Verificar formato de respuesta
      const episodesData = Array.isArray(response) ? response : response.data || [];
      
      console.log(`✅ Episodios cargados: ${episodesData.length} elementos`);
      setEpisodes(episodesData);
      
    } catch (error) {
      console.error('❌ Error al cargar episodios:', error);
      
      // Manejo específico de errores
      if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Opcional: redirigir al login
        // navigate('/login');
      } else {
        setError('Error al cargar la lista de episodios. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE ACCIÓN =====
  
  /**
   * ✅ Manejar navegación a crear episodio
   */
  const handleCreateEpisode = () => {
    navigate('/admin/episodes/create');
  };

  /**
   * ✅ Manejar navegación a editar episodio
   */
  const handleEditEpisode = (episode) => {
    navigate(`/admin/episodes/edit/${episode.id}`);
  };

  /**
   * ✅ Manejar ver detalles del episodio
   */
  const handleViewEpisode = (episode) => {
    // Por ahora, navegar a edición - luego se puede crear una página de detalles
    navigate(`/admin/episodes/view/${episode.id}`);
  };

  /**
   * ✅ Manejar eliminación de episodio
   */
  const handleDeleteEpisode = async (episode) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el episodio "${episode.title}"?`)) {
      return;
    }

    try {
      setDeleting(episode.id);
      
      console.log(`🗑️ Eliminando episodio ID: ${episode.id}`);
      await deleteEpisodeService(episode.id);
      
      // Recargar la lista después de eliminar
      await loadEpisodes();
      
      console.log('✅ Episodio eliminado exitosamente');
      
    } catch (error) {
      console.error('❌ Error al eliminar episodio:', error);
      
      if (error.response?.status === 404) {
        alert('El episodio ya no existe.');
        // Recargar lista para sincronizar
        loadEpisodes();
      } else if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // navigate('/login');
      } else {
        alert('Error al eliminar el episodio. Inténtalo nuevamente.');
      }
    } finally {
      setDeleting(null);
    }
  };

  // ===== CONFIGURACIÓN DEL LAYOUT =====
  
  /**
   * ✅ Breadcrumbs para episodios
   */
  const breadcrumbs = [
    { label: 'Inicio', href: '/admin' },
    { label: 'Episodios', href: '/admin/episodes' }
  ];

  /**
   * ✅ Acciones del header
   */
  const headerActions = (
    <Button
      variant="primary"
      size="md"
      onClick={handleCreateEpisode}
      disabled={loading}
    >
      + Crear Episodio
    </Button>
  );

  /**
   * ✅ Estadísticas específicas para episodios
   */
  const calculateEpisodeStats = () => {
    if (!episodes.length) {
      return {
        total: 0,
        newEpisodes: 0,
        withSeries: 0,
        withoutSeries: 0
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newEpisodes = episodes.filter(episode => {
      if (!episode.createdAt) return false;
      const createdDate = new Date(episode.createdAt);
      return createdDate >= sevenDaysAgo;
    }).length;

    const withSeries = episodes.filter(episode => episode.serie && episode.serie.id).length;
    const withoutSeries = episodes.length - withSeries;

    return {
      total: episodes.length,
      newEpisodes,
      withSeries,
      withoutSeries
    };
  };

  const stats = calculateEpisodeStats();

  // ===== CONFIGURACIÓN DE DATATABLES =====
  
  /**
   * ✅ Props para DataTable - Homologado con SeriesListPage
   */
  const dataTableProps = {
    data: episodes,
    columns: episodesColumns,
    loading,
    error,
    // Configuración de búsqueda
    searchable: true,
    searchPlaceholder: "Buscar episodios por título...",
    // Configuración de paginación
    pageSize: 10,
    // Configuraciones de acciones
    actions: {
      view: {
        enabled: true,
        handler: handleViewEpisode,
        label: "Ver episodio",
        icon: "👁️"
      },
      edit: {
        enabled: true,
        handler: handleEditEpisode,
        label: "Editar episodio",
        icon: "✏️"
      },
      delete: {
        enabled: true,
        handler: handleDeleteEpisode,
        label: "Eliminar episodio",
        icon: "🗑️",
        confirmMessage: (episode) => `¿Eliminar "${episode.title}"?`,
        loading: (episode) => deleting === episode.id
      }
    },
    // Configuración de estados vacíos
    emptyState: {
      title: "No hay episodios",
      description: "Aún no se han agregado episodios al sistema.",
      action: {
        label: "Crear primer episodio",
        handler: handleCreateEpisode
      }
    },
    // Estadísticas personalizadas
    stats: [
      {
        label: "Total de episodios",
        value: stats.total,
        icon: "🎬"
      },
      {
        label: "Episodios nuevos (7 días)",
        value: stats.newEpisodes,
        icon: "⭐"
      },
      {
        label: "Con serie asignada",
        value: stats.withSeries,
        icon: "✅"
      },
      {
        label: "Sin serie asignada",
        value: stats.withoutSeries,
        icon: "⚠️"
      }
    ]
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Episodios"
      subtitle="Administra todos los episodios del sistema"
      breadcrumbs={breadcrumbs}
      headerActions={headerActions}
      className="episodes-list-page"
    >
      <div className="episodes-list-page__content">
        <DataTable {...dataTableProps} />
      </div>
    </AdminLayout>
  );
}

export { EpisodesListPage };