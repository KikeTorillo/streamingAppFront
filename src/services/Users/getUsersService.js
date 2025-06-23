// ===== 4. GET USERS SERVICE MEJORADO =====
// src/services/Users/getUsersService.js (MEJORAR EL EXISTENTE)

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener lista de usuarios - HOMOLOGADO
 * ✅ MEJORADO: Respuesta estructurada y mapeo de campos
 */
const getUsersService = async () => {
    const { urlBackend } = environmentService();
    
    try {
        const response = await axios.get(`${urlBackend}/api/v1/users`, {
            withCredentials: true,
        });
        
        console.log('Respuesta getUsersService:', response.data);
        
        // ✅ MEJORADO: Normalizar respuesta
        const users = Array.isArray(response.data) ? response.data : response.data?.items || [];
        
        // ✅ MEJORADO: Mapear usuarios con campos corregidos
        const mappedUsers = users.map(user => ({
            id: user.id,
            username: user.username || user.userName || 'Sin username',
            email: user.email || 'Sin email',
            // ✅ CORREGIDO: Backend envía role_id (snake_case)
            roleId: user.role_id || user.roleId || 3,
            roleName: getRoleName(user.role_id || user.roleId || 3),
            // ✅ CALCULADO: Estado basado en recovery_token
            isActive: !user.recovery_token,
            createdAt: user.created_at || user.createdAt,
            updatedAt: user.updated_at || user.updatedAt,
            displayName: user.username || user.userName || 'Usuario',
            lastActivity: user.updated_at || user.updatedAt || user.created_at
        }));
        
        return {
            success: true,
            data: mappedUsers,
            count: mappedUsers.length
        };
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        
        // ✅ MEJORADO: Manejo específico de sesión expirada
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'session expired',
                error: true
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al cargar usuarios',
            details: error.response?.data
        };
    }
};

/**
 * Función auxiliar para mapear roles
 */
const getRoleName = (roleId) => {
    const roles = {
        1: 'Administrador',
        2: 'Editor', 
        3: 'Usuario'
    };
    return roles[roleId] || 'Desconocido';
};

export { getUsersService };