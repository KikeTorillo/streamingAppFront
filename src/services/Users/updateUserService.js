
// ===== USUARIOS SERVICIOS FALTANTES =====

// src/services/Users/getUserByIdService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener usuario por ID
 * Endpoint: GET /api/v1/users/{id} (según Bruno)
 */
const getUserByIdService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/users/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
};

export { getUserByIdService };

// src/services/Users/createUserService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Crear nuevo usuario
 * Endpoint: POST /api/v1/users (según Bruno)
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {number} userData.roleId - ID del rol del usuario
 */
const createUserService = async (userData) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.post(`${urlBackend}/api/v1/users`, 
            {
                email: userData.email,
                password: userData.password,
                roleId: userData.roleId
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
    }
};

export { createUserService };

// src/services/Users/updateUserService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar usuario
 * Endpoint: PATCH /api/v1/users/{id} (según Bruno)
 * @param {number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @param {string} [userData.email] - Nuevo email
 * @param {number} [userData.roleId] - Nuevo ID de rol
 */
const updateUserService = async (id, userData) => {
    const { urlBackend } = environmentService();
    
    // Construir objeto solo con campos que se van a actualizar
    const updateData = {};
    if (userData.email) updateData.email = userData.email;
    if (userData.roleId) updateData.roleId = userData.roleId;

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/users/${id}`, 
            updateData,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};

export { updateUserService };