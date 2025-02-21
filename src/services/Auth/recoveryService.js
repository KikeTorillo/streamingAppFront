import { environmentService } from "../environmentService";

const recoveryService = async (emailValue) => {
    const {urlBackend, apiKey} = environmentService();
    const myHeaders = new Headers();
    myHeaders.append("api", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": emailValue
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const res = await fetch(`${urlBackend}/api/v1/auth/recovery`, requestOptions);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }

}

export { recoveryService };


