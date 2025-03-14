// Importación de módulos y componentes necesarios
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom"; // Para manejo de rutas
import { UserProvider } from "./context/UserContext"; // Contexto para gestión de usuario
import { LoginRegister } from "../Pages/LoginRegister/LoginRegister"; // Página de Login/Registro
import { ResetPass } from "../Pages/ResetPass/ResetPass"; // Página de restablecimiento de contraseña
import { UploadVideo } from "../Pages/UploadVideo/UploadVideo"; // Página para subir videos
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer"; // Reproductor de video
import { MainPage } from "../Pages/MainPage/MainPage"; // Página principal después del login
import { SeriesDetail } from "../Pages/SeriesDetail/SeriesDetail";
import { CreateSeries } from "../Pages/CreateSeries/CreateSeries";
import { UploadEpisode } from "../Pages/UploadEpisode/UploadEpisode";
import "./App.css"; // Estilos globales de la aplicación

// Definición de las rutas de la aplicación usando useRoutes
function AppRoutes() {
  const routes = useRoutes([
    // Ruta raíz (('/') y '/login' muestran el mismo componente
    { path: "/", element: <LoginRegister /> },
    { path: "/login", element: <LoginRegister /> },

    // Ruta para restablecer contraseña
    { path: "/resetpass", element: <ResetPass /> },

    // Ruta de la página principal (requiere autenticación)
    { path: "/main-page", element: <MainPage /> },

    
    { path:"/series/:id", element: <SeriesDetail /> },
    { path:"/create-series", element: <CreateSeries /> },
    { path:"/series/:seriesId/upload-episode", element: <UploadEpisode /> },

    // Rutas para subir videos y ver videos
    { path: "/upload-video", element: <UploadVideo /> },
    { path: "/video-player/:id", element: <VideoPlayer /> },

    // Ruta comodín para manejar rutas no definidas (404)
    // ¡Nota!: Actualmente muestra un string vacío, se recomienda agregar un componente de error
    { path: "/*", element: <div>404 - Página no encontrada</div> },
  ]);

  return routes;
}

// Componente principal de la aplicación
function App() {
  return (
    // BrowserRouter habilita el enrutamiento en la aplicación
    <BrowserRouter>
      {/* UserProvider provee el contexto de usuario a toda la app */}
      <UserProvider>
        {/* Renderiza las rutas definidas en AppRoutes */}
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
