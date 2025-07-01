// App.jsx - Actualizado con rutas completas del panel de administración
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";

// Páginas existentes
import { Login } from "../Pages/Login/Login";
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer";
import { MainPage } from "../Pages/MainPage/MainPage";

// ===== PÁGINAS DEL ADMIN PANEL =====
import { AdminDashboard } from "../Pages/AdminDashboard/AdminDashboard";

// Users
import { UsersListPage } from "../Pages/Admin/Users/UsersListPage/UsersListPage";
import { UserCreatePage } from "../Pages/Admin/Users/UserCreatePage/UserCreatePage";
import { UserEditPage } from "../Pages/Admin/Users/UserEditPage/UserEditPage";

// Categories
import { CategoryCreatePage } from "../Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage";
import { CategoriesListPage } from "../Pages/Admin/Categories/CategoriesListPage/CategoriesListPage";

// ===== NUEVAS RUTAS DE MOVIES =====
import { MoviesListPage } from "../Pages/Admin/Movies/MoviesListPage/MoviesListPage";
import { MovieCreatePage } from "../Pages/Admin/Movies/MovieCreatePage/MovieCreatePage";
// import { MovieEditPage } from "../Pages/Admin/Movies/MovieEditPage/MovieEditPage"; // Para futuro

//import { SeriesListPage } from '../Pages/Admin/Series/SeriesListPage/SeriesListPage';
import { SeriesCreatePage } from '../Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage';

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
            cursor: 'pointer'
          }}
        >
          Ir a Login
        </button>
      </div>
    );
  }

  return children;
}

/**
 * Configuración de rutas principales
 */
function AppRoutes() {
  const routes = useRoutes([
    // ===== RUTAS PÚBLICAS =====
    {
      path: "/main-page",
      element: <MainPage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/player/:movieId",
      element: <VideoPlayer />
    },

    // ===== RUTAS ADMIN PROTEGIDAS =====
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
      path: "/admin/users/edit/:id",
      element: (
        <AdminRoute>
          <UserEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE CATEGORÍAS =====
    {
      path: "/admin/categories",
      element: (
        <AdminRoute>
          <CategoriesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/categories/create",
      element: (
        <AdminRoute>
          <CategoryCreatePage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE PELÍCULAS Y SERIES =====
    {
      path: "/admin/movies",
      element: (
        <AdminRoute>
          <MoviesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/movies/create",
      element: (
        <AdminRoute>
          <MovieCreatePage />
        </AdminRoute>
      )
    },
    // {
    //   path: "/admin/movies/edit/:id",
    //   element: (
    //     <AdminRoute>
    //       <MovieEditPage />
    //     </AdminRoute>
    //   )
    // },
    //{
    //  path: "/admin/series",
    //  element: <AdminRoute><SeriesListPage /></AdminRoute>
    //},
    {
      path: "/admin/series/create",
      element: <AdminRoute><SeriesCreatePage /></AdminRoute>
    },

    // ===== RUTA DE FALLBACK =====
    {
      path: "*",
      element: (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1>404 - Página no encontrada</h1>
          <p>La página que buscas no existe.</p>
          <button
            onClick={() => window.location.href = '/main-page'}
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            Volver al Inicio
          </button>
        </div>
      )
    }
  ]);

  return routes;
}

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;