// ===== 2. REGISTRATION SERVICE CORREGIDO =====
// src/services/Auth/registrationService.js (REEMPLAZAR EL EXISTENTE)

import { environmentService } from "../environmentService";

/**
 * Servicio para registro de nuevos usuarios - HOMOLOGADO
 * ✅ CORREGIDO: Usar userName en lugar de email según schema del backend
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.username - Username (será mapeado a userName)
 * @param {string} userData.password - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta estructurada del servidor
 */
const registrationService = async (userData) => {
    const { urlBackend, apiKey } = environmentService();
    
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    // ✅ CORREGIDO: Según registrationSchema del backend
    // Solo userName y password, NO email
    const raw = JSON.stringify({
        userName: userData.username, // Frontend 'username' → Backend 'userName'
        password: userData.password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${urlBackend}/api/v1/auth/registration`, requestOptions);
        const data = await response.json();
        
        console.log('Respuesta del backend registration:', data);
        
        // ✅ MEJORADO: Respuesta estructurada
        if (response.ok) {
            return {
                success: true,
                data: data,
                message: 'Usuario registrado exitosamente'
            };
        } else {
            return {
                success: false,
                error: data.message || 'Error al registrar usuario',
                details: data
            };
        }
    } catch (error) {
        console.error('Error en registrationService:', error);
        return {
            success: false,
            error: 'Error de conexión',
            message: error.message || 'Error al conectar con el servidor'
        };
    }
}

export { registrationService };