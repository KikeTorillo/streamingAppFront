// src/components/molecules/TranscodingModal/TranscodingModal.jsx
import React from 'react';
import { UploadProgress } from '../../atoms/UploadProgress/UploadProgress';
import { Button } from '../../atoms/Button/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../../atoms/Card/Card';
import './TranscodingModal.css';

const TranscodingModal = ({
  isOpen = false,
  progress = 0,
  status = 'processing', // 'processing', 'transcoding', 'completed', 'failed'
  message = 'Procesando...',
  error = null,
  contentTitle = '',
  contentType = 'película', // 'película', 'serie'
  onClose,
  onRetry,
  onViewContent,
  allowClose = false, // Permitir cerrar durante procesamiento
  showRetry = true,
  showViewContent = true
}) => {
  
  if (!isOpen) return null;

  // Determinar si se puede cerrar
  const canClose = allowClose || status === 'completed' || status === 'failed';
  
  // Función para manejar cierre
  const handleClose = () => {
    if (canClose && onClose) {
      onClose();
    }
  };

  // Función para manejar backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && canClose) {
      handleClose();
    }
  };

  return (
    <div 
      className="transcoding-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="transcoding-modal">
        <Card className="transcoding-modal__card">
          
          <CardHeader className="transcoding-modal__header">
            <CardTitle className="transcoding-modal__title">
              🎬 {getStatusTitle(status, contentType)}
            </CardTitle>
            
            {/* Botón cerrar solo si está permitido */}
            {canClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="transcoding-modal__close"
                aria-label="Cerrar"
              >
                ✕
              </Button>
            )}
          </CardHeader>

          <CardBody className="transcoding-modal__body">
            
            {/* Información del contenido */}
            {contentTitle && (
              <div className="transcoding-modal__content-info">
                <h4 className="transcoding-modal__content-title">
                  {contentTitle}
                </h4>
                <p className="transcoding-modal__content-type">
                  {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </p>
              </div>
            )}

            {/* Componente de progreso */}
            <UploadProgress
              progress={progress}
              message={message}
              status={status}
              showPercentage={true}
              size="lg"
            />

            {/* Información adicional según estado */}
            {status === 'processing' && (
              <div className="transcoding-modal__info">
                <p>📁 Preparando archivos y validando contenido...</p>
              </div>
            )}

            {status === 'transcoding' && (
              <div className="transcoding-modal__info">
                <p>🎥 Generando múltiples calidades de video...</p>
                <p className="transcoding-modal__info-detail">
                  Este proceso puede tomar varios minutos dependiendo del tamaño del archivo.
                </p>
              </div>
            )}

            {status === 'completed' && (
              <div className="transcoding-modal__success">
                <p>🎉 ¡Tu {contentType} se procesó exitosamente!</p>
                <p className="transcoding-modal__success-detail">
                  Ya está disponible en tu catálogo y listo para reproducir.
                </p>
              </div>
            )}

            {status === 'failed' && error && (
              <div className="transcoding-modal__error">
                <p>⚠️ Ocurrió un problema durante el procesamiento:</p>
                <p className="transcoding-modal__error-detail">
                  {error}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="transcoding-modal__actions">
              
              {/* Botón reintentar (solo en error) */}
              {status === 'failed' && showRetry && onRetry && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onRetry}
                  icon="🔄"
                >
                  Reintentar
                </Button>
              )}

              {/* Botón ver contenido (solo cuando completado) */}
              {status === 'completed' && showViewContent && onViewContent && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onViewContent}
                  icon="👁️"
                >
                  Ver {contentType}
                </Button>
              )}

              {/* Botón cerrar */}
              {canClose && (
                <Button
                  variant={status === 'completed' ? 'secondary' : 'outline'}
                  size="md"
                  onClick={handleClose}
                >
                  {status === 'completed' ? 'Continuar' : 'Cerrar'}
                </Button>
              )}
              
            </div>

            {/* Advertencia de no cerrar */}
            {(status === 'processing' || status === 'transcoding') && !allowClose && (
              <div className="transcoding-modal__warning">
                <p>⚠️ No cierres esta ventana hasta que el procesamiento termine</p>
              </div>
            )}

          </CardBody>
        </Card>
      </div>
    </div>
  );
};

/**
 * Obtener título según estado
 */
const getStatusTitle = (status, contentType) => {
  switch (status) {
    case 'processing':
      return `Preparando ${contentType}`;
    case 'transcoding':
      return `Procesando ${contentType}`;
    case 'completed':
      return `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Lista`;
    case 'failed':
      return 'Error en Procesamiento';
    default:
      return `Procesando ${contentType}`;
  }
};

export { TranscodingModal };