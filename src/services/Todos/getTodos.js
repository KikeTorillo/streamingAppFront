import { environmentService } from "../environmentService";

const getTodos = async (userId) => {
    const { urlBackend, apiKey } = environmentService();
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
        credentials: 'include'
    };
    try {
        const res = await fetch(`${urlBackend}/api/v1/todos/${userId}`, requestOptions);
        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export { getTodos };
