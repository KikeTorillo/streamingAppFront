import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Biblioteca para realizar solicitudes HTTP

const UploadVideo = () => {
  const [category, setCategory] = useState(''); // Estado para almacenar la categoría seleccionada
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías disponibles
  const [selectedFile, setSelectedFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [uploading, setUploading] = useState(false); // Estado para indicar si se está subiendo el archivo
  const [progress, setProgress] = useState(0); // Estado para rastrear el progreso de la subida/transcodificación
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes al usuario
  const [taskId, setTaskId] = useState(null); // Estado para almacenar el ID de la tarea de transcodificación
  const [contentType, setContentType] = useState('movie'); // Estado para seleccionar el tipo de contenido (movie o series)

  /**
   * Obtener las categorías disponibles desde el backend:
   * - Se ejecuta cuando el componente se monta.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.0.177:3000/api/v1/videos/categories');
        setCategories(response.data); // Almacena las categorías en el estado
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setMessage('Error al cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  /**
   * Manejar la selección de archivos:
   * - Actualiza el estado cuando el usuario selecciona un archivo.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (!file) return; // Si no se seleccionó ningún archivo, no hacer nada
    setSelectedFile(file); // Actualiza el estado con el archivo seleccionado
    setMessage(`Archivo seleccionado: ${file.name}`); // Muestra el nombre del archivo seleccionado
  };

  /**
   * Manejar la carga del archivo:
   * - Esta función maneja la subida del archivo al backend.
   * - Usa `axios` para enviar una solicitud POST con el archivo y los datos adicionales.
   */
  const handleUpload = async () => {
    if (!selectedFile || !category || contentType === '') {
      setMessage('Por favor, selecciona un archivo, una categoría y un tipo de contenido.');
      return;
    }

    setUploading(true); // Indica que se está subiendo el archivo
    setProgress(0); // Reinicia el progreso a 0%

    try {
      const formData = new FormData(); // Crea un objeto FormData para enviar el archivo
      formData.append('video', selectedFile); // Agrega el archivo al FormData
      formData.append('name', selectedFile.name); // Agrega el nombre del archivo
      formData.append('category', category); // Agrega la categoría seleccionada
      formData.append('contentType', contentType); // Agrega el tipo de contenido (movie o series)

      /**
       * Subir el archivo y obtener el ID de la tarea:
       * - Usamos `axios.post` para enviar el archivo al backend.
       */
      const response = await axios.post(
        'http://192.168.0.177:3000/api/v1/videos/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }, // Especifica el tipo de contenido
          withCredentials: true, // Envía cookies para autenticación basada en sesiones
        }
      );

      const { taskId } = response.data; // Extrae el ID de la tarea del backend
      setTaskId(taskId); // Almacena el ID de la tarea en el estado

      // Monitorear el progreso de la tarea
      monitorProgress(taskId);
    } catch (error) {
      console.error(error); // Registra el error en la consola
      setMessage('Error al subir el video.'); // Muestra un mensaje de error al usuario
      setUploading(false); // Desactiva el estado de subida
    }
  };

  /**
   * Monitorear el progreso de la tarea:
   * - Consulta periódicamente el estado de la tarea en el backend.
   * - Actualiza el progreso en tiempo real y muestra mensajes cuando la tarea termina.
   */
  const monitorProgress = async (taskId) => {
    try {
      while (true) {
        const response = await axios.get(
          `http://192.168.0.177:3000/api/v1/videos/progress/${taskId}`
        );
        const { status, progress, error } = response.data; // Extrae el estado, progreso y mensaje de error
        setProgress(progress); // Actualiza el progreso en el estado

        if (status === 'completed') {
          setMessage('Video procesado y subido exitosamente.'); // Muestra un mensaje de éxito
          break; // Sale del bucle cuando la tarea está completada
        } else if (status === 'failed') {
          setMessage(`Error: ${error}`); // Muestra un mensaje de error
          break; // Sale del bucle si la tarea falla
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo antes de la próxima consulta
      }
    } catch (error) {
      console.error(error); // Registra el error en la consola
      setMessage('Error al monitorear el progreso.'); // Muestra un mensaje de error al usuario
    } finally {
      setUploading(false); // Desactiva el estado de subida
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Subir Video</h2>
      <form>
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
          disabled={uploading || !selectedFile || !category || contentType === ''}
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