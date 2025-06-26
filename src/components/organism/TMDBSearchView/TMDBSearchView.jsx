// ===== TMDB SEARCH VIEW - REFACTORIZADO CON DYNAMICFORM =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React, { useMemo } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - REFACTORIZADO CON DYNAMICFORM
 * 
 * ✅ DYNAMICFORM: Formulario unificado con el sistema de diseño
 * ✅ CONSISTENCIA: Mismo patrón que CategoryCreatePage, UserCreatePage
 * ✅ MANTENIBILIDAD: -60 líneas CSS, -30 líneas JSX
 * ✅ FUNCIONALIDADES: Validación automática, estados visuales
 * ✅ RESPONSIVE: Heredado automáticamente de DynamicForm
 * 
 * @param {Object} props - Propiedades del componente
 */
function TMDBSearchView({
  // ===== ESTADOS DE BÚSQUEDA =====
  searchQuery = "",
  onSearchQueryChange = () => { },
  sortBy = "year-desc",
  onSortChange = () => { },
  results = [],
  loading = false,
  error = null,

  // ===== HANDLERS PRINCIPALES =====
  onSearch = () => { },
  onClearResults = () => { },
  onItemSelected = () => { },
  onManualCreate = () => { },

  // ===== CONFIGURACIÓN =====
  contentType = "all",
  title = "🎬 Buscar en TMDB",
  description = "Busca películas y series en la base de datos de TMDB para agregar al catálogo",
  placeholder = "Ej: Avatar, Breaking Bad, Inception...",
  helperText = "Busca por título, año o palabras clave",
  showManualCreate = true,

  // ===== OPCIONES =====
  sortOptions = [
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ]
}) {

  // ===== VALIDACIONES DE SEGURIDAD =====
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : "";
  const safeResults = Array.isArray(results) ? results : [];
  const safeSortOptions = Array.isArray(sortOptions) ? sortOptions : [];

  // ===== CONFIGURACIÓN DEL FORMULARIO DINÁMICO =====
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
      validation: {
        required: { value: true, message: 'Ingresa un término de búsqueda' },
        minLength: { value: 2, message: 'Mínimo 2 caracteres para buscar' }
      },
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

  // ===== HANDLERS PARA DYNAMICFORM =====

  /**
   * Manejar envío del formulario
   */
  const handleFormSubmit = (formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      // Sincronizar estados con el padre
      if (newQuery !== safeSearchQuery) {
        onSearchQueryChange(newQuery);
      }
      if (newSortBy !== sortBy) {
        onSortChange(newSortBy);
      }

      // Ejecutar búsqueda si hay query válido
      if (newQuery?.trim() && newQuery.length >= 2) {
        onSearch();
      }
    } catch (error) {
      console.error('Error en búsqueda TMDB:', error);
    }
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    const { searchQuery: newQuery, sortBy: newSortBy } = formData;

    try {
      // Sincronizar estados en tiempo real
      if (newQuery !== safeSearchQuery) {
        onSearchQueryChange(newQuery);
      }
      if (newSortBy !== sortBy) {
        onSortChange(newSortBy);
      }
    } catch (error) {
      console.error('Error cambiando formulario TMDB:', error);
    }
  };

  /**
   * Limpiar resultados de búsqueda
   */
  const handleClearResults = () => {
    try {
      onClearResults();
    } catch (error) {
      console.error('Error limpiando resultados:', error);
    }
  };

  /**
   * Crear contenido manualmente
   */
  const handleManualCreate = () => {
    try {
      onManualCreate();
    } catch (error) {
      console.error('Error en creación manual:', error);
    }
  };

  // ===== HANDLERS PARA RESULTADOS =====

  /**
   * Manejar selección de item
   */
  const handleItemClick = (item) => {
    if (!item) return;

    try {
      console.log('🎬 Item seleccionado en TMDB:', item);
      onItemSelected(item);
    } catch (error) {
      console.error('Error seleccionando item TMDB:', error);
    }
  };

  /**
   * Manejar selección con teclado
   */
  const handleItemKeyPress = (e, item) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear año de lanzamiento
   */
  const formatYear = (item) => {
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return 'N/A';

    try {
      return new Date(releaseDate).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  /**
   * Formatear rating
   */
  const formatRating = (rating) => {
    if (!rating || typeof rating !== 'number') return 'N/A';
    return rating.toFixed(1);
  };

  /**
   * Obtener tipo de contenido
   */
  const getContentType = (item) => {
    const type = item.media_type || item.type;
    switch (type) {
      case 'movie': return '🎬 Película';
      case 'tv': return '📺 Serie';
      default: return '🎭 Contenido';
    }
  };

  /**
   * Obtener URL del poster
   */
  const getPosterUrl = (item) => {
    if (!item.poster_path) return null;
    return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  };

  /**
   * Truncar descripción
   */
  const truncateOverview = (overview, maxLength = 150) => {
    if (!overview || overview.length <= maxLength) return overview;
    return overview.substring(0, maxLength) + '...';
  };

  // ===== ACCIONES ADICIONALES DEL FORMULARIO =====
  const formAdditionalActions = (
    <div className="tmdb-search-actions">
      <Button
        variant="outline"
        onClick={handleClearResults}
        disabled={loading || !safeResults.length}
        leftIcon="🗑️"
      >
        Limpiar Resultados
      </Button>
      {showManualCreate && (
        <Button
          variant="ghost"
          onClick={handleManualCreate}
          leftIcon="✏️"
        >
          Crear Manualmente
        </Button>
      )}
    </div>
  );

  // ===== RENDER =====
  return (
    <div className="tmdb-search-view">

      {/* ===== FORMULARIO DE BÚSQUEDA - DYNAMICFORM ===== */}
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">
            {title}
          </h2>
          <p className="form-description">
            {description}
          </p>
        </div>

        <DynamicForm
          id="tmdb-search-form"
          fields={searchFormFields}
          initialData={searchFormData}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          loading={loading}
          columnsPerRow={2}
          tabletColumns={2}
          mobileColumns={1}
          fieldSize="md"
          fieldRounded="md"
          submitText={loading ? "🔍 Buscando..." : "🔍 Buscar"}
          submitVariant="primary"
          submitSize="md"
          showSubmit={true}
          validateOnChange={false}
          validateOnBlur={true}
          additionalActions={formAdditionalActions}
          className="tmdb-search-form"
        />
      </div>

      {/* ===== MENSAJE DE ERROR ===== */}
      {error && (
        <div className="status-message status-message--error">
          <span className="status-message__icon">⚠️</span>
          <div className="status-message__content">
            <strong>Error en la búsqueda</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ===== RESULTADOS DE BÚSQUEDA ===== */}
      {!loading && !error && safeResults.length > 0 && (
        <Card className="tmdb-search-view__results-card">
          <CardHeader>
            <CardTitle>
              📽️ Resultados de Búsqueda ({safeResults.length})
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="tmdb-search-view__results-grid">
              {safeResults.map((item) => {
                const title = item.title || item.name || 'Sin título';
                const year = formatYear(item);
                const rating = formatRating(item.vote_average);
                const overview = truncateOverview(item.overview);
                const contentType = getContentType(item);
                const posterUrl = getPosterUrl(item);

                return (
                  <div
                    key={item.id}
                    className="tmdb-search-view__result-item"
                    onClick={() => handleItemClick(item)}
                    onKeyPress={(e) => handleItemKeyPress(e, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar ${title} (${year})`}
                  >
                    <div className="tmdb-search-view__result-poster">
                      <ContentImage
                        src={posterUrl}
                        alt={`Poster de ${title}`}
                        className="tmdb-search-view__poster-image"
                        loading="lazy"
                        fallback="🎬"
                      />
                    </div>

                    <div className="tmdb-search-view__result-info">
                      <h3 className="tmdb-search-view__result-title">
                        {title}
                      </h3>

                      <div className="tmdb-search-view__result-meta">
                        <span>{contentType}</span>
                        <span>📅 {year}</span>
                        <span>⭐ {rating}</span>
                      </div>

                      {overview && (
                        <p className="tmdb-search-view__result-overview">
                          {overview}
                        </p>
                      )}

                      {/* Indicador de selección */}
                      <div className="tmdb-search-view__result-action">
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon="→"
                          tabIndex={-1} // Evitar doble focus
                        >
                          Seleccionar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== ESTADO DE LOADING ===== */}
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

      {/* ===== MENSAJE DE BÚSQUEDA VACÍA ===== */}
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
                  onClick={handleManualCreate}
                  className="tmdb-search-view__empty-action"
                >
                  Crear Manualmente
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export { TMDBSearchView };