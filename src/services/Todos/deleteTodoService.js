import { environmentService } from "../environmentService";

const deleteTodoService = async (toDo) => {
    const {urlBackend, apiKey} = environmentService();
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "toDo": toDo
    });

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials: 'include'
    };

    try {
        const res = await fetch(`${urlBackend}/api/v1/todos`, requestOptions);
        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export { deleteTodoService };