// Importación de módulos y componentes necesarios
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom"; // Para manejo de rutas
import { Login } from "../Pages/Login/Login"; // Página de Login/Registro
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer"; // Reproductor de video
import "./App.css"; // Estilos globales de la aplicación

// Definición de las rutas de la aplicación usando useRoutes
function AppRoutes() {
  const routes = useRoutes([
    // Ruta raíz (('/') y '/login' muestran el mismo componente
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
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
        {/* Renderiza las rutas definidas en AppRoutes */}
        <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
