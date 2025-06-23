// src/services/Users/deleteUserService.js (NUEVO - separar del usersService.js)
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteUserService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/users/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

export { deleteUserService };