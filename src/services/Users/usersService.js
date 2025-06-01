import axios from "axios";
import { environmentService } from "../environmentService";

const getUsersService = async () => {
  const { urlBackend, apiKey } = environmentService();
  try {
    const response = await axios.get(`${urlBackend}/api/v1/users`, {
      //headers: { "api": apiKey },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const deleteUsersService = async (id) => {
  const { urlBackend, apiKey } = environmentService();

  const options = { method: "DELETE", url: `${urlBackend}/api/v1/users/${id}`,  withCredentials: true };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export { getUsersService, deleteUsersService };
