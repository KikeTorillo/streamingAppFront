import axios from "axios";
import { environmentService } from "../environmentService";

const getCategoriesService = async () => {
    const { urlBackend, apiKey } = environmentService();
    try {
        const response = await axios.get(
          `${urlBackend}/api/v1/category`,
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

export { getCategoriesService };