function environmentService() {
    const mode = import.meta.env.VITE_MODE;
    const apiKey = import.meta.env.VITE_API_KEY;
    let urlBackend = '';
    let urlFront = ''
    if (mode !== 'local') {
        urlBackend = import.meta.env.VITE_HOST_VERCEL;
        urlFront = import.meta.env.VITE_FRONT_URL_PROD;
    } else {
        urlBackend = import.meta.env.VITE_HOST_LOCAL;
        urlFront = import.meta.env.VITE_FRONT_URL_LOCAL;
    }
    return {urlFront,urlBackend,apiKey};
}

export {environmentService};
