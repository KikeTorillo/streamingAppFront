// ===== TMDB SEARCH VIEW - VERSIÓN LIMPIA SIN ERRORES =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React, { useMemo } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - VERSIÓN CORREGIDA Y SIMPLIFICADA
 * Búsqueda en TMDB con integración perfecta con MovieCreatePage
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

  // Validaciones de seguridad
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : "";
  const safeResults = Array.isArray(results) ? results : [];
  const safeSortOptions = Array.isArray(sortOptions) ? sortOptions : [];

  // Configuración del formulario
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
      width: 'two-thirds',
      autoFocus: true
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Ordenar Resultados',
      options: safeSortOptions,
      helperText: 'Criterio para ordenar los resultados',
      width: 'one-third'
    }
  ], [placeholder, helperText, safeSortOptions]);

  const searchFormData = useMemo(() => ({
    searchQuery: safeSearchQuery,
    sortBy: sortBy
  }), [safeSearchQuery, sortBy]);

  // Handlers del formulario
  const handleFormSubmit = (formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      console.log('🔍 Enviando búsqueda:', formData);
      
      // Sincronizar estados
      if (newQuery !== safeSearchQuery) {
        onSearchQueryChange(newQuery);
      }
      if (newSortBy !== sortBy) {
        onSortChange(newSortBy);
      }

      // Ejecutar búsqueda si hay query válido
      if (newQuery && newQuery.trim().length >= 2) {
        setTimeout(() => onSearch(), 100);
      }
    } catch (error) {
      console.error('Error en búsqueda TMDB:', error);
    }
  };

  const handleFormChange = (formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      if (newQuery !== safeSearchQuery) {
        onSearchQueryChange(newQuery);
      }
      if (newSortBy !== sortBy) {
        onSortChange(newSortBy);
      }
    } catch (error) {
      console.error('Error cambiando formulario:', error);
    }
  };

  // Handlers de resultados
  const handleItemClick = (item) => {
    if (!item) return;
    
    try {
      console.log('🎬 Item seleccionado:', item);
      onSelectItem(item);
    } catch (error) {
      console.error('Error seleccionando item:', error);
    }
  };

  const handleItemKeyPress = (e, item) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  // Funciones auxiliares
  const formatYear = (item) => {
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return 'N/A';

    try {
      return new Date(releaseDate).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  const formatRating = (rating) => {
    if (!rating || typeof rating !== 'number') return 'N/A';
    return rating.toFixed(1);
  };

  const getContentType = (item) => {
    const type = item.media_type || item.type;
    switch (type) {
      case 'movie':
        return 'Película';
      case 'tv':
        return 'Serie';
      default:
        return 'Desconocido';
    }
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  return (
    <div className="tmdb-search-view">
      
      {/* Formulario de búsqueda */}
      <Card className="tmdb-search-view__search-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="tmdb-search-view__description">
            {description}
          </p>
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
            submitText={loading ? "Buscando..." : "Buscar"}
            submitVariant="primary"
            submitSize="md"
            submitIcon="🔍"
            validateOnBlur={false}
            validateOnChange={false}
            className="tmdb-search-view__form"
          />

          {/* Acciones adicionales */}
          <div className="tmdb-search-view__actions">
            {safeResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon="🗑️"
                onClick={onClearResults}
                disabled={loading}
              >
                Limpiar Resultados
              </Button>
            )}
            
            {showManualCreate && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon="✏️"
                onClick={onManualCreate}
                disabled={loading}
              >
                Crear Manualmente
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Card className="tmdb-search-view__error-card">
          <CardBody>
            <div className="tmdb-search-view__error">
              <div className="tmdb-search-view__error-icon">⚠️</div>
              <div className="tmdb-search-view__error-content">
                <h3 className="tmdb-search-view__error-title">
                  Error en la búsqueda
                </h3>
                <p className="tmdb-search-view__error-message">
                  {error}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Resultados de búsqueda */}
      {safeResults.length > 0 && !loading && !error && (
        <Card className="tmdb-search-view__results-card">
          <CardHeader>
            <CardTitle>
              🎬 Resultados de Búsqueda ({safeResults.length})
            </CardTitle>
            <p className="tmdb-search-view__results-description">
              Haz clic en una película o serie para seleccionarla
            </p>
          </CardHeader>
          
          <CardBody>
            <div className="tmdb-search-view__results-grid">
              {safeResults.map((item) => {
                const title = item.title || item.name || 'Sin título';
                const year = formatYear(item);
                const rating = formatRating(item.vote_average);
                const type = getContentType(item);
                const overview = item.overview || '';
                const posterUrl = getPosterUrl(item.poster_path);

                return (
                  <div
                    key={`${item.id}-${item.media_type || 'unknown'}`}
                    className="tmdb-search-view__result-item"
                    onClick={() => handleItemClick(item)}
                    onKeyPress={(e) => handleItemKeyPress(e, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar ${title} (${year})`}
                  >
                    <div className="tmdb-search-view__result-content">
                      {/* Poster */}
                      <div className="tmdb-search-view__result-poster">
                        <ContentImage
                          src={posterUrl}
                          alt={`Poster de ${title}`}
                          fallback="🎬"
                          width="120"
                          height="180"
                          className="tmdb-search-view__poster-image"
                        />
                      </div>

                      {/* Información */}
                      <div className="tmdb-search-view__result-info">
                        <h4 className="tmdb-search-view__result-title">
                          {title}
                        </h4>
                        
                        <div className="tmdb-search-view__result-meta">
                          {year !== 'N/A' && (
                            <span className="tmdb-search-view__result-year">
                              📅 {year}
                            </span>
                          )}
                          <span className="tmdb-search-view__result-type">
                            {type === 'Película' ? '🎬' : '📺'} {type}
                          </span>
                          {rating !== 'N/A' && (
                            <span className="tmdb-search-view__result-rating">
                              ⭐ {rating}
                            </span>
                          )}
                        </div>
                        
                        {overview && (
                          <p className="tmdb-search-view__result-overview">
                            {overview.length > 150 
                              ? `${overview.substring(0, 150)}...` 
                              : overview
                            }
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

      {/* Estado de loading */}
      {loading && (
        <Card className="tmdb-search-view__loading-card">
          <CardBody>
            <div className="tmdb-search-view__loading">
              <div className="tmdb-search-view__loading-icon">🔍</div>
              <h3 className="tmdb-search-view__loading-title">
                Buscando en TMDB...
              </h3>
              <p className="tmdb-search-view__loading-description">
                Estamos buscando "{safeSearchQuery}" en la base de datos de películas y series.
              </p>
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
                No se encontró contenido para "{safeSearchQuery}".
                Intenta con otros términos de búsqueda o crea el contenido manualmente.
              </p>
              {showManualCreate && (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon="✏️"
                  onClick={onManualCreate}
                  className="tmdb-search-view__empty-action"
                >
                  Crear Manualmente
                </Button>
              )}
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
                  <li>Usa el título original en inglés para mejores resultados</li>
                  <li>Prueba con palabras clave si no encuentras el título exacto</li>
                  <li>Incluye el año si hay múltiples versiones</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export { TMDBSearchView };