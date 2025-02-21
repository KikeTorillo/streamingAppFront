import { environmentService } from "../environmentService";

const loginService = async (userValue, passValue) => {
    const {urlBackend, apiKey} = environmentService();
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "email": userValue,
        "password": passValue
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials: 'include'
    };

    try {
        const res = await fetch(`${urlBackend}/api/v1/auth/login`, requestOptions);
        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export { loginService };