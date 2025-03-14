import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UploadEpisode = () => {
  const { seriesId } = useParams(); // Se asume que la ruta incluye el id de la serie
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [season, setSeason] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleUploadEpisode = async () => {
    if (!episodeTitle || !season || !episodeNumber || !videoFile) {
      setMessage("Por favor completa todos los campos obligatorios.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("episodeTitle", episodeTitle);
      formData.append("season", season);
      formData.append("episodeNumber", episodeNumber);
      formData.append("video", videoFile);
      // Se envía el id de la serie para asociar el episodio
      formData.append("seriesId", seriesId);

      // Se asume que este endpoint gestiona la subida de episodios para una serie
      await axios.post(
        `http://192.168.0.177:3000/api/v1/videos/series/${seriesId}/episodes`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("Episodio subido exitosamente.");
      // Aquí podrías limpiar los campos o redirigir según necesites.
    } catch (error) {
      console.error(error);
      setMessage("Error al subir el episodio.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Subir Episodio</h1>
      <div>
        <label>Título del Episodio:</label>
        <input
          type="text"
          value={episodeTitle}
          onChange={(e) => setEpisodeTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Temporada:</label>
        <input
          type="number"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />
      </div>
      <div>
        <label>Número de Episodio:</label>
        <input
          type="number"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Archivo del Episodio:</label>
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>
      <button onClick={handleUploadEpisode} disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir Episodio"}
      </button>
      {message && <div>{message}</div>}
    </div>
  );
};

export {UploadEpisode};
