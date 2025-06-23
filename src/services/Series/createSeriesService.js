// src/services/Series/createSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Crear nueva serie
 * @param {Object} seriesData - Datos de la serie
 * @param {string} seriesData.title - Título de la serie
 * @param {number} seriesData.categoryId - ID de categoría
 * @param {number} seriesData.releaseYear - Año de lanzamiento
 * @param {string} seriesData.description - Descripción/sinopsis
 * @param {File} seriesData.coverImage - Imagen de portada
 */
const createSeriesService = async (seriesData) => {
    const { urlBackend } = environmentService();
    
    const formData = new FormData();
    formData.append("title", seriesData.title);
    formData.append("categoryId", seriesData.categoryId);
    formData.append("releaseYear", seriesData.releaseYear);
    formData.append("description", seriesData.description || "");
    formData.append("coverImage", seriesData.coverImage);

    try {
        const response = await axios.post(`${urlBackend}/api/v1/series`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear serie:", error);
        throw error;
    }
};

export { createSeriesService };