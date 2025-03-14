import React, { useState, useEffect } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";

// Funciones auxiliares para el crop (igual que en tu código)
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

const CreateSeries = () => {
  const [seriesName, setSeriesName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [releaseYear, setReleaseYear] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

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

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCoverImage(file);
    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);
    setShowCropper(true);
  };

  const onCropCompleteHandler = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImg(coverImageUrl, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], coverImage.name, {
        type: coverImage.type,
      });
      setCoverImage(croppedFile);
      setCoverImageUrl(URL.createObjectURL(croppedFile));
      setShowCropper(false);
    } catch (error) {
      console.error(error);
      setMessage("Error al recortar la imagen.");
    }
  };

  const handleCreateSeries = async () => {
    if (!seriesName || !category || !releaseYear || !coverImage) {
      setMessage("Por favor completa todos los campos obligatorios.");
      return;
    }
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", seriesName);
      formData.append("category", category);
      formData.append("releaseYear", releaseYear);
      formData.append("coverImage", coverImage);

      // Se asume que este endpoint crea una serie y retorna su id
      const response = await axios.post(
        "http://192.168.0.177:3000/api/v1/videos/series",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("Serie creada exitosamente.");
      // Aquí podrías redirigir a la pantalla de carga de episodios,
      // pasando el id de la serie recién creada.
    } catch (error) {
      console.error(error);
      setMessage("Error al crear la serie.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>Crear Nueva Serie</h1>
      <div>
        <label>Nombre de la Serie:</label>
        <input
          type="text"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
        />
      </div>
      <div>
        <label>Categoría:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Año de Lanzamiento:</label>
        <input
          type="number"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
      </div>
      <div>
        <label>Portada de la Serie:</label>
        <input type="file" accept="image/*" onChange={handleCoverImageChange} />
      </div>
      {showCropper && coverImageUrl && (
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          <Cropper
            image={coverImageUrl}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
          <button onClick={handleCropComplete}>Confirmar recorte</button>
        </div>
      )}
      <button onClick={handleCreateSeries} disabled={creating}>
        {creating ? "Creando serie..." : "Crear Serie"}
      </button>
      {message && <div>{message}</div>}
    </div>
  );
};

export {CreateSeries};
