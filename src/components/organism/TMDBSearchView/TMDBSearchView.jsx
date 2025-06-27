// ===== TMDB SEARCH VIEW - VERSIÓN MEJORADA =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React, { useMemo, useCallback } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - VERSIÓN MEJORADA Y SINCRONIZADA
 * ✅ MEJORADO: Comunicación perfecta con MovieCreatePage
 * ✅ MEJORADO: Manejo de errores más robusto
 * ✅ MEJORADO: Validaciones de entrada mejoradas
 */
function TMDBSearchView({
  // Estados de búsqueda
  searchQuery = "",
  onSearchQueryChange = () => {},
  sortBy = "year-desc",
  onSortChange = () => {},
  results = [],
  loading = false,
  error = null,

  // Handlers principales
  onSearch = () => {},
  onClearResults = () => {},
  onSelectItem = () => {},
  onManualCreate = () => {},

  // Configuración
  contentType = "all",
  title = "🎬 Buscar en TMDB",
  description = "Busca películas y series en la base de datos de TMDB para agregar al catálogo",
  placeholder = "Ej: Avatar, Breaking Bad, Inception...",
  helperText = "Busca por título, año o palabras clave",
  showManualCreate = true,

  // Opciones de ordenamiento
  sortOptions = [
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ]
}) {

  // Validaciones de seguridad mejoradas
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : "";
  const safeResults = Array.isArray(results) ? results : [];
  const safeSortOptions = Array.isArray(sortOptions) && sortOptions.length > 0 ? 
    sortOptions : [{ value: "year-desc", label: "Más recientes" }];

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  const searchFormFields = useMemo(() => [
    {
      name: 'searchQuery',
      type: 'text',
      label: 'Término de Búsqueda',
      placeholder: placeholder,
      required: true,
      leftIcon: '🔍',
      helperText: helperText,
      minLength: 2,
      maxLength: 100,
      width: 'two-thirds',
      autoFocus: true,
      disabled: loading
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Ordenar Resultados',
      options: safeSortOptions,
      helperText: 'Criterio para ordenar los resultados',
      width: 'one-third',
      disabled: loading
    }
  ], [placeholder, helperText, safeSortOptions, loading]);

  const searchFormData = useMemo(() => ({
    searchQuery: safeSearchQuery,
    sortBy: sortBy || "year-desc"
  }), [safeSearchQuery, sortBy]);

  // ===== HANDLERS MEJORADOS =====
  
  /**
   * Maneja el envío del formulario de búsqueda
   * ✅ MEJORADO: Validaciones más robustas
   */
  const handleFormSubmit = useCallback((formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      console.log('🔍 Procesando búsqueda:', formData);
      
      // Validar query
      if (!newQuery || typeof newQuery !== 'string') {
        console.warn('⚠️ Query inválido:', newQuery);
        return;
      }

      const trimmedQuery = newQuery.trim();
      
      if (trimmedQuery.length < 2) {
        console.warn('⚠️ Query muy corto:', trimmedQuery);
        return;
      }

      // Sincronizar estados solo si han cambiado
      if (trimmedQuery !== safeSearchQuery) {
        onSearchQueryChange(trimmedQuery);
      }
      
      if (newSortBy && newSortBy !== sortBy) {
        onSortChange(newSortBy);
      }

      // Ejecutar búsqueda
      if (typeof onSearch === 'function') {
        onSearch();
      }
      
    } catch (error) {
      console.error('❌ Error en handleFormSubmit:', error);
    }
  }, [safeSearchQuery, sortBy, onSearchQueryChange, onSortChange, onSearch]);

  /**
   * Maneja cambios en tiempo real del formulario
   * ✅ NUEVO: Actualización en tiempo real
   */
  const handleFormChange = useCallback((formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      // Actualizar query si cambió
      if (newQuery !== safeSearchQuery && typeof onSearchQueryChange === 'function') {
        onSearchQueryChange(newQuery);
      }
      
      // Actualizar sortBy si cambió
      if (newSortBy && newSortBy !== sortBy && typeof onSortChange === 'function') {
        onSortChange(newSortBy);
      }
    } catch (error) {
      console.error('❌ Error en handleFormChange:', error);
    }
  }, [safeSearchQuery, sortBy, onSearchQueryChange, onSortChange]);

  /**
   * Maneja la selección de un resultado
   * ✅ MEJORADO: Mejor validación y logging
   */
  const handleItemClick = useCallback((item) => {
    if (!item || typeof item !== 'object') {
      console.warn('⚠️ Item inválido para selección:', item);
      return;
    }
    
    try {
      console.log('🎬 Seleccionando item:', item.title || item.name, item);
      
      if (typeof onSelectItem === 'function') {
        onSelectItem(item);
      }
    } catch (error) {
      console.error('❌ Error seleccionando item:', error);
    }
  }, [onSelectItem]);

  /**
   * Maneja eventos de teclado en los resultados
   */
  const handleItemKeyPress = useCallback((e, item) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleItemClick(item);
    }
  }, [handleItemClick]);

  /**
   * Maneja la limpieza de resultados
   */
  const handleClearClick = useCallback(() => {
    try {
      console.log('🧹 Limpiando resultados');
      
      if (typeof onClearResults === 'function') {
        onClearResults();
      }
    } catch (error) {
      console.error('❌ Error limpiando resultados:', error);
    }
  }, [onClearResults]);

  /**
   * Maneja la creación manual
   */
  const handleManualCreateClick = useCallback(() => {
    try {
      console.log('✏️ Iniciando creación manual');
      
      if (typeof onManualCreate === 'function') {
        onManualCreate();
      }
    } catch (error) {
      console.error('❌ Error en creación manual:', error);
    }
  }, [onManualCreate]);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Formatea el año de lanzamiento
   */
  const formatYear = useCallback((item) => {
    const releaseDate = item?.release_date || item?.first_air_date;
    if (!releaseDate) return 'N/A';

    try {
      const year = new Date(releaseDate).getFullYear();
      return isNaN(year) ? 'N/A' : year.toString();
    } catch {
      return 'N/A';
    }
  }, []);

  /**
   * Formatea la calificación
   */
  const formatRating = useCallback((rating) => {
    if (!rating || typeof rating !== 'number' || isNaN(rating)) return 'N/A';
    return rating.toFixed(1);
  }, []);

  /**
   * Obtiene el tipo de contenido
   */
  const getContentType = useCallback((item) => {
    const type = item?.media_type || item?.type;
    switch (type) {
      case 'movie':
        return 'Película';
      case 'tv':
        return 'Serie';
      default:
        return 'Desconocido';
    }
  }, []);

  /**
   * Construye la URL del poster
   */
  const getPosterUrl = useCallback((posterPath) => {
    if (!posterPath || typeof posterPath !== 'string') return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }, []);

  /**
   * Trunca texto largo
   */
  const truncateText = useCallback((text, maxLength = 150) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  // ===== RENDERIZADO =====
  return (
    <div className="tmdb-search-view">
      
      {/* Formulario de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="tmdb-search-view__description">
              {description}
            </p>
          )}
        </CardHeader>
        
        <CardBody>
          <DynamicForm
            id="tmdb-search-form"
            fields={searchFormFields}
            initialData={searchFormData}
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            loading={loading}
            disabled={loading}
            columnsPerRow={3}
            tabletColumns={2}
            mobileColumns={1}
            fieldSize="md"
            fieldRounded="md"
            submitText={loading ? "Buscando..." : "🔍 Buscar"}
            submitDisabled={loading || !safeSearchQuery || safeSearchQuery.length < 2}
            showReset={false}
          />
          
          {/* Botones adicionales */}
          <div className="tmdb-search-view__actions">
            {safeResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon="🧹"
                onClick={handleClearClick}
                disabled={loading}
              >
                Limpiar Resultados
              </Button>
            )}
            
            {showManualCreate && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon="✏️"
                onClick={handleManualCreateClick}
                disabled={loading}
              >
                Crear Manualmente
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Estado de error */}
      {error && !loading && (
        <Card className="tmdb-search-view__error-card">
          <CardBody>
            <div className="tmdb-search-view__error">
              <div className="tmdb-search-view__error-icon">⚠️</div>
              <h3 className="tmdb-search-view__error-title">
                Error en la búsqueda
              </h3>
              <p className="tmdb-search-view__error-message">
                {error}
              </p>
              <div className="tmdb-search-view__error-actions">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon="🔄"
                  onClick={() => safeSearchQuery && onSearch()}
                  disabled={!safeSearchQuery}
                >
                  Reintentar
                </Button>
                {showManualCreate && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon="✏️"
                    onClick={handleManualCreateClick}
                  >
                    Crear Manualmente
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Resultados de búsqueda */}
      {!loading && !error && safeResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              📋 Resultados de Búsqueda ({safeResults.length})
            </CardTitle>
            <p>Selecciona una opción para continuar con la creación</p>
          </CardHeader>
          
          <CardBody>
            <div className="tmdb-search-view__results-grid">
              {safeResults.map((item) => {
                const year = formatYear(item);
                const rating = formatRating(item.rating || item.vote_average);
                const type = getContentType(item);
                const posterUrl = getPosterUrl(item.poster || item.poster_path);
                const overview = truncateText(item.overview);

                return (
                  <div
                    key={`${item.id}-${item.type || item.media_type}`}
                    className="tmdb-search-view__result-item"
                    onClick={() => handleItemClick(item)}
                    onKeyPress={(e) => handleItemKeyPress(e, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar ${item.title || item.name}`}
                  >
                    <div className="tmdb-search-view__result-content">
                      
                      {/* Imagen del poster */}
                      <div className="tmdb-search-view__result-poster">
                        <ContentImage
                          src={posterUrl}
                          alt={`Poster de ${item.title || item.name}`}
                          width={120}
                          height={180}
                          loading="lazy"
                          fallback="🎬"
                          className="tmdb-search-view__poster-image"
                        />
                      </div>

                      {/* Información del contenido */}
                      <div className="tmdb-search-view__result-info">
                        <h4 className="tmdb-search-view__result-title">
                          {item.title || item.name}
                        </h4>
                        
                        <div className="tmdb-search-view__result-meta">
                          <span className="tmdb-search-view__result-type">
                            {type === 'Película' ? '🎬' : '📺'} {type}
                          </span>
                          
                          {year !== 'N/A' && (
                            <span className="tmdb-search-view__result-year">
                              📅 {year}
                            </span>
                          )}
                          
                          {rating !== 'N/A' && (
                            <span className="tmdb-search-view__result-rating">
                              ⭐ {rating}
                            </span>
                          )}
                        </div>
                        
                        {overview && (
                          <p className="tmdb-search-view__result-overview">
                            {overview}
                          </p>
                        )}

                        <div className="tmdb-search-view__result-action">
                          <Button
                            variant="primary"
                            size="sm"
                            rightIcon="→"
                            tabIndex={-1}
                          >
                            Seleccionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Estado de carga */}
      {loading && (
        <Card className="tmdb-search-view__loading-card">
          <CardBody>
            <div className="tmdb-search-view__loading">
              <div className="tmdb-search-view__loading-icon">🔍</div>
              <h3 className="tmdb-search-view__loading-title">
                Buscando en TMDB...
              </h3>
              <p className="tmdb-search-view__loading-description">
                {safeSearchQuery ? 
                  `Estamos buscando "${safeSearchQuery}" en la base de datos de películas y series.` :
                  'Procesando búsqueda en la base de datos de TMDB.'
                }
              </p>
              <div className="tmdb-search-view__loading-spinner">
                {/* El CSS manejará la animación */}
                <div className="spinner"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Sin resultados */}
      {!loading && !error && safeSearchQuery && safeResults.length === 0 && (
        <Card className="tmdb-search-view__empty-card">
          <CardBody>
            <div className="tmdb-search-view__empty">
              <div className="tmdb-search-view__empty-icon">🔍</div>
              <h3 className="tmdb-search-view__empty-title">
                No se encontraron resultados
              </h3>
              <p className="tmdb-search-view__empty-description">
                No se encontró contenido para "<strong>{safeSearchQuery}</strong>".
              </p>
              <div className="tmdb-search-view__empty-suggestions">
                <h4>💡 Sugerencias:</h4>
                <ul>
                  <li>Verifica la ortografía del título</li>
                  <li>Usa el título original en inglés</li>
                  <li>Prueba con palabras clave más generales</li>
                  <li>Incluye el año si hay múltiples versiones</li>
                </ul>
              </div>
              <div className="tmdb-search-view__empty-actions">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="🔄"
                  onClick={() => onSearch()}
                >
                  Buscar de Nuevo
                </Button>
                {showManualCreate && (
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon="✏️"
                    onClick={handleManualCreateClick}
                  >
                    Crear Manualmente
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mensaje inicial */}
      {!loading && !error && !safeSearchQuery && safeResults.length === 0 && (
        <Card className="tmdb-search-view__welcome-card">
          <CardBody>
            <div className="tmdb-search-view__welcome">
              <div className="tmdb-search-view__welcome-icon">🎬</div>
              <h3 className="tmdb-search-view__welcome-title">
                ¡Busca contenido en TMDB!
              </h3>
              <p className="tmdb-search-view__welcome-description">
                Escribe el nombre de una película o serie para buscar información completa desde la base de datos de TMDB.
              </p>
              <div className="tmdb-search-view__welcome-tips">
                <h4>💡 Tips de búsqueda:</h4>
                <ul>
                  <li><strong>Títulos originales:</strong> Usa el título en inglés para mejores resultados</li>
                  <li><strong>Palabras clave:</strong> Prueba con géneros o actores si no encuentras el título</li>
                  <li><strong>Año específico:</strong> Incluye el año para diferenciar remakes</li>
                  <li><strong>Series:</strong> Usa el nombre de la serie, no de episodios específicos</li>
                </ul>
              </div>
              {showManualCreate && (
                <div className="tmdb-search-view__welcome-action">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon="✏️"
                    onClick={handleManualCreateClick}
                  >
                    ¿No encuentras lo que buscas? Crear Manualmente
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export { TMDBSearchView };