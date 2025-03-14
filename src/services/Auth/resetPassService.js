// resetPassService.js

import { environmentService } from "../environmentService"; // Importa configuración de entorno

/**
 * Servicio para cambiar contraseña mediante token de recuperación
 * @param {string} token - Token de seguridad recibido por email
 * @param {string} newPasswordValue - Nueva contraseña del usuario
 * @returns {Promise<Object>} Respuesta del servidor o error
 */
const resetPassService = async (token, newPasswordValue) => {
    // 1. Obtener configuración del entorno
    const { urlBackend, apiKey } = environmentService();
    
    // 2. Configurar headers de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey); // API Key de autenticación
    myHeaders.append("Content-Type", "application/json"); // Tipo de contenido

    // 3. Crear cuerpo de la solicitud con token y nueva contraseña
    const raw = JSON.stringify({
        newPassword: newPasswordValue, // Contraseña nueva
        token: token // Token de verificación
    });

    // 4. Configuración completa de la solicitud
    const requestOptions = {
        method: "POST", // Método HTTP para actualización segura
        headers: myHeaders,
        body: raw,
        redirect: "follow" // Permite seguimiento de redirecciones
    };

    try {
        // 5. Realizar solicitud al endpoint de cambio de contraseña
        const response = await fetch(`${urlBackend}/api/v1/auth/change-password`, requestOptions);
        
        // 6. Convertir respuesta a JSON
        const data = await response.json();
        
        // 7. Retornar datos de la respuesta
        return data;
    } catch (error) {
        // 8. Capturar y reportar errores
        console.error('Error en servicio de reseteo:', error);
        throw error; // Propagar error para manejo externo
    }
}

export { resetPassService };
