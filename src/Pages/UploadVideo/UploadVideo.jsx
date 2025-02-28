import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Biblioteca para realizar solicitudes HTTP

const UploadVideo = () => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null); // Estado para la imagen de portada
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [contentType, setContentType] = useState('movie');
  const [videoName, setVideoName] = useState(''); // Estado para el nombre del video

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.0.177:3000/api/v1/videos/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setMessage('Error al cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setMessage(`Archivo seleccionado: ${file.name}`);
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setMessage(`Imagen de portada seleccionada: ${file.name}`);
  };

  const handleUpload = async () => {
    if (!selectedFile || !category || contentType === '' || !videoName) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('name', videoName); // Agregamos el nombre del video
      formData.append('category', category);
      formData.append('contentType', contentType);
      formData.append('coverImage', coverImage); // Agregamos la imagen de portada

      const response = await axios.post(
        'http://192.168.0.177:3000/api/v1/videos/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      const { taskId } = response.data;
      setTaskId(taskId);
      monitorProgress(taskId);
    } catch (error) {
      console.error(error);
      setMessage('Error al subir el video.');
      setUploading(false);
    }
  };

  const monitorProgress = async (taskId) => {
    try {
      while (true) {
        const response = await axios.get(
          `http://192.168.0.177:3000/api/v1/videos/progress/${taskId}`
        );
        const { status, progress, error } = response.data;
        setProgress(progress);
        if (status === 'completed') {
          setMessage('Video procesado y subido exitosamente.');
          break;
        } else if (status === 'failed') {
          setMessage(`Error: ${error}`);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al monitorear el progreso.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Subir Video</h2>
      <form>
        {/* Campo para el nombre del video */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="video-name" style={{ display: 'block', marginBottom: '5px' }}>
            Nombre del Video:
          </label>
          <input
            id="video-name"
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Campo para seleccionar la categoría */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>
            Categoría:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar el tipo de contenido */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content-type" style={{ display: 'block', marginBottom: '5px' }}>
            Tipo de Contenido:
          </label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="">Selecciona un tipo de contenido</option>
            <option value="movie">Película</option>
            <option value="series">Serie</option>
          </select>
        </div>

        {/* Botón para seleccionar un archivo */}
        <div style={fileInputStyle}>
          <label htmlFor="file-upload" style={fileInputLabel}>
            Seleccionar Archivo
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".mp4,.mkv,.avi,.mov"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Botón para seleccionar una imagen de portada */}
        <div style={fileInputStyle}>
          <label htmlFor="cover-image-upload" style={fileInputLabel}>
            Seleccionar Imagen de Portada
          </label>
          <input
            id="cover-image-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Muestra el nombre del archivo seleccionado */}
        {selectedFile && (
          <p style={{ marginTop: '10px' }}>Archivo seleccionado: {selectedFile.name}</p>
        )}

        {/* Barra de progreso */}
        {uploading && (
          <div style={progressBarContainerStyle}>
            <div style={{ ...progressBarStyle, width: `${progress}%` }}></div>
          </div>
        )}

        {/* Botón para iniciar la subida */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !category || contentType === '' || !videoName}
          style={{
            marginTop: '15px',
            padding: '10px 15px',
            backgroundColor: uploading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Procesando...' : 'Subir Video'}
        </button>

        {/* Mensajes de estado */}
        {message && (
          <p style={{ marginTop: '15px', color: message.includes('Error') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

// Estilos
const fileInputStyle = {
  border: '2px dashed #007bff',
  borderRadius: '5px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '15px',
};
const fileInputLabel = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
};
const progressBarContainerStyle = {
  width: '100%',
  height: '20px',
  backgroundColor: '#f3f3f3',
  borderRadius: '5px',
  overflow: 'hidden',
  marginTop: '15px',
};
const progressBarStyle = {
  height: '100%',
  backgroundColor: '#007bff',
  transition: 'width 0.3s ease',
};

export { UploadVideo };