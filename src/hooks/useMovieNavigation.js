// src/hooks/useMovieNavigation.js
import { useNavigate } from 'react-router-dom';

function formatResolutions(resolutions = []) {
  return resolutions
    .map((r) => Math.round(r / 10))
    .sort((a, b) => a - b)
    .join(',');
}

function useMovieNavigation() {
  const navigate = useNavigate();

  const buildPlayerParams = (movieData) => {
    const original = movieData?._original || movieData;
    const fileHash = original.file_hash;
    const formatted = formatResolutions(original.available_resolutions);
    return { path: `/player/${fileHash}`, search: `resolutions=${formatted}` };
  };

  const navigateToPlayer = (movieData) => {
    const { path, search } = buildPlayerParams(movieData);
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
