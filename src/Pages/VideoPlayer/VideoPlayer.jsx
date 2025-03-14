import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import hlsQualitySelector from "videojs-hls-quality-selector";
import "./VideoPlayer.css";
import { useParams, useSearchParams } from 'react-router-dom';

// Registra los plugins si aún no están registrados
if (typeof videojs.getPlugin("hlsQualitySelector") !== "function") {
  videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);
}

const VideoPlayer = () => {

  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const resolutions = searchParams.get('resolutions');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const baseUrl = `http://192.168.0.177:8082/hls/${id}/`;
  const subsUrl = `http://192.168.0.177:8082/subs/${id}/`;
  const urlComplete = `${baseUrl}_,${resolutions},p.mp4.play/master.m3u8`
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!videoRef.current) {
          console.error("El elemento <video> no está disponible en el DOM.");
          return;
        }
        if (playerRef.current) {
          playerRef.current.dispose();
        }

        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
          fluid: true,
          sources: [
            {
              src: `${urlComplete}`,
              type: "application/x-mpegURL",
            },
          ],
          html5: {
            vhs: {
              overrideNative: true,
            },
            nativeControlsForTouch: false,
            playsinline: true,
          },
          pip: true,
          controlBar: {
            children: [
              "playToggle",
              "volumePanel",
              "currentTimeDisplay",
              "timeDivider",
              "durationDisplay",
              "progressControl",
              "remainingTimeDisplay",
              "audioTrackButton",
              "subsCapsButton", // Botón de subtítulos añadido
              "pictureInPictureToggle",
              "fullscreenToggle",
            ],
          },
        });

        // Habilita selección de calidad
        player.hlsQualitySelector({
          displayCurrentQuality: true,
        });

        // Habilita selección de pistas de audio
        player.on("loadedmetadata", () => {
          const audioTracks = player.audioTracks();
          if (audioTracks.length > 0) {
            console.log("Pistas de audio detectadas:", audioTracks);
          }
        });

        // Configuración de subtítulos
        /*player.ready(() => {
          // Añadir pistas de subtítulos
          const subtitles = [
            {
              src: `${subsUrl}subtitles_track0.vtt`, // Ruta a archivo VTT
              label: "Español",
              srclang: "es",
              default: true,
            },
            //{
            //  src: `${subsUrl}subtitles-en.vtt`,
            //  label: "English",
            //  srclang: "en",
            //},
          ];

          subtitles.forEach((trackConfig) => {
            player.addRemoteTextTrack({
              kind: "subtitles",
              src: trackConfig.src,
              label: trackConfig.label,
              language: trackConfig.srclang,
              default: trackConfig.default,
            });
          });
        });*/

        playerRef.current = player;
      } catch (error) {
        console.error("Error al inicializar el reproductor:", error);
      }
    };

    initializePlayer();
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          controls
          width="640"
          height="360"
          style={{ maxWidth: "100%", height: "auto" }}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  );
};

export { VideoPlayer };