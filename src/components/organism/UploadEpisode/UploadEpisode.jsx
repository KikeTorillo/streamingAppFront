import React, { useState } from "react";
import { Button } from "../../atoms/Button/Button";
import { FileInput } from "../../atoms/FileInput/FileInput";
import { Cropped } from "../../atoms/Cropped/Cropped";
import { VideoNameSearch } from "../../molecules/VideoNameSearch/VideoNameSearch";
import { UploadProgress } from "../../atoms/UploadProgress/UploadProgress";
import { useCategories } from "../../../hooks/useCategories";
import { useUploadProgress } from "../../../hooks/useUploadProgress";
import { TextInput } from "../../atoms/TextInput/TextInput";
import { Card } from "../../atoms/Card/Card";
import { Select } from "../../atoms/Select/Select";
import { createSeriesService } from "../../../services/Videos/createSeriesService";

const UploadEpisode = () => {
  const [movieData, setMovieData] = useState({
    serieId: null,
    serieName: '',
    season: '',
    episodeNumber: '',
    selectedFile: null,
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { categories, error: categoriesError } = useCategories();
  const { progress, monitorProgress } = useUploadProgress();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setMovieData((prev) => ({
      ...prev,
      selectedFile: file,
    }));
  };

  const handleUpload = async () => {
    console.log(movieData);
    setUploading(true);
    try {
      //const responseData = await createSeriesService(
      //  movieData.videoName,
      //  movieData.category,
      //  movieData.releaseYear,
      //  movieData.selectedFile,
      // movieData.coverImage
      //);
      // Se asume que responseData contiene taskId para el monitoreo del progreso
      //monitorProgress(responseData.taskId, 'movies',setMessage, () => setUploading(false));
    } catch (error) {
      console.error(error);
      setMessage("Error al subir la película.");
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <Card className="upload">
        <VideoNameSearch
          videoName={movieData.serieName}
          setVideoName={(value) =>
            setMovieData((prev) => ({ ...prev, serieName: value }))
          }
          contentType="series"
          forceSelection={true}
        />
        <TextInput
          type="number"
          name="season"
          value={movieData.season}
          onChange={handleInputChange}
          placeholder="Temporada"
        />

        <TextInput
          type="number"
          name="episodeNumber"
          value={movieData.episodeNumber}
          onChange={handleInputChange}
          placeholder="Episodio"
        />

        <div className="files-container">
          <FileInput
            text={
              movieData.selectedFile
                ? "Película seleccionada"
                : "Subir película"
            }
            onChange={handleFileChange}
            accept=".mp4,.mkv,.avi"
          />
        </div>

        {uploading && <UploadProgress progress={progress} />}
        <Button
          onClick={handleUpload}
          disabled={uploading}
          text="Subir capitulo"
          size="md"
        />
        {message && (
          <div style={{ marginTop: "15px", color: "green" }}>{message}</div>
        )}
      </Card>
    </div>
  );
};

export { UploadEpisode };
