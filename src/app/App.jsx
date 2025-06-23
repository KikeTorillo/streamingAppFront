// App.jsx - Actualizado con rutas del panel de administración
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";

// Páginas existentes
import { Login } from "../Pages/Login/Login";
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer";
import { MainPage } from "../Pages/MainPage/MainPage";

// ===== PÁGINAS DEL ADMIN PANEL =====
import { AdminDashboard } from "../Pages/AdminDashboard/AdminDashboard";
import { UsersListPage } from "../Pages/Admin/Users/UsersListPage/UsersListPage";
import { UserCreatePage } from "../Pages/Admin/Users/UserCreatePage/UserCreatePage";
import { UserEditPage } from "../Pages/Admin/Users/UserEditPage/UserEditPage";
import { CategoryCreatePage } from "../Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage";
import { CategoriesListPage } from "../Pages/Admin/Categories/CategoriesListPage/CategoriesListPage";

import "./App.css";

/**
 * Componente de protección de rutas admin
 */
function AdminRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
  const isAdmin = user?.roleId === 1 || user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'var(--font-family-base)'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>🔒</div>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}>
          Acceso Restringido
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          Necesitas permisos de administrador para acceder a esta área.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Ir al Login
        </button>
      </div>
    );
  }

  return children;
}

// Definición de las rutas de la aplicación
function AppRoutes() {
  const routes = useRoutes([
    // ===== RUTAS PÚBLICAS =====
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/main-page", element: <MainPage /> },
    { path: "/video-player/:id", element: <VideoPlayer /> },

    // ===== RUTAS DEL ADMIN PANEL =====
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE USUARIOS =====
    {
      path: "/admin/users",
      element: (
        <AdminRoute>
          <UsersListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/users/create",
      element: (
        <AdminRoute>
          <UserCreatePage />
        </AdminRoute>
      )
    },
    {
      path: '/admin/users/:id/edit',
      element: (
        <AdminRoute><UserEditPage /></AdminRoute>
      )
    },

    // ===== GESTIÓN DE PELÍCULAS (FUTURAS) =====
    {
      path: "/admin/movies",
      element: (
        <AdminRoute>
          {/* TODO: Crear MoviesListPage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Gestión de Películas</h2>
            <p>Esta funcionalidad estará disponible pronto...</p>
            <button
              onClick={() => window.location.href = '/admin'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver al Dashboard
            </button>
          </div>
        </AdminRoute>
      )
    },
    {
      path: "/admin/movies/create",
      element: (
        <AdminRoute>
          {/* TODO: Crear MovieCreatePage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Crear Película</h2>
            <p>Funcionalidad en desarrollo...</p>
            <button
              onClick={() => window.location.href = '/admin/movies'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver
            </button>
          </div>
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE SERIES (FUTURAS) =====
    {
      path: "/admin/series",
      element: (
        <AdminRoute>
          {/* TODO: Crear SeriesListPage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Gestión de Series</h2>
            <p>Esta funcionalidad estará disponible pronto...</p>
            <button
              onClick={() => window.location.href = '/admin'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver al Dashboard
            </button>
          </div>
        </AdminRoute>
      )
    },
    {
      path: "/admin/series/create",
      element: (
        <AdminRoute>
          {/* TODO: Crear SeriesCreatePage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Crear Serie</h2>
            <p>Funcionalidad en desarrollo...</p>
            <button
              onClick={() => window.location.href = '/admin/series'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver
            </button>
          </div>
        </AdminRoute>
      )
    },
    {
      path: '/admin/categories',
      element: (
        <AdminRoute><CategoriesListPage /></AdminRoute>
      )
    },
    {
      path: '/admin/categories/create',
      element: (
        <CategoryCreatePage />
      )
    },
    // ===== GESTIÓN DE EPISODIOS (FUTURAS) =====
    {
      path: "/admin/episodes",
      element: (
        <AdminRoute>
          {/* TODO: Crear EpisodesListPage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Gestión de Episodios</h2>
            <p>Esta funcionalidad estará disponible pronto...</p>
            <button
              onClick={() => window.location.href = '/admin'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver al Dashboard
            </button>
          </div>
        </AdminRoute>
      )
    },
    {
      path: "/admin/episodes/create",
      element: (
        <AdminRoute>
          {/* TODO: Crear EpisodeCreatePage */}
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h2>Crear Episodio</h2>
            <p>Funcionalidad en desarrollo...</p>
            <button
              onClick={() => window.location.href = '/admin/episodes'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver
            </button>
          </div>
        </AdminRoute>
      )
    },

    // ===== RUTA 404 =====
    {
      path: "/*",
      element: (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-family-base)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            404 - Página no encontrada
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}>
            La página que buscas no existe o ha sido movida.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => window.location.href = '/admin'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Panel Admin
            </button>
          </div>
        </div>
      )
    },
  ]);

  return routes;
}

// Componente principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;