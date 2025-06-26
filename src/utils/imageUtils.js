// src/utils/imageUtils.js

/**
 * Utilidades para manejo de imágenes
 * Funciones compartidas para convertir URLs a Files y validaciones
 */

/**
 * Convierte una URL de imagen a un objeto File
 * @param {string} imageUrl - URL de la imagen
 * @param {string} prefix - Prefijo para el nombre del archivo ('movie', 'series', etc.)
 * @returns {Promise<File>} - Archivo convertido
 */
export const urlToFile = async (imageUrl, prefix = 'cover') => {
  try {
    console.log('🌐 Descargando imagen desde:', imageUrl);
    
    const response = await fetch(imageUrl, {
      mode: 'cors', // Permitir CORS para TMDB
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error('La imagen descargada está vacía');
    }
    
    // Determinar el tipo de archivo correcto
    const contentType = response.headers.get('content-type') || blob.type || 'image/jpeg';
    
    // Validar que sea realmente una imagen
    if (!contentType.startsWith('image/')) {
      throw new Error('El archivo descargado no es una imagen válida');
    }
    
    // Ajustar la extensión basada en el content-type
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';
    else if (contentType.includes('svg')) extension = 'svg';
    
    // Crear nombre de archivo único basado en la URL
    const urlHash = btoa(imageUrl).slice(0, 10).replace(/[+/=]/g, '');
    const timestamp = Date.now().toString(36);
    const finalFilename = `${prefix}-${urlHash}-${timestamp}.${extension}`;
    
    const file = new File([blob], finalFilename, { type: contentType });
    
    console.log('✅ Imagen convertida exitosamente:', {
      name: file.name,
      size: `${Math.round(file.size / 1024)}KB`,
      type: file.type
    });
    
    return file;
    
  } catch (error) {
    console.error('❌ Error convirtiendo URL a File:', error);
    
    // Mejorar mensajes de error específicos
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar para descargar la imagen. Verifica tu conexión a internet.');
    }
    
    if (error.message.includes('HTTP 404')) {
      throw new Error('La imagen no existe en el servidor');
    }
    
    if (error.message.includes('HTTP 403')) {
      throw new Error('No tienes permisos para acceder a esta imagen');
    }
    
    if (error.message.includes('CORS')) {
      throw new Error('Error de permisos al descargar la imagen');
    }
    
    throw new Error(`Error al descargar imagen: ${error.message}`);
  }
};

/**
 * Validar si un valor es un archivo File válido
 * @param {any} value - Valor a validar
 * @returns {boolean} - True si es un File válido
 */
export const isValidFile = (value) => {
  return value instanceof File && value.size > 0;
};

/**
 * Validar si un valor es una URL válida de imagen
 * @param {any} value - Valor a validar
 * @returns {boolean} - True si es una URL válida
 */
export const isValidImageUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  
  try {
    const url = new URL(value);
    
    // Solo permitir HTTP y HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    
    // Verificar que sea una URL de imagen común
    const pathname = url.pathname.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    
    // Si tiene extensión de imagen, es válida
    if (imageExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    
    // Si es de TMDB, asumimos que es válida
    if (url.hostname.includes('tmdb.org')) {
      return true;
    }
    
    // Para otras URLs, ser más estricto
    return false;
    
  } catch {
    return false;
  }
};

/**
 * Validar si un archivo File es una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {boolean} - True si es una imagen válida
 */
export const isValidImageFile = (file) => {
  if (!isValidFile(file)) return false;
  
  // Verificar tipo MIME
  if (!file.type.startsWith('image/')) return false;
  
  // Verificar tamaño (máximo 10MB para imágenes)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return false;
  
  return true;
};

/**
 * Procesar imagen de portada (URL o File)
 * Función principal que maneja tanto URLs como archivos
 * 
 * @param {string|File} coverImage - URL de imagen o archivo File
 * @param {string} prefix - Prefijo para nombre de archivo si es URL
 * @returns {Promise<File>} - Archivo File procesado
 */
export const processCoverImage = async (coverImage, prefix = 'cover') => {
  // Si ya es un archivo válido, validarlo y retornarlo
  if (isValidFile(coverImage)) {
    console.log('📁 Procesando archivo File local...');
    
    if (!isValidImageFile(coverImage)) {
      throw new Error('El archivo seleccionado no es una imagen válida o es demasiado grande (máx. 10MB)');
    }
    
    console.log('✅ Archivo File válido:', {
      name: coverImage.name,
      size: `${Math.round(coverImage.size / 1024)}KB`,
      type: coverImage.type
    });
    
    return coverImage;
  }
  
  // Si es una URL válida, convertirla a File
  if (isValidImageUrl(coverImage)) {
    console.log('🌐 Procesando URL de imagen...');
    return await urlToFile(coverImage, prefix);
  }
  
  // Si no es ni File ni URL válida, lanzar error descriptivo
  if (typeof coverImage === 'string') {
    throw new Error('La URL de imagen no es válida. Debe ser una URL completa (https://...)');
  }
  
  throw new Error('La imagen de portada debe ser un archivo válido o una URL de imagen');
};

/**
 * Obtener información de una imagen (File o URL)
 * @param {string|File} image - Imagen a analizar
 * @returns {Object} - Información de la imagen
 */
export const getImageInfo = (image) => {
  if (isValidFile(image)) {
    return {
      type: 'file',
      name: image.name,
      size: image.size,
      sizeFormatted: `${Math.round(image.size / 1024)}KB`,
      mimeType: image.type,
      isValid: isValidImageFile(image)
    };
  }
  
  if (isValidImageUrl(image)) {
    try {
      const url = new URL(image);
      return {
        type: 'url',
        name: url.pathname.split('/').pop() || 'imagen',
        url: image,
        hostname: url.hostname,
        isValid: true,
        isTMDB: url.hostname.includes('tmdb.org')
      };
    } catch {
      return {
        type: 'url',
        name: 'URL inválida',
        url: image,
        isValid: false
      };
    }
  }
  
  return {
    type: 'unknown',
    isValid: false
  };
};

/**
 * Crear una URL de vista previa para una imagen
 * @param {string|File} image - Imagen para crear preview
 * @returns {Promise<string>} - URL de vista previa
 */
export const createImagePreview = async (image) => {
  if (isValidFile(image)) {
    return URL.createObjectURL(image);
  }
  
  if (isValidImageUrl(image)) {
    return image;
  }
  
  throw new Error('No se puede crear vista previa de esta imagen');
};

/**
 * Limpiar URLs de vista previa creadas con createImagePreview
 * @param {string} previewUrl - URL de vista previa a limpiar
 */
export const cleanupImagePreview = (previewUrl) => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl);
  }
};