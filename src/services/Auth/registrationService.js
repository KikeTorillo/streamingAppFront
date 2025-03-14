// registrationService.js

import { environmentService } from "../environmentService"; // Importa configuración de entorno

/**
 * Servicio para registro de nuevos usuarios
 * @param {string} userRegisterValue - Correo electrónico del usuario a registrar
 * @param {string} passRegisterValue - Contraseña del usuario a registrar
 * @returns {Promise<Object>} Respuesta del servidor o error
 */
const registrationService = async (userRegisterValue, passRegisterValue) => {
    // 1. Obtener configuración del entorno
    const { urlBackend, apiKey } = environmentService();
    
    // 2. Configurar headers de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey); // API Key de autenticación
    myHeaders.append("Content-Type", "application/json"); // Tipo de contenido

    // 3. Crear cuerpo de la solicitud con datos de registro
    const raw = JSON.stringify({
        email: userRegisterValue,
        password: passRegisterValue
    });

    // 4. Configuración completa de la solicitud
    const requestOptions = {
        method: "POST", // Método HTTP para creación de recursos
        headers: myHeaders,
        body: raw,
        redirect: "follow" // Permite seguimiento de redirecciones
    };

    try {
        // 5. Realizar solicitud al endpoint de registro
        const response = await fetch(`${urlBackend}/api/v1/auth/registration`, requestOptions);
        
        // 6. Convertir respuesta a JSON
        const data = await response.json();
        
        // 7. Retornar datos de la respuesta
        return data;
    } catch (error) {
        // 8. Capturar y retornar errores
        console.error('Error en servicio de registro:', error);
        return error; // Retorna el error para manejo externo
    }
}

export { registrationService };