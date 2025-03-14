import React, { useState, useEffect } from "react";
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import Cropper from "react-easy-crop";

// Función auxiliar para obtener la imagen recortada
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error("Canvas is empty"));
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

const UploadVideo = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null); // Estado para la imagen de portada
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [contentType, setContentType] = useState("movie"); // Película o serie
  const [videoName, setVideoName] = useState(""); // Estado para el nombre del video
  const [season, setSeason] = useState(""); // Estado para la temporada (solo para series)
  const [episodeNumber, setEpisodeNumber] = useState(""); // Estado para el número de episodio (solo para series)
  const [searchResults, setSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda
  const [isSearching, setIsSearching] = useState(false); // Estado para controlar si se está realizando una búsqueda
  const [releaseYear, setReleaseYear] = useState("");

  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.177:3000/api/v1/videos/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setMessage("Error al cargar las categorías.");
      }
    };
    fetchCategories();
  }, []);

  /**
   * Maneja el cambio en el campo de búsqueda de nombre del video.
   * Realiza una consulta al backend para buscar videos que coincidan con el texto ingresado,
   * filtrando por tipo de contenido (película o serie).
   */
  const handleVideoNameChange = async (e) => {
    const query = e.target.value;
    setVideoName(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await axios.get(
          `http://192.168.0.177:3000/api/v1/videos/search?name=${encodeURIComponent(
            query
          )}&contentType=${contentType}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error al buscar videos:", error);
        setMessage("Error al buscar videos.");
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  /**
   * Selecciona un video de los resultados de búsqueda y lo establece como el nombre del video.
   */
  const selectSearchResult = (name) => {
    setVideoName(name);
    setSearchResults([]); // Limpia los resultados de búsqueda
  };

  /**
   * Maneja el cambio de archivo de video.
   * Actualiza el estado del archivo seleccionado y muestra su nombre en el botón.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setMessage(`Archivo seleccionado: ${file.name}`);
  };

  /**
   * Maneja el cambio de archivo de imagen de portada.
   * Actualiza el estado de la imagen seleccionada y muestra su nombre en el botón.
   */
  // Maneja la selección de la imagen de portada
  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setMessage(`Imagen de portada seleccionada: ${file.name}`);
    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);
    setShowCropper(true);
  };

  // Guarda las coordenadas del recorte
  const onCropCompleteHandler = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Procesa la imagen recortada y actualiza el estado con el nuevo archivo
  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImg(coverImageUrl, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], coverImage.name, {
        type: coverImage.type,
      });
      setCoverImage(croppedFile);
      // Actualiza la URL de vista previa para mostrar la imagen recortada
      setCoverImageUrl(URL.createObjectURL(croppedFile));
      setShowCropper(false);
    } catch (error) {
      console.error(error);
      setMessage("Error al recortar la imagen.");
    }
  };

  /**
   * Limpia todos los campos del formulario después de una subida exitosa.
   */
  const resetFormFields = () => {
    setCategory("");
    setSelectedFile(null);
    setCoverImage(null);
    setVideoName("");
    setContentType("movie");
    setSeason("");
    setEpisodeNumber("");
    setMessage("Campos limpiados correctamente.");
  };

  // Agregar validación para release_year
  //const validateYear = (year) => {
  //  const currentYear = new Date().getFullYear();
  //  return year >= 1900 && year <= currentYear;
  //};

  /**
   * Maneja la subida del video.
   * Realiza validaciones, envía el formulario y monitorea el progreso.
   */
  const handleUpload = async () => {
    // Validación del año
    /*if (!releaseYear || !validateYear(releaseYear)) {
      setMessage("Por favor ingresa un año válido (1900-" + new Date().getFullYear() + ")");
      return;
    }

    if (!selectedFile || !category || contentType === "" || !videoName) {
      setMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (contentType === "series" && (!season || !episodeNumber)) {
      setMessage("Para series, debes completar la temporada y el número de episodio.");
      return;
    }*/

    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("name", videoName); // Agregamos el nombre del video
      formData.append("category", category);
      formData.append("contentType", contentType);
      formData.append("coverImage", coverImage); // Agregamos la imagen de portada
      formData.append("releaseYear", releaseYear);

      // Si es una serie, agregamos temporada y número de episodio
      if (contentType === "series") {
        formData.append("season", season);
        formData.append("episodeNumber", episodeNumber);
      }

      const response = await axios.post(
        "http://192.168.0.177:3000/api/v1/videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      const { taskId } = response.data;
      setTaskId(taskId);
      monitorProgress(taskId);
    } catch (error) {
      console.error(error);
      setMessage("Error al subir el video.");
      setUploading(false);
    }
  };

  /**
   * Monitorea el progreso de la subida.
   * Una vez completada la subida, limpia los campos del formulario.
   */
  const monitorProgress = async (taskId) => {
    try {
      while (true) {
        const response = await axios.get(
          `http://192.168.0.177:3000/api/v1/videos/progress/${taskId}`
        );
        const { status, progress, error } = response.data;
        setProgress(progress);
        if (status === "completed") {
          setMessage("Video procesado y subido exitosamente.");
          resetFormFields(); // Limpia los campos después de la subida exitosa
          break;
        } else if (status === "failed") {
          setMessage(`Error: ${error}`);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al monitorear el progreso.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Campo para seleccionar el tipo de contenido */}
      <div style={{ marginBottom: "15px" }}>
        Tipo de Contenido:
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        >
          <option value="">Selecciona un tipo de contenido</option>
          <option value="movie">Película</option>
          <option value="series">Serie</option>
        </select>
      </div>

      {/* Campo para el nombre del video */}
      <div style={{ marginBottom: "15px" }}>
        Nombre del Video:
        <input
          type="text"
          value={videoName}
          onChange={handleVideoNameChange}
          placeholder="Escribe el nombre del video"
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              border: "1px solid #ddd",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => selectSearchResult(result.title)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #ddd",
                  color: "black",
                }}
              >
                {result.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campo para seleccionar la categoría */}
      <div style={{ marginBottom: "15px" }}>
        Categoría:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo para el año de lanzamiento */}
      <div style={{ marginBottom: "15px" }}>
        Año de Lanzamiento:
        <input
          type="number"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          placeholder="Ej: 2024"
          min="1900"
          max={new Date().getFullYear()}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      {/* Campos adicionales para series */}
      {contentType === "series" && (
        <div>
          <div style={{ marginBottom: "15px" }}>
            Temporada:
            <input
              type="number"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="Temporada"
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            Número de Episodio:
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
              placeholder="Número de episodio"
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
        </div>
      )}

      {/* Botón para seleccionar un archivo */}
      <div style={{ marginBottom: "15px" }}>
        <label style={fileInputLabel(!!selectedFile)} htmlFor="video-file">
          {selectedFile
            ? `Archivo: ${selectedFile.name}`
            : "Seleccionar Archivo"}
        </label>
        <input
          id="video-file"
          type="file"
          accept=".mp4,.mkv,.avi,.mov"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Botón para seleccionar una imagen de portada */}
      <div style={{ marginBottom: "15px" }}>
        <label
          style={{
            backgroundColor: coverImage ? "#28a745" : "#007bff",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          htmlFor="cover-image"
        >
          {coverImage
            ? `Portada: ${coverImage.name}`
            : "Seleccionar Imagen de Portada"}
        </label>
        <input
          id="cover-image"
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Mostrar el Cropper si hay imagen de portada y se debe recortar */}
      {showCropper && coverImageUrl && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 400,
            marginBottom: "15px",
          }}
        >
          <Cropper
            image={coverImageUrl}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9} // O el aspect ratio que desees
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
          <button
            onClick={handleCropComplete}
            style={{ marginTop: "10px", padding: "8px 12px", position: "relative", zIndex: 1000 }}
          >
            Confirmar recorte
          </button>
        </div>
      )}

      {/* Barra de progreso */}
      {uploading && (
        <div style={progressBarContainerStyle}>
          <div style={{ ...progressBarStyle, width: `${progress}%` }}></div>
        </div>
      )}

      {/* Botón para iniciar la subida */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: uploading ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Procesando..." : "Subir Video"}
      </button>

      {/* Mensajes de estado */}
      {message && (
        <div style={{ marginTop: "15px", color: "green" }}>{message}</div>
      )}
    </div>
  );
};

// Estilos dinámicos para los botones de selección de archivos
const fileInputStyle = (isSelected) => ({
  border: "2px dashed #007bff",
  borderRadius: "5px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "15px",
  backgroundColor: isSelected ? "#d4edda" : "#f8f9fa", // Verde claro si el archivo está seleccionado
});

const fileInputLabel = (isSelected) => ({
  backgroundColor: isSelected ? "#28a745" : "#007bff", // Verde si el archivo está seleccionado
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
});

const progressBarContainerStyle = {
  width: "100%",
  height: "20px",
  backgroundColor: "#f3f3f3",
  borderRadius: "5px",
  overflow: "hidden",
  marginTop: "15px",
};

const progressBarStyle = {
  height: "100%",
  backgroundColor: "#007bff",
  transition: "width 0.3s ease",
};

export { UploadVideo };
