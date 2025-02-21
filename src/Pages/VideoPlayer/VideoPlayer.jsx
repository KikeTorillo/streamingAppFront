import React, { useState } from "react";

const VideoPlayer = () => {
  // Estado para almacenar la URL del video
  const [videoUrl, setVideoUrl] = useState(null);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para indicar si la solicitud está en progreso
  const [loading, setLoading] = useState(false);

  // Función para hacer la solicitud GET
  const fetchVideoUrl = async () => {
    setLoading(true); // Indicar que la solicitud está en progreso
    setError(null); // Limpiar errores previos

    try {
      // Simula una solicitud GET a un servicio
      const response = await fetch("http://192.168.0.177:3000/api/v1/videos/top", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Parsear la respuesta JSON
      const data = await response.json();

      // Supongamos que la respuesta tiene una propiedad `url` con la URL del video
      const { url } = data;

      if (!url) {
        throw new Error("La respuesta no contiene una URL válida");
      }

      // Actualizar el estado con la URL del video
      setVideoUrl(url);
    } catch (err) {
      // Manejar errores
      setError(err.message || "Ocurrió un error al obtener la URL del video");
    } finally {
      setLoading(false); // Finalizar la carga
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Botón para hacer la solicitud */}
      <button onClick={fetchVideoUrl} disabled={loading}>
        {loading ? "Cargando..." : "Obtener video"}
      </button>

      {/* Mostrar mensaje de error si ocurre uno */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Mostrar el video si la URL está disponible */}
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Reproduciendo video:</h3>
          <video controls width="640" height="360">
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      )}
    </div>
  );
};

export {VideoPlayer};