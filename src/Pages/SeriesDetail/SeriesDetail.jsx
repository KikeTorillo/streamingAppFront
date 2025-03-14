// SeriesDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import "./SeriesDetail.css"; // Archivo CSS para estilos específicos

function SeriesDetail() {
  const { id } = useParams();
  const [seasons, setSeasons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ajusta la URL de acuerdo a tu API que retorna las temporadas y episodios de la serie
    fetch(`http://192.168.0.177:3000/api/v1/videos/series/${id}/seasons`)
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch((err) => console.error("Error fetching series details:", err));
  }, [id]);

  return (
    <div className="series-detail-container">
      <header className="series-detail-header">
        <button onClick={() => navigate(-1)}>Volver</button>
        <h1>Detalles de la Serie</h1>
      </header>
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="season">
            <h2>Temporada {season.season_number}</h2>
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.id}>
                  {episode.title}
                  {/* Puedes agregar aquí un botón o enlace para reproducir el episodio */}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Cargando detalles de la serie...</p>
      )}
    </div>
  );
}

export {SeriesDetail};
