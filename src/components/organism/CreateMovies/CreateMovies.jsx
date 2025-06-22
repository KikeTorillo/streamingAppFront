import React, { useState } from "react";
import { Button } from "../../atoms/Button/Button";
import { FileInput } from "../../atoms/FileInput/FileInput";
import { Cropped } from "../../atoms/Cropped/Cropped";
//import { VideoNameSearch } from "../../molecules/VideoNameSearch/VideoNameSearch";
import { UploadProgress } from "../../atoms/UploadProgress/UploadProgress";
import { useCategories } from "../../../hooks/useCategories";
import { useUploadProgress } from "../../../hooks/useUploadProgress";
import { TextInput } from "../../molecules/TextInput/TextInput";
import "./CreateMovies.css";
import { Card } from "../../atoms/Card/Card";
import { Select } from "../../atoms/Select/Select";
import { createMovieService } from "../../../services/Videos/createMovieService";

const CreateMovies = () => {
  const [movieData, setMovieData] = useState({
    videoName: "",
    category: "",
    releaseYear: "",
    selectedFile: null,
    coverImage: null,
    coverImageUrl: null,
    showCropper: false,
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

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setMovieData((prev) => ({
      ...prev,
      coverImage: file,
      coverImageUrl: URL.createObjectURL(file),
      showCropper: true,
    }));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const responseData = await createMovieService(
        movieData.videoName,
        movieData.category,
        movieData.releaseYear,
        movieData.selectedFile,
        movieData.coverImage
      );
      // Se asume que responseData contiene taskId para el monitoreo del progreso
      monitorProgress(responseData.taskId, 'movies',setMessage, () => setUploading(false));
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
          videoName={movieData.videoName}
          setVideoName={(value) =>
            setMovieData((prev) => ({ ...prev, videoName: value }))
          }
          contentType="movie"
        />
        <TextInput
          type="text"
          name="releaseYear"
          value={movieData.releaseYear}
          onChange={handleInputChange}
          placeholder="Año de lanzamiento"
        />
        <Select
          value={movieData.category}
          onChange={(e) =>
            setMovieData((prev) => ({ ...prev, category: e.target.value }))
          }
          options={categories}
        />
        {categoriesError && <div>{categoriesError}</div>}

        <div className="files-container">
          <FileInput
            text={movieData.selectedFile ? "Película seleccionada" : "Subir película"}
            onChange={handleFileChange}
            accept=".mp4,.mkv,.avi"
          />
          <FileInput
            text={movieData.coverImage ? "Portada seleccionada" : "Subir Portada"}
            onChange={handleCoverImageChange}
            accept="image/*"
          />
        </div>

        {movieData.showCropper && movieData.coverImageUrl && (
          <Cropped
            imageSrc={movieData.coverImageUrl}
            aspect={16 / 9}
            onComplete={(croppedBlob) => {
              setMovieData((prev) => ({
                ...prev,
                coverImage: new File([croppedBlob], prev.coverImage.name, {
                  type: prev.coverImage.type,
                }),
                showCropper: false,
              }));
            }}
          />
        )}

        {uploading && <UploadProgress progress={progress} />}
        <Button
          onClick={handleUpload}
          disabled={uploading}
          text="Subir Película"
          size="md"
        />
        {message && (
          <div style={{ marginTop: "15px", color: "green" }}>{message}</div>
        )}
      </Card>
    </div>
  );
};

export { CreateMovies };
