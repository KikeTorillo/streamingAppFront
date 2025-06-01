import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Servicio para subir películas.
 * @param {Object} movieData - Datos de la película a subir.
 * @param {string} movieData.videoName - Nombre del video.
 * @param {string} movieData.category - Categoría seleccionada.
 * @param {string} movieData.releaseYear - Año de lanzamiento.
 * @param {File} movieData.selectedFile - Archivo del video.
 * @param {File} movieData.coverImage - Imagen de portada.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
const createMovieService = async (videoName, category, releaseYear, selectedFile, coverImage) => {
  const { urlBackend } = environmentService();

  const formData = new FormData();
  formData.append("name", videoName);
  formData.append("category", category);
  formData.append("releaseYear", releaseYear);
  formData.append("video", selectedFile);
  formData.append("coverImage", coverImage);

  try {
    const response = await axios.post(
      `${urlBackend}/api/v1/movies/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al subir la película:", error);
    throw error;
  }
};

export { createMovieService };
