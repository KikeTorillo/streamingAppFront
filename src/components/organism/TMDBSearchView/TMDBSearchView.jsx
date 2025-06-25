// ===== TMDB SEARCH VIEW - VERSIÓN CORREGIDA =====
// src/components/organisms/TMDBSearchView/TMDBSearchView.jsx

import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { TextSelect } from '../../molecules/TextSelect/TextSelect';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - Organism para búsqueda en TMDB (VERSIÓN CORREGIDA)
 * 
 * ✅ DEFENSIVO: Maneja props undefined/null de forma segura
 * ✅ REUTILIZABLE: Para películas, series, documentales, etc.
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ ERROR SAFE: Validaciones en todos los handlers
 */
function TMDBSearchView(props = {}) {
  // ===== DESTRUCTURING DEFENSIVO =====
  const {
    // Estados de búsqueda - valores por defecto seguros
    searchQuery = "",
    onSearchQueryChange = () => {},
    sortBy = "year-desc",
    onSortChange = () => {},
    results = [],
    loading = false,
    
    // Opciones de configuración - valores por defecto
    sortOptions = [
      { value: "year-desc", label: "Más recientes" },
      { value: "year-asc", label: "Más antiguos" },
      { value: "rating-desc", label: "Mejor puntuados" }
    ],
    
    // Handlers principales - funciones vacías por defecto
    onSearch = () => {},
    onClearResults = () => {},
    onSelectItem = () => {},
    onManualCreate = () => {},
    
    // Configuración personalizable - valores seguros
    contentType = "all",
    title = "🎬 Buscar en TMDB",
    placeholder = "Ej: Avatar, Breaking Bad, Inception...",
    helperText = "Busca por título, año o palabras clave",
    showManualCreate = true,
    
    // Estados adicionales
    error = null
  } = props;

  // ===== VALIDACIONES DE SEGURIDAD =====
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : "";
  const safeResults = Array.isArray(results) ? results : [];
  const safeSortOptions = Array.isArray(sortOptions) ? sortOptions : [];

  // ===== HANDLERS LOCALES SEGUROS =====
  const handleSearch = (e) => {
    try {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      
      if (safeSearchQuery.trim() && typeof onSearch === 'function') {
        onSearch();
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
  };

  const handleKeyPress = (e) => {
    try {
      if (e && e.key === 'Enter' && safeSearchQuery.trim() && typeof onSearch === 'function') {
        onSearch();
      }
    } catch (error) {
      console.error('Error in handleKeyPress:', error);
    }
  };

  const handleItemClick = (item) => {
    try {
      if (item && typeof onSelectItem === 'function') {
        onSelectItem(item);
      }
    } catch (error) {
      console.error('Error in handleItemClick:', error);
    }
  };

  const handleItemKeyPress = (e, item) => {
    try {
      if (e && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleItemClick(item);
      }
    } catch (error) {
      console.error('Error in handleItemKeyPress:', error);
    }
  };

  const handleClearClick = () => {
    try {
      if (typeof onClearResults === 'function') {
        onClearResults();
      }
    } catch (error) {
      console.error('Error in handleClearClick:', error);
    }
  };

  const handleManualClick = () => {
    try {
      if (typeof onManualCreate === 'function') {
        onManualCreate();
      }
    } catch (error) {
      console.error('Error in handleManualClick:', error);
    }
  };

  const handleSearchQueryChange = (e) => {
    try {
      // TextInput pasa el evento completo, extraemos el valor
      const value = e && e.target ? e.target.value : (typeof e === 'string' ? e : "");
      if (typeof onSearchQueryChange === 'function') {
        onSearchQueryChange(value || "");
      }
    } catch (error) {
      console.error('Error in handleSearchQueryChange:', error);
    }
  };

  const handleSortChange = (value) => {
    try {
      // TextSelect pasa el valor directamente
      if (typeof onSortChange === 'function') {
        onSortChange(value || "year-desc");
      }
    } catch (error) {
      console.error('Error in handleSortChange:', error);
    }
  };

  // ===== FUNCIONES AUXILIARES SEGURAS =====
  const getItemTypeLabel = (type) => {
    if (!type) return '🎭 Contenido';
    
    switch (type.toLowerCase()) {
      case 'movie':
        return '🎬 Película';
      case 'tv':
        return '📺 Serie';
      default:
        return '🎭 Contenido';
    }
  };

  const getContentTypeFilter = () => {
    if (!contentType) return 'contenido';
    
    switch (contentType.toLowerCase()) {
      case 'movie':
        return 'películas';
      case 'series':
      case 'tv':
        return 'series';
      default:
        return 'contenido';
    }
  };

  const formatRating = (rating) => {
    if (!rating || isNaN(rating)) return 'N/A';
    return Number(rating).toFixed(1);
  };

  const formatYear = (year) => {
    if (!year) return 'N/A';
    return String(year);
  };

  const formatOverview = (overview, maxLength = 120) => {
    if (!overview || typeof overview !== 'string') {
      return 'Sin descripción disponible';
    }
    
    if (overview.length <= maxLength) {
      return overview;
    }
    
    return `${overview.substring(0, maxLength)}...`;
  };

  const getSafeImageSrc = (src) => {
    if (!src || typeof src !== 'string') {
      return null;
    }
    return src;
  };

  // ===== RENDER SEGURO =====
  return (
    <div className="form-container">
      
      {/* ===== SECCIÓN DE BÚSQUEDA ===== */}
      <Card variant="elevated" size="lg">
        <CardHeader>
          <CardTitle>{title || "🎬 Buscar en TMDB"}</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSearch} className="tmdb-search-view__form">
            
            {/* Inputs de búsqueda */}
            <div className="tmdb-search-view__inputs">
              <TextInput
                label={`Buscar ${getContentTypeFilter()}`}
                placeholder={placeholder || "Buscar..."}
                value={safeSearchQuery}
                onChange={handleSearchQueryChange}
                onKeyPress={handleKeyPress}
                leftIcon="🔍"
                disabled={loading}
                required
                helperText={helperText || "Busca por título"}
                className="tmdb-search-view__input"
              />
              
              {safeSortOptions.length > 0 && (
                <TextSelect
                  label="Ordenar por"
                  value={sortBy || "year-desc"}
                  onChange={handleSortChange}
                  options={safeSortOptions}
                  disabled={loading}
                  className="tmdb-search-view__sort"
                />
              )}
            </div>
            
            {/* Acciones de búsqueda */}
            <div className="tmdb-search-view__actions">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                disabled={!safeSearchQuery.trim() || loading}
                leftIcon="🔍"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
              
              {safeResults.length > 0 && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleClearClick}
                  disabled={loading}
                  leftIcon="🗑️"
                >
                  Limpiar
                </Button>
              )}
              
              {showManualCreate && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleManualClick}
                  disabled={loading}
                  leftIcon="✏️"
                >
                  Crear Manualmente
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* ===== RESULTADOS DE BÚSQUEDA ===== */}
      {safeResults.length > 0 && (
        <Card variant="default" size="lg">
          <CardHeader>
            <CardTitle>
              📋 Resultados ({safeResults.length} encontrados)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="tmdb-search-view__results">
              {safeResults.map((item, index) => {
                // Validación de item segura
                if (!item || typeof item !== 'object') {
                  return null;
                }

                const itemId = item.id || index;
                const itemTitle = item.title || item.name || 'Sin título';
                const itemType = item.type || item.media_type || 'unknown';
                const itemYear = formatYear(item.year);
                const itemRating = formatRating(item.rating || item.vote_average);
                const itemOverview = formatOverview(item.overview);
                const itemPoster = getSafeImageSrc(item.poster || item.poster_path);

                return (
                  <div
                    key={`${itemType}-${itemId}`}
                    className="tmdb-search-view__result-item"
                    onClick={() => handleItemClick(item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar ${itemTitle}`}
                    onKeyPress={(e) => handleItemKeyPress(e, item)}
                  >
                    {/* Poster */}
                    <ContentImage
                      src={itemPoster}
                      alt={itemTitle}
                      className="tmdb-search-view__result-poster"
                      fallbackIcon="🎬"
                    />
                    
                    {/* Información */}
                    <div className="tmdb-search-view__result-info">
                      <h3 className="tmdb-search-view__result-title">
                        {itemTitle}
                      </h3>
                      <p className="tmdb-search-view__result-meta">
                        {getItemTypeLabel(itemType)} • {itemYear} • ⭐ {itemRating}
                      </p>
                      <p className="tmdb-search-view__result-overview">
                        {itemOverview}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export { TMDBSearchView };