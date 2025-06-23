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