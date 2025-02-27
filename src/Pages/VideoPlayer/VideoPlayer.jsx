import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  // Estado para almacenar la resolución seleccionada
  const [resolution, setResolution] = useState("auto"); // 'auto' para usar la lista maestra
  // Estado para almacenar las pistas de audio disponibles
  const [audioTracks, setAudioTracks] = useState([]);
  // Referencia al elemento de video
  const videoRef = useRef(null);
  // Referencia a la instancia de Hls.js
  const hlsRef = useRef(null);
  // URL base del servidor HLS
  const baseUrl = "http://localhost:8082/vod/hls/Mr-Robot-1x01/";

  // Función para obtener la URL de la playlist maestra
  const getPlaylistUrl = () => {
    return `${baseUrl}_,72,48,0p.mp4.play/master.m3u8`; // Siempre usamos la lista maestra
  };

  // Función para cargar la fuente del video
  const loadVideoSource = (url) => {
    const video = videoRef.current;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Si el navegador soporta HLS nativamente
      video.src = url;
    } else if (Hls.isSupported()) {
      // Si el navegador no soporta HLS pero Hls.js está disponible
      if (hlsRef.current) {
        hlsRef.current.destroy(); // Destruir la instancia anterior de Hls.js
      }
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hlsRef.current = hls; // Guardar la referencia para futuras operaciones

      // Detectar las pistas de audio disponibles
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const tracks = data.audioTracks.map((track, index) => ({
          id: index,
          name: track.name || `Track ${index + 1}`,
          language: track.lang || "unknown",
        }));
        setAudioTracks(tracks); // Actualizar el estado con las pistas de audio
      });

      // Establecer la resolución deseada
      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        if (resolution !== "auto") {
          const levelIndex = data.levels.findIndex(
            (level) => level.height === parseInt(resolution)
          );
          if (levelIndex !== -1) {
            hlsRef.current.currentLevel = levelIndex; // Cambiar a la resolución seleccionada
          }
        }
      });
    } else {
      console.error("Tu navegador no soporta HLS ni Hls.js.");
    }
  };

  // Efecto para cargar la fuente inicial cuando el componente se monta
  useEffect(() => {
    const initialUrl = getPlaylistUrl(); // Obtener la URL inicial
    loadVideoSource(initialUrl);

    // Limpiar la instancia de Hls.js cuando el componente se desmonta
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para cambiar la resolución
  const changeResolution = (res) => {
    setResolution(res); // Actualizar el estado de la resolución
    if (hlsRef.current) {
      if (res === "auto") {
        hlsRef.current.currentLevel = -1; // Usar la resolución automática
      } else {
        const levelIndex = hlsRef.current.levels.findIndex(
          (level) => level.height === parseInt(res)
        );
        if (levelIndex !== -1) {
          hlsRef.current.currentLevel = levelIndex; // Cambiar a la resolución seleccionada
        }
      }
    }
  };

  // Función para cambiar la pista de audio
  const changeAudioTrack = (trackId) => {
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = -1; // Desactivar subtítulos si están habilitados
      hlsRef.current.audioTrack = trackId; // Cambiar la pista de audio activa
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Botones para cambiar la resolución */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => changeResolution("auto")}>Auto</button>
        <button onClick={() => changeResolution("1080")}>1080p</button>
        <button onClick={() => changeResolution("720")}>720p</button>
        <button onClick={() => changeResolution("480")}>480p</button>
      </div>

      {/* Selector de pistas de audio */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Selecciona una pista de audio:</strong>
        {audioTracks.length > 0 ? (
          audioTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => changeAudioTrack(track.id)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {track.name} ({track.language})
            </button>
          ))
        ) : (
          <span>Cargando pistas de audio...</span>
        )}
      </div>

      {/* Elemento de video */}
      <video
        ref={videoRef}
        controls
        width="640"
        height="360"
        style={{ maxWidth: "100%" }}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
};

export { VideoPlayer };