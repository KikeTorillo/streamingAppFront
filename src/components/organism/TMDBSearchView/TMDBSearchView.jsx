// ===== TMDB SEARCH VIEW - HOMOLOGADO CON SISTEMA DE DISEÑO =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { TextSelect } from '../../molecules/TextSelect/TextSelect';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - HOMOLOGADO CON SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Usa .form-container como CategoryCreatePage
 * ✅ HANDLERS SEGUROS: Validaciones y comunicación clara con padre
 * ✅ PROPS CONSISTENTES: Nombres claros y valores por defecto
 * ✅ CSS OPTIMIZADO: Solo estilos específicos de TMDB
 * ✅ RESPONSIVE: Mobile-first design heredado del sistema
 * 
 * @param {Object} props - Propiedades del componente
 */
function TMDBSearchView({
  // ===== ESTADOS DE BÚSQUEDA =====
  searchQuery = "",
  onSearchQueryChange = () => {},
  sortBy = "year-desc",
  onSortChange = () => {},
  results = [],
  loading = false,
  error = null,
  
  // ===== HANDLERS PRINCIPALES =====
  onSearch = () => {},
  onClearResults = () => {},
  onItemSelected = () => {}, // ← NOMBRE CORREGIDO (era onSelectItem)
  onManualCreate = () => {},
  
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

  // ===== HANDLERS LOCALES =====
  
  /**
   * Manejar búsqueda - CORREGIDO
   */
  const handleSearch = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (safeSearchQuery.trim()) {
      try {
        onSearch();
      } catch (error) {
        console.error('Error en búsqueda TMDB:', error);
      }
    }
  };

  /**
   * Manejar búsqueda con Enter - CORREGIDO
   */
  const handleKeyPress = (e) => {
    if (e && e.key === 'Enter') {
      handleSearch(e);
    }
  };

  /**
   * Manejar cambio en query de búsqueda - CORREGIDO
   */
  const handleSearchQueryChange = (value) => {
    // TextInput puede pasar evento o string
    const newValue = typeof value === 'string' ? value : 
                     (value && value.target ? value.target.value : '');
    
    try {
      onSearchQueryChange(newValue);
    } catch (error) {
      console.error('Error cambiando query:', error);
    }
  };

  /**
   * Manejar cambio de ordenamiento - CORREGIDO
   */
  const handleSortChange = (value) => {
    try {
      onSortChange(value);
    } catch (error) {
      console.error('Error cambiando sort:', error);
    }
  };

  /**
   * Manejar selección de item - CORREGIDO
   */
  const handleItemClick = (item) => {
    if (!item) return;
    
    try {
      console.log('🎬 Item seleccionado en TMDB:', item);
      onItemSelected(item); // ← NOMBRE CORREGIDO
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

  /**
   * Limpiar resultados
   */
  const handleClearResults = () => {
    try {
      onClearResults();
    } catch (error) {
      console.error('Error limpiando resultados:', error);
    }
  };

  /**
   * Crear manualmente
   */
  const handleManualCreate = () => {
    try {
      onManualCreate();
    } catch (error) {
      console.error('Error en creación manual:', error);
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

  // ===== RENDER =====
  return (
    <div className="tmdb-search-view">
      
      {/* ===== FORMULARIO DE BÚSQUEDA - SISTEMA DE DISEÑO ===== */}
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">
            {title}
          </h2>
          <p className="form-description">
            {description}
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="tmdb-search-view__form">
          <div className="tmdb-search-view__inputs">
            
            {/* Campo de búsqueda */}
            <TextInput
              label="Buscar Contenido"
              placeholder={placeholder}
              value={safeSearchQuery}
              onChange={handleSearchQueryChange}
              onKeyPress={handleKeyPress}
              leftIcon="🔍"
              helperText={helperText}
              disabled={loading}
              size="md"
              required
            />
            
            {/* Selector de ordenamiento */}
            <TextSelect
              label="Ordenar por"
              value={sortBy}
              onChange={handleSortChange}
              options={safeSortOptions}
              disabled={loading}
              size="md"
            />
            
          </div>

          {/* Botones de acción */}
          <div className="tmdb-search-view__actions">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon="🔍"
              loading={loading}
              disabled={!safeSearchQuery.trim() || loading}
              loadingText="Buscando..."
            >
              Buscar en TMDB
            </Button>

            {safeResults.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon="🗑️"
                onClick={handleClearResults}
                disabled={loading}
              >
                Limpiar Resultados
              </Button>
            )}

            {showManualCreate && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                leftIcon="✏️"
                onClick={handleManualCreate}
                disabled={loading}
              >
                Crear Manualmente
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* ===== MENSAJE DE ERROR - SISTEMA DE DISEÑO ===== */}
      {error && (
        <div className="status-message status-message--error">
          <span className="status-message__icon">⚠️</span>
          <div className="status-message__content">
            <strong>Error en la búsqueda</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ===== RESULTADOS - SOLO CARD PARA RESULTADOS ===== */}
      {safeResults.length > 0 && (
        <Card className="tmdb-search-view__results-card">
          <CardHeader>
            <CardTitle>
              🎬 Resultados de TMDB ({safeResults.length} encontrados)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="tmdb-search-view__results-grid">
              {safeResults.map((item) => {
                if (!item || !item.id) return null;

                const title = item.title || item.name || 'Sin título';
                const year = formatYear(item);
                const rating = formatRating(item.vote_average);
                const contentType = getContentType(item);
                const posterUrl = getPosterUrl(item);
                const overview = truncateOverview(item.overview);

                return (
                  <div
                    key={`tmdb-${item.id}`}
                    className="tmdb-search-view__result-item"
                    onClick={() => handleItemClick(item)}
                    onKeyPress={(e) => handleItemKeyPress(e, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar ${title} (${year})`}
                  >
                    {/* Poster */}
                    <div className="tmdb-search-view__result-poster">
                      <ContentImage
                        src={posterUrl}
                        alt={`Poster de ${title}`}
                        fallback="🎬"
                        className="tmdb-search-view__poster-image"
                      />
                    </div>
                    
                    {/* Información */}
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