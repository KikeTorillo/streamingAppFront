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
import "./CreateSeries.css";

const CreateSeries = () => {
  const [serieData, setSerieData] = useState({
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
    setSerieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSerieData((prev) => ({
      ...prev,
      coverImage: file,
      coverImageUrl: URL.createObjectURL(file),
      showCropper: true,
    }));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const responseData = await createSeriesService(
        serieData.videoName,
        serieData.category,
        serieData.releaseYear,
        serieData.selectedFile,
        serieData.coverImage
      );
      // Se asume que responseData contiene taskId para el monitoreo del progreso
      monitorProgress(responseData.taskId, "series", setMessage, () =>
        setUploading(false)
      );
    } catch (error) {
      console.error(error);
      setMessage("Error al subir la serie.");
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <Card className="upload">
        <VideoNameSearch
          videoName={serieData.videoName}
          placeholder="Nombre de la serie"
          setVideoName={(value) =>
            setSerieData((prev) => ({ ...prev, videoName: value }))
          }
          contentType="series"
        />
        <TextInput
          type="text"
          name="releaseYear"
          value={serieData.releaseYear}
          onChange={handleInputChange}
          placeholder="Año de lanzamiento"
        />
        <Select
          value={serieData.category}
          onChange={(e) =>
            setSerieData((prev) => ({ ...prev, category: e.target.value }))
          }
          options={categories}
        />
        {categoriesError && <div>{categoriesError}</div>}

        <div className="files-container">
          <FileInput
            text={
              serieData.coverImage ? "Portada seleccionada" : "Subir Portada"
            }
            onChange={handleCoverImageChange}
            accept="image/*"
          />
        </div>

        {serieData.showCropper && serieData.coverImageUrl && (
          <Cropped
            imageSrc={serieData.coverImageUrl}
            aspect={16 / 9}
            onComplete={(croppedBlob) => {
              setSerieData((prev) => ({
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
          text="Crear Serie"
          size="md"
        />
        {message && (
          <div style={{ marginTop: "15px", color: "green" }}>{message}</div>
        )}
      </Card>
    </div>
  );
};

export { CreateSeries };
