// ===== TMDB SEARCH VIEW - VERSIÓN ACTUALIZADA CON API REAL =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import { tmdbService } from '../../../services/tmdb/TMDBService';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - VERSIÓN ACTUALIZADA CON API REAL DE TMDB
 * ✅ SERVICIO REAL: Conecta con la API de TMDB usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas, series o contenido mixto
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ MANEJO DE ERRORES: Errores de red, API key inválida, etc.
 * ✅ UX OPTIMIZADA: Loading states, debouncing, validaciones
 */
function TMDBSearchView({
  // Handlers principales
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
    { value: "popularity", label: "Más populares" },
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ]
}) {

  // ===== ESTADOS LOCALES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);

  // ===== VALIDACIONES DE SEGURIDAD =====
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : "";
  const safeResults = Array.isArray(results) ? results : [];

  // ===== VERIFICAR API KEY AL CARGAR =====
  useEffect(() => {
    const checkApiKey = () => {
      const hasApiKey = !!import.meta.env.VITE_TMDB_API_KEY;
      setIsApiKeyValid(hasApiKey);
      
      if (!hasApiKey) {
        setError('⚠️ API Key de TMDB no configurada. Asegúrate de tener VITE_TMDB_API_KEY en tu archivo .env');
      }
    };

    checkApiKey();
  }, []);

  // ===== FUNCIÓN DE BÚSQUEDA REAL =====
  const performSearch = useCallback(async () => {
    if (!safeSearchQuery || safeSearchQuery.length < 2) {
      setError('Por favor ingresa al menos 2 caracteres para buscar');
      return;
    }

    if (!isApiKeyValid) {
      setError('No se puede realizar la búsqueda: API Key de TMDB no configurada');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`🔍 Realizando búsqueda TMDB: "${safeSearchQuery}"`);

      // Usar el servicio real de TMDB
      const searchResults = await tmdbService.searchContent(
        safeSearchQuery, 
        contentType,
        { sortBy }
      );

      setResults(searchResults);

      if (searchResults.length === 0) {
        setError(`No se encontraron resultados para "${safeSearchQuery}". Intenta con otros términos.`);
      }
      
    } catch (err) {
      console.error('❌ Error en búsqueda TMDB:', err);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido al buscar en TMDB.';
      
      if (err.message.includes('API Key')) {
        errorMessage = '🔑 Error de autenticación con TMDB. Verifica tu API Key.';
        setIsApiKeyValid(false);
      } else if (err.message.includes('HTTP 429')) {
        errorMessage = '⏱️ Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
      } else if (err.message.includes('HTTP 5')) {
        errorMessage = '🛠️ Error del servidor de TMDB. Intenta más tarde.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = '🌐 Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [safeSearchQuery, contentType, sortBy, isApiKeyValid]);

  // ===== CAMPOS DEL FORMULARIO DE BÚSQUEDA =====
  const searchFields = useMemo(() => [
    {
      name: 'searchQuery',
      type: 'text',
      label: title,
      placeholder: placeholder,
      helperText: isApiKeyValid ? helperText : '⚠️ Configura VITE_TMDB_API_KEY para habilitar búsqueda',
      leftIcon: '🔍',
      value: searchQuery,
      required: true,
      minLength: 2,
      disabled: !isApiKeyValid
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Ordenar por',
      leftIcon: '📊',
      value: sortBy,
      options: sortOptions,
      disabled: !isApiKeyValid
    }
  ], [title, placeholder, helperText, searchQuery, sortBy, sortOptions, isApiKeyValid]);

  // ===== HANDLERS =====
  const handleSearchFormChange = useCallback((formData) => {
    if (formData.searchQuery !== undefined) {
      setSearchQuery(formData.searchQuery);
    }
    if (formData.sortBy !== undefined) {
      setSortBy(formData.sortBy);
    }
  }, []);

  const handleSearchSubmit = useCallback((formData) => {
    performSearch();
  }, [performSearch]);

  const handleClearResults = useCallback(() => {
    setResults([]);
    setSearchQuery("");
    setError(null);
    setHasSearched(false);
  }, []);

  const handleItemClick = useCallback((item) => {
    console.log('🎯 Item seleccionado desde TMDB:', item);
    onSelectItem(item);
  }, [onSelectItem]);

  // ===== FUNCIONES DE RENDERIZADO =====
  const renderResultItem = useCallback((item) => {
    const {
      id,
      title = item.name || 'Sin título',
      type = 'movie',
      year = 'N/A',
      rating = 'N/A',
      overview = '',
      poster_path = null,
      tmdb_id = id
    } = item;

    const posterUrl = poster_path || null;
    const contentTypeLabel = type === 'tv' ? 'Serie' : type === 'movie' ? 'Película' : 'Contenido';
    const displayRating = typeof rating === 'number' ? rating.toFixed(1) : rating;

    return (
      <div 
        key={`tmdb-${id}-${type}`}
        className="tmdb-search-view__result-item"
        onClick={() => handleItemClick(item)}
        tabIndex={0}
        role="button"
        aria-label={`Seleccionar ${contentTypeLabel}: ${title} (${year})`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(item);
          }
        }}
      >
        <div className="tmdb-search-view__result-content">
          <div className="tmdb-search-view__result-poster">
            <ContentImage
              src={posterUrl}
              alt={`Poster de ${title}`}
              className="tmdb-search-view__poster-image"
              fallbackIcon="🎬"
              loading="lazy"
            />
          </div>
          
          <div className="tmdb-search-view__result-info">
            <h3 className="tmdb-search-view__result-title" title={title}>
              {title}
            </h3>
            
            <div className="tmdb-search-view__result-meta">
              <span className="tmdb-search-view__result-type">
                {contentTypeLabel}
              </span>
              <span className="tmdb-search-view__result-year">
                {year}
              </span>
              {displayRating !== 'N/A' && (
                <span className="tmdb-search-view__result-rating">
                  ⭐ {displayRating}
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
                variant="outline" 
                size="sm"
                leftIcon="✅"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
              >
                Seleccionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [handleItemClick]);

  // ===== ESTADOS DE LA INTERFAZ =====
  const renderWelcomeState = () => (
    <Card className="tmdb-search-view__welcome-card">
      <CardBody>
        <div className="tmdb-search-view__welcome">
          <div className="tmdb-search-view__welcome-icon">🎬</div>
          <h3 className="tmdb-search-view__welcome-title">
            Buscar en The Movie Database
          </h3>
          <p className="tmdb-search-view__welcome-description">
            Ingresa el nombre de una película o serie para buscar en la base de datos más completa del mundo.
          </p>
          
          <div className="tmdb-search-view__welcome-tips">
            <h4>💡 Consejos para mejores resultados:</h4>
            <ul>
              <li>Usa el título original en inglés para mejores resultados</li>
              <li>Incluye el año si hay múltiples versiones</li>
              <li>Busca por palabras clave si no recuerdas el título exacto</li>
              <li>Prueba con títulos alternativos o abreviaciones</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderLoadingState = () => (
    <Card className="tmdb-search-view__loading-card">
      <CardBody>
        <div className="tmdb-search-view__loading">
          <div className="tmdb-search-view__loading-icon">⏳</div>
          <h3 className="tmdb-search-view__loading-title">
            Buscando en TMDB...
          </h3>
          <p className="tmdb-search-view__loading-description">
            Consultando la base de datos de The Movie Database
          </p>
          <div className="tmdb-search-view__loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderErrorState = () => (
    <Card className="tmdb-search-view__error-card">
      <CardBody>
        <div className="tmdb-search-view__error">
          <div className="tmdb-search-view__error-icon">❌</div>
          <h3 className="tmdb-search-view__error-title">
            Error en la búsqueda
          </h3>
          <p className="tmdb-search-view__error-message">
            {error}
          </p>
          
          <div className="tmdb-search-view__error-actions">
            <Button 
              variant="outline" 
              size="sm"
              leftIcon="🔄"
              onClick={performSearch}
              disabled={!isApiKeyValid}
            >
              Intentar de nuevo
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon="🗑️"
              onClick={handleClearResults}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderEmptyState = () => (
    <Card className="tmdb-search-view__empty-card">
      <CardBody>
        <div className="tmdb-search-view__empty">
          <div className="tmdb-search-view__empty-icon">🔍</div>
          <h3 className="tmdb-search-view__empty-title">
            Sin resultados
          </h3>
          <p className="tmdb-search-view__empty-description">
            No se encontraron resultados para "{safeSearchQuery}".
          </p>
          
          <div className="tmdb-search-view__empty-suggestions">
            <h4>Intenta con:</h4>
            <ul>
              <li>Verificar la ortografía del título</li>
              <li>Usar el título en inglés</li>
              <li>Buscar con menos palabras</li>
              <li>Usar palabras clave generales</li>
            </ul>
          </div>
          
          <div className="tmdb-search-view__empty-actions">
            <Button 
              variant="outline" 
              size="sm"
              leftIcon="🔄"
              onClick={handleClearResults}
            >
              Nueva búsqueda
            </Button>
            {showManualCreate && (
              <Button 
                variant="secondary" 
                size="sm"
                leftIcon="✏️"
                onClick={onManualCreate}
              >
                Crear manualmente
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  // ===== RENDER PRINCIPAL =====
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
            fields={searchFields}
            onSubmit={handleSearchSubmit}
            onChange={handleSearchFormChange}
            className="tmdb-search-view__form"
          />
          
          <div className="tmdb-search-view__actions">
            <Button 
              type="submit"
              variant="primary"
              leftIcon="🔍"
              loading={loading}
              disabled={!safeSearchQuery || safeSearchQuery.length < 2 || !isApiKeyValid}
              onClick={performSearch}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            
            {hasSearched && (
              <Button 
                variant="ghost"
                leftIcon="🗑️"
                onClick={handleClearResults}
                disabled={loading}
              >
                Limpiar
              </Button>
            )}
            
            {showManualCreate && (
              <Button 
                variant="secondary"
                leftIcon="✏️"
                onClick={onManualCreate}
                disabled={loading}
              >
                Crear manualmente
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Estados de contenido */}
      {loading && renderLoadingState()}
      
      {error && !loading && renderErrorState()}
      
      {!loading && !error && !hasSearched && renderWelcomeState()}
      
      {!loading && !error && hasSearched && safeResults.length === 0 && renderEmptyState()}
      
      {/* Resultados */}
      {!loading && !error && safeResults.length > 0 && (
        <div className="tmdb-search-view__results-grid">
          {safeResults.map(renderResultItem)}
        </div>
      )}
    </div>
  );
}

export { TMDBSearchView };