// loginService.js

import { environmentService } from "../environmentService"; // Importa configuración de entorno

/**
 * Servicio para autenticación de usuarios
 * @param {string} userValue - Correo electrónico del usuario
 * @param {string} passValue - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta del servidor o error
 */
const loginService = async (userValue, passValue) => {
    // 1. Obtener configuración del entorno
    const { urlBackend, apiKey } = environmentService();
    
    // 2. Configurar headers de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey); // API Key de autenticación
    myHeaders.append("Content-Type", "application/json"); // Tipo de contenido

    // 3. Crear cuerpo de la solicitud en formato JSON
    const raw = JSON.stringify({
        email: userValue,
        password: passValue
    });

    // 4. Configuración completa de la solicitud
    const requestOptions = {
        method: "POST", // Método HTTP
        headers: myHeaders,
        body: raw,
        redirect: "follow", // Permite seguimiento de redirecciones
        credentials: 'include' // Incluye cookies en la solicitud (para autenticación basada en sesiones)
    };

    try {
        // 5. Realizar solicitud al endpoint de login
        const response = await fetch(`${urlBackend}/api/v1/auth/login`, requestOptions);
        
        // 6. Convertir respuesta a JSON
        const data = await response.json();
        
        // 7. Retornar datos de la respuesta
        return data;
    } catch (error) {
        // 8. Capturar y retornar errores de red/servidor
        return error;
    }
}

export { loginService };