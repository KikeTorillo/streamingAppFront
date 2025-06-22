import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { TextInput } from "../TextInput/TextInput";
import "./VideoNameSearch.css";

const VideoNameSearch = ({
  videoName,
  setVideoName,
  contentType,
  placeholder,
  forceSelection = false, // Si true, se obliga a seleccionar de la lista
}) => {
  const [localResults, setLocalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);

  const handleVideoNameChange = async (e) => {
    const query = e.target.value;
    // Limpiar mensaje de error al escribir
    setErrorMessage("");
    setVideoName(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await axios.get(
          `http://192.168.0.177:3000/api/v1/videos/search?name=${encodeURIComponent(
            query
          )}&contentType=${contentType}`
        );
        setLocalResults(response.data);
      } catch (error) {
        console.error("Error al buscar videos:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setLocalResults([]);
    }
  };

  const selectResult = (title) => {
    setVideoName(title);
    setLocalResults([]);
    // Si se selecciona una opción válida, se limpia el mensaje de error
    setErrorMessage("");
  };

  const handleBlur = () => {
    if (forceSelection) {
      // Verificar si el valor actual coincide con alguna opción del listado
      const matchFound = localResults.some(
        (result) => result.title.toLowerCase() === videoName.toLowerCase()
      );
      if (!matchFound) {
        setErrorMessage("El valor debe coincidir con una opción existente.");
      }
    }
  };

  // Ocultar la lista de resultados al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setLocalResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="VideoNameSearch">
      <TextInput
        type="text"
        value={videoName}
        onChange={handleVideoNameChange}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      {localResults.length > 0 && (
        <div className="results-container">
          {localResults.map((result, index) => (
            <div key={index} onClick={() => selectResult(result.title)}>
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { VideoNameSearch };
