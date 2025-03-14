// recoveryService.js

import { environmentService } from "../environmentService"; // Importa configuración de entorno

/**
 * Servicio para solicitar recuperación de contraseña
 * @param {string} emailValue - Correo electrónico asociado al usuario
 * @returns {Promise<Object>} Respuesta del servidor o error
 */
const recoveryService = async (emailValue) => {
    // 1. Obtener configuración del entorno
    const { urlBackend, apiKey } = environmentService();
    
    // 2. Configurar headers de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey); // API Key de autenticación
    myHeaders.append("Content-Type", "application/json"); // Tipo de contenido

    // 3. Crear cuerpo de la solicitud con el email
    const raw = JSON.stringify({
        email: emailValue
    });

    // 4. Configuración completa de la solicitud
    const requestOptions = {
        method: "POST", // Método HTTP para creación de recursos
        headers: myHeaders,
        body: raw,
        redirect: "follow" // Permite seguimiento de redirecciones
    };

    try {
        // 5. Realizar solicitud al endpoint de recuperación
        const response = await fetch(`${urlBackend}/api/v1/auth/recovery`, requestOptions);
        
        // 6. Convertir respuesta a JSON
        const data = await response.json();
        
        // 7. Retornar datos de la respuesta
        return data;
    } catch (error) {
        // 8. Capturar y reportar errores
        console.error('Error en servicio de recuperación:', error);
        throw error; // Propagar error para manejo externo
    }
}

export { recoveryService };


