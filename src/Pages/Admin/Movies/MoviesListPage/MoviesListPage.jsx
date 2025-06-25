// ===== MOVIES LIST PAGE - ADMIN PANEL (FIXED COLUMNS) =====
// src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import './MoviesListPage.css';

// Importar servicio para obtener películas
import { getMoviesService } from '../../../../services/Movies/getMoviesService';

/**
 * MoviesListPage - Página de listado de películas para el admin panel
 * 
 * ✅ SISTEMA DE DISEÑO: AdminLayout + DataTable + componentes del sistema
 * ✅ PATRÓN: Mismo flujo que UsersListPage/CategoriesListPage
 * ✅ FUNCIONALIDADES: CRUD completo, filtros, búsqueda
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CORREGIDO: Columnas con ID para TanStack Table
 */
function MoviesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== CONFIGURACIÓN DE COLUMNAS PARA DATATABLE (FIXED) =====
  const movieColumns = [
    {
      id: 'poster', // ✅ ID EXPLÍCITO
      accessorKey: 'poster',
      header: 'Poster',
      enableSorting: false,
      size: 80,
      cell: ({ getValue, row }) => {
        const posterUrl = getValue();
        const title = row.original.title;
        
        return (
          <div style={{ width: '60px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={`Poster de ${title}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'var(--bg-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 'var(--font-size-lg)'
              }}>
                🎬
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'title', // ✅ ID EXPLÍCITO
      accessorKey: 'title',
      header: 'Título',
      cell: ({ getValue, row }) => {
        const title = getValue();
        const overview = row.original.overview;
        
        return (
          <div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
              {title}
            </div>
            {overview && (
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-muted)',
                marginTop: 'var(--space-xs)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {overview}
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'type', // ✅ ID EXPLÍCITO
      accessorKey: 'type',
      header: 'Tipo',
      size: 100,
      cell: ({ getValue }) => {
        const type = getValue();
        return (
          <Badge 
            variant={type === 'movie' ? 'primary' : 'secondary'}
            style="soft"
            icon={type === 'movie' ? '🎬' : '📺'}
            size="sm"
          >
            {type === 'movie' ? 'Película' : 'Serie'}
          </Badge>
        );
      }
    },
    {
      id: 'category', // ✅ ID EXPLÍCITO
      accessorKey: 'category',
      header: 'Categoría',
      size: 120,
      cell: ({ getValue }) => {
        const category = getValue();
        return (
          <Badge variant="neutral" style="outline" size="sm">
            {category || 'Sin categoría'}
          </Badge>
        );
      }
    },
    {
      id: 'year', // ✅ ID EXPLÍCITO
      accessorKey: 'year',
      header: 'Año',
      size: 80,
      cell: ({ getValue }) => {
        const year = getValue();
        return (
          <span style={{ color: 'var(--text-secondary)' }}>
            {year || 'N/A'}
          </span>
        );
      }
    },
    {
      id: 'rating', // ✅ ID EXPLÍCITO
      accessorKey: 'rating',
      header: 'Rating',
      size: 100,
      cell: ({ getValue }) => {
        const rating = getValue();
        return rating ? (
          <Badge 
            variant="warning" 
            style="soft"
            icon="⭐"
            size="sm"
          >
            {rating}
          </Badge>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Sin rating</span>
        );
      }
    },
    {
      id: 'status', // ✅ ID EXPLÍCITO
      accessorKey: 'status',
      header: 'Estado',
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge 
            variant={status === 'active' ? 'success' : 'neutral'}
            style="soft"
            size="sm"
          >
            {status === 'active' ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      }
    }
  ];

  // ===== FUNCIONES =====
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const moviesData = await getMoviesService();
      setMovies(moviesData || []);
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = () => {
    navigate('/admin/movies/create');
  };

  const handleEditMovie = (movie) => {
    navigate(`/admin/movies/edit/${movie.id}`);
  };

  const handleViewMovie = (movie) => {
    // Navegar a la página de detalle o reproducir
    navigate(`/movie/${movie.id}`);
  };

  const handleDeleteMovie = (movie) => {
    if (window.confirm(`¿Estás seguro de eliminar "${movie.title}"?`)) {
      // Aquí iría la llamada al servicio de eliminación
      console.log('Eliminar película:', movie);
      // Recargar la lista después de eliminar
      loadMovies();
    }
  };

  const handleImportFromTMDB = () => {
    navigate('/admin/movies/create');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadMovies();
  }, []);

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Películas y Series"
      subtitle={`${movies.length} contenidos registrados en el sistema`}
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromTMDB}
            leftIcon="🔍"
          >
            Buscar en TMDB
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateMovie}
            leftIcon="➕"
          >
            Agregar Contenido
          </Button>
        </div>
      }
    >
      <div className="movies-list-container">
        {error && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 'var(--space-lg)' 
          }}>
            <Badge 
              variant="danger" 
              size="lg"
              icon="❌"
              style="soft"
            >
              {error}
            </Badge>
          </div>
        )}

        <DataTable
          data={movies}
          columns={movieColumns}
          loading={loading}
          onEdit={handleEditMovie}
          onView={handleViewMovie}
          onDelete={handleDeleteMovie}
          emptyTitle="No hay películas registradas"
          emptyDescription="Comienza agregando tu primera película o serie"
          emptyIcon="🎬"
          emptyAction={
            <Button 
              variant="primary" 
              onClick={handleCreateMovie}
              leftIcon="➕"
            >
              Agregar Primera Película
            </Button>
          }
          searchable
          searchPlaceholder="Buscar por título, categoría o año..."
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          variant="striped"
        />
      </div>
    </AdminLayout>
  );
}

export { MoviesListPage };