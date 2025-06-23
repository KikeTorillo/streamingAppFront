// src/services/Movies/createMovieService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Crear nueva película
 * @param {Object} movieData - Datos de la película
 * @param {string} movieData.title - Título de la película (era "name")
 * @param {number} movieData.categoryId - ID de categoría (era "category")
 * @param {number} movieData.releaseYear - Año de lanzamiento
 * @param {string} movieData.description - Descripción (NUEVO)
 * @param {File} movieData.video - Archivo de video
 * @param {File} movieData.coverImage - Imagen de portada
 */
const createMovieService = async (movieData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    formData.append("title", movieData.title); // Cambio: era "name"
    formData.append("categoryId", movieData.categoryId); // Cambio: era "category"
    formData.append("releaseYear", movieData.releaseYear);
    formData.append("description", movieData.description || "");
    formData.append("video", movieData.video);
    formData.append("coverImage", movieData.coverImage);

    try {
        const response = await axios.post(`${urlBackend}/api/v1/movies`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear película:", error);
        throw error;
    }
};

export { createMovieService };