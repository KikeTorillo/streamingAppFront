import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css"; // Archivo CSS para estilos

function MainPage() {
  const navigate = useNavigate();

  // Lista de películas simuladas (puedes reemplazar esto con datos reales)
  const movies = [
    {
      id: 1,
      title: "Película 1",
      thumbnail: "https://via.placeholder.com/300x150",
    },
    {
      id: 2,
      title: "Película 2",
      thumbnail: "https://via.placeholder.com/300x150",
    },
    {
      id: 3,
      title: "Película 3",
      thumbnail: "https://via.placeholder.com/300x150",
    },
    {
      id: 4,
      title: "Película 4",
      thumbnail: "https://via.placeholder.com/300x150",
    },
  ];

  // Función para navegar al reproductor de video
  const handleMovieClick = (movieId) => {
    navigate(`/video-player/${movieId}`);
  };

  return (
    <div className="main-page-container">
      {/* Encabezado */}
      <header className="main-header">
        <div className="logo">MiNetflix</div>
        <nav className="main-nav">
          <button onClick={() => navigate("/upload-video")}>Subir Video</button>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <h1>Selecciona una película</h1>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img src={movie.thumbnail} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Pie de página */}
      <footer className="main-footer">
        <p>&copy; 2023 MiNetflix. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export { MainPage };
