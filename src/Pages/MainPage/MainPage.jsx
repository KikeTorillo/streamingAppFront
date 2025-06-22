import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Para el carrusel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MainPage.css"; // Archivo CSS para estilos

function MainPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const sliderRef = useRef(null);
  const sliderSeriesRef = useRef(null);

  useEffect(() => {
    // Obtener películas desde la ruta /movies
    fetch("http://192.168.0.177:3000/api/v1/movies",{ credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        const moviesWithThumb = data.map((movie) => ({
          ...movie,
          //cover: `http://192.168.0.177:8082/covers/${movie.file_hash}/cover.jpg`,
        }));
        setMovies(moviesWithThumb);
      })
      .catch((err) => console.error("Error fetching movies:", err));

    // Obtener series desde la ruta /series
    fetch("http://192.168.0.177:3000/api/v1/series",{ credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        const seriesWithThumb = data.map((serie) => ({
          ...serie,
          cover: `http://192.168.0.177:8082/covers/${serie.file_hash}/cover.jpg`,
        }));
        setSeries(seriesWithThumb);
      })
      .catch((err) => console.error("Error fetching series:", err));
  }, []);

  // Reinicia el slider de películas al cargar los datos
  useEffect(() => {
    if (movies.length > 0 && sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [movies]);

  // Reinicia el slider de series al cargar los datos
  useEffect(() => {
    if (series.length > 0 && sliderSeriesRef.current) {
      sliderSeriesRef.current.slickGoTo(0);
    }
  }, [series]);

  // Handler para películas: redirige al reproductor
  const handleMovieClick = (movie) => {
    const { file_hash, available_resolutions } = movie;
    navigate(`/video-player/${file_hash}?resolutions=${available_resolutions}`);
  };

  // Handler para series: redirige a la pantalla de detalles (temporadas y episodios)
  const handleSeriesClick = (serie) => {
    navigate(`/series/${serie.id}`);
  };

  // Configuración del carrusel con react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="main-page-container">
      {/* Contenido principal */}
      <main className="main-content">
        <section>
          <h1 className="section-title">Películas</h1>
          <div className="carousel-container">
            {movies.length > 0 ? (
              <Slider {...sliderSettings} ref={sliderRef}>
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="card-overlay">
                      <img src={movie.cover} alt={movie.title} />
                      <div className="info-overlay">
                        <p className="movie-title">{movie.title}</p>
                        <p className="movie-extra">Rating: ★★★★☆</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="loading-text">Cargando...</p>
            )}
          </div>
        </section>

        <section>
          <h1 className="section-title">Series</h1>
          <div className="carousel-container">
            {series.length > 0 ? (
              <Slider {...sliderSettings} ref={sliderSeriesRef}>
                {series.map((serie) => (
                  <div
                    key={serie.id}
                    className="movie-card"
                    onClick={() => handleSeriesClick(serie)}
                  >
                    <div className="card-overlay">
                      <img src={serie.cover} alt={serie.title} />
                      <div className="info-overlay">
                        <p className="movie-title">{serie.title}</p>
                        <p className="movie-extra">Rating: ★★★★☆</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="loading-text">Cargando...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export { MainPage };
