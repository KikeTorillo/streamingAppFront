// src/hooks/useMovieNavigation.js
import { useNavigate } from 'react-router-dom';

function formatResolutions(resolutions = []) {
  // ✅ FIX: No dividir por 10, usar las resoluciones tal como vienen
  return resolutions
    .sort((a, b) => a - b)
    .join(',');
}

function useMovieNavigation() {
  const navigate = useNavigate();

  const buildPlayerParams = (movieData) => {
    console.log('[useMovieNavigation] movieData recibida:', movieData);
    
    const original = movieData?._original || movieData;
    const fileHash = original?.file_hash;
    
    // ✅ FIX: Validar que fileHash existe
    if (!fileHash) {
      console.error('[useMovieNavigation] Error: file_hash no encontrado en movieData:', original);
      return null;
    }
    
    const formatted = formatResolutions(original?.available_resolutions || []);
    
    console.log('[useMovieNavigation] fileHash:', fileHash);
    console.log('[useMovieNavigation] resolutions originales:', original?.available_resolutions);
    console.log('[useMovieNavigation] resolutions formateadas:', formatted);
    
    return { 
      path: `/player/${fileHash}`, 
      search: `resolutions=${formatted}` 
    };
  };

  const navigateToPlayer = (movieData) => {
    const params = buildPlayerParams(movieData);
    
    if (!params) {
      console.error('[useMovieNavigation] No se pudo generar URL para:', movieData);
      return;
    }
    
    const { path, search } = params;
    const url = `${path}?${search}`;
    console.log('[useMovieNavigation] to player:', url);
    navigate(url);
  };

  const navigateToDetails = (movieData) => {
    console.log('[useMovieNavigation] to details:', movieData.id);
    navigate(`/movies/${movieData.id}`);
  };

  return { buildPlayerParams, navigateToPlayer, navigateToDetails };
}

export { useMovieNavigation };