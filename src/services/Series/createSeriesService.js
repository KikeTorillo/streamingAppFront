// src/services/Series/createSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";
import { processCoverImage, isValidFile } from "../../utils/imageUtils";

/**
 * Crear nueva serie - VERSIÓN MEJORADA
 * Acepta tanto archivos File como URLs para la portada
 * 
 * @param {Object} seriesData - Datos de la serie
 * @param {string} seriesData.title - Título de la serie
 * @param {number} seriesData.categoryId - ID de categoría
 * @param {number} seriesData.releaseYear - Año de lanzamiento
 * @param {string} seriesData.description - Descripción/sinopsis
 * @param {File|string} seriesData.coverImage - Imagen de portada (File o URL)
 * @returns {Promise<Object>} - Respuesta del servidor
 */
const createSeriesService = async (seriesData) => {
  const { urlBackend } = environmentService();
  
  try {
    // Validaciones básicas
    if (!seriesData.title?.trim()) {
      throw new Error('El título es requerido');
    }
    
    if (!seriesData.coverImage) {
      throw new Error('La imagen de portada es requerida');
    }
    
    // Procesar la imagen de portada (URL → File si es necesario)
    console.log('📺 Procesando imagen de portada para serie...');
    const processedCoverImage = await processCoverImage(seriesData.coverImage, 'series-cover');
    
    // Crear FormData
    const formData = new FormData();
    formData.append("title", seriesData.title.trim());
    formData.append("categoryId", seriesData.categoryId);
    formData.append("releaseYear", seriesData.releaseYear);
    formData.append("description", seriesData.description || "");
    formData.append("coverImage", processedCoverImage); // ← Siempre es File aquí
    
    console.log('📤 Enviando datos de serie al backend...');
    console.log('- Título:', seriesData.title);
    console.log('- Año:', seriesData.releaseYear);
    console.log('- Portada:', processedCoverImage.name, `(${Math.round(processedCoverImage.size / 1024)}KB)`);
    
    // Realizar petición al backend
    const response = await axios.post(`${urlBackend}/api/v1/series`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
      withCredentials: true,
      timeout: 2 * 60 * 1000, // 2 minutos para imágenes
    });
    
    console.log('✅ Serie creada exitosamente');
    return response.data;
    
  } catch (error) {
    console.error("❌ Error al crear serie:", error);
    
    // Mejorar mensajes de error para el usuario
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de red al descargar la imagen de TMDB');
    }
    
    if (error.response?.status === 413) {
      throw new Error('La imagen es demasiado grande');
    }
    
    if (error.response?.status === 409) {
      throw new Error('Esta serie ya existe en el sistema');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('La subida tardó demasiado tiempo. Inténtalo de nuevo');
    }
    
    // Si es un error que ya lanzamos nosotros, mantenerlo
    if (error.message.includes('coverImage debe ser') || 
        error.message.includes('requerido') ||
        error.message.includes('descargar la imagen')) {
      throw error;
    }
    
    // Error genérico del backend
    throw new Error(error.response?.data?.message || 'Error al crear la serie');
  }
};

export { createSeriesService };