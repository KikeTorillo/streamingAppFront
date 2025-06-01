// hooks/useUploadProgress.js
import { useState } from "react";
import axios from "axios";

const useUploadProgress = () => {
  const [progress, setProgress] = useState(0);

  const monitorProgress = (taskId, contentType, setMessage, onFinish) => {
    const baseUrl = "http://192.168.0.177:3000/api/v1/";
    let progressEndpoint;
    if (contentType == 'movies') {
      progressEndpoint = `${baseUrl}movies/progress/${taskId}`;
    }else{
      progressEndpoint = `${baseUrl}series/progress/${taskId}`;
    }
  
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(progressEndpoint);
        const { status, progress: currentProgress } = response.data;
        setProgress(currentProgress);
  
        if (status === "completed") {
          setMessage("Subida completada");
          clearInterval(interval);
          onFinish();
        } else if (status === "failed") {
          setMessage("Error en la subida");
          clearInterval(interval);
          onFinish();
        }
      } catch (error) {
        console.error("Error consultando el progreso:", error);
        setMessage("Error consultando el progreso");
        clearInterval(interval);
        onFinish();
      }
    }, 1000);
  };
  

  return { progress, monitorProgress };
};

export { useUploadProgress };
