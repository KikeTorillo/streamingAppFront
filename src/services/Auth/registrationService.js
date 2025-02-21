import { environmentService } from "../environmentService";

const registrationService = async (userRegisterValue, passRegisterValue) => {
    const {urlBackend,apiKey} = environmentService();
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "email": userRegisterValue,
        "password": passRegisterValue
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    try {
        const res = await fetch(`${urlBackend}/api/v1/auth/registration`, requestOptions);
        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export { registrationService };