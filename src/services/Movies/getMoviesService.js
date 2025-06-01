import axios from "axios";
import { environmentService } from "../environmentService";

const getMoviesService = async () => {
    const { urlBackend, apiKey } = environmentService();
    try {
        const response = await axios.get(
          `${urlBackend}/api/v1/movies`,
          {
            //headers: { "api": apiKey },
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        return error;
      }
}

export { getMoviesService };