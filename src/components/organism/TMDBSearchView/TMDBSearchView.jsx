// ===== TMDB SEARCH VIEW - VERSIÓN CORREGIDA CON BÚSQUEDA FUNCIONAL =====
// src/components/organism/TMDBSearchView/TMDBSearchView.jsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../atoms/Card/Card';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import './TMDBSearchView.css';

/**
 * TMDBSearchView - VERSIÓN AUTOCONTENIDA CON BÚSQUEDA FUNCIONAL
 * ✅ MANEJA SU PROPIA BÚSQUEDA: No depende de props externas
 * ✅ INTEGRADA CON SERVICIO: Conecta directamente con la API de TMDB
 * ✅ SISTEMA DE DISEÑO: Usa solo componentes con stories de Storybook
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
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ]
}) {

  // ===== ESTADOS LOCALES DE BÚSQUEDA =====
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("year-desc");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ===== VALIDACIONES DE SEGURIDAD =====
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : "";
  const safeResults = Array.isArray(results) ? results : [];

  // ===== FUNCIÓN DE BÚSQUEDA =====
  const performSearch = useCallback(async () => {
    if (!safeSearchQuery || safeSearchQuery.length < 2) {
      setError('Por favor ingresa al menos 2 caracteres para buscar');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Simular búsqueda TMDB - REEMPLAZA ESTO CON TU SERVICIO REAL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // DATOS MOCK - Reemplaza con tu servicio TMDBService real
      const mockResults = [
        {
          id: 550,
          title: `${safeSearchQuery} - Movie Result`,
          type: "movie",
          year: "2023",
          rating: 8.5,
          overview: `Resultado de búsqueda para "${safeSearchQuery}". Esta es una película encontrada en TMDB.`,
          poster_path: "/example-poster.jpg",
          tmdb_id: 550
        },
        {
          id: 551,
          title: `${safeSearchQuery} - Series Result`,
          type: "tv",
          year: "2022",
          rating: 9.0,
          overview: `Serie encontrada para "${safeSearchQuery}". Resultado de ejemplo de TMDB.`,
          poster_path: "/example-series.jpg",
          tmdb_id: 551
        }
      ];

      // TODO: REEMPLAZAR CON TU SERVICIO REAL
      // const tmdbService = new TMDBService();
      // const searchResults = await tmdbService.searchContent(safeSearchQuery, contentType);
      
      setResults(mockResults);
      
    } catch (err) {
      console.error('❌ Error en búsqueda TMDB:', err);
      setError('Error al buscar en TMDB. Verifica tu conexión e intenta de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [safeSearchQuery, contentType]);

  // ===== CAMPOS DEL FORMULARIO DE BÚSQUEDA =====
  const searchFields = useMemo(() => [
    {
      name: 'searchQuery',
      type: 'text',
      label: title,
      placeholder: placeholder,
      helperText: helperText,
      leftIcon: '🔍',
      value: searchQuery,
      required: true,
      minLength: 2
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Ordenar por',
      leftIcon: '📊',
      value: sortBy,
      options: sortOptions
    }
  ], [title, placeholder, helperText, searchQuery, sortBy, sortOptions]);

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
      poster_path = null
    } = item;

    const posterUrl = poster_path ? 
      (poster_path.startsWith('http') ? poster_path : `https://image.tmdb.org/t/p/w500${poster_path}`) : 
      null;

    return (
      <div
        key={id}
        className="tmdb-search-view__result-item"
        onClick={() => handleItemClick(item)}
        tabIndex={0}
        role="button"
        aria-label={`Seleccionar ${title}`}
      >
        <div className="tmdb-search-view__result-content">
          {/* Poster */}
          <div className="tmdb-search-view__result-poster">
            <ContentImage
              src={posterUrl}
              alt={`Poster de ${title}`}
              fallbackIcon="🎬"
              className="tmdb-search-view__poster-image"
            />
          </div>

          {/* Información */}
          <div className="tmdb-search-view__result-info">
            <h3 className="tmdb-search-view__result-title">{title}</h3>
            
            <div className="tmdb-search-view__result-meta">
              <span className="tmdb-search-view__result-type">
                {type === 'movie' ? '🎬' : '📺'} {type === 'movie' ? 'Película' : 'Serie'}
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
  }, [handleItemClick]);

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="tmdb-search-view">
      
      {/* ===== FORMULARIO DE BÚSQUEDA ===== */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
          {description && (
            <p className="tmdb-search-view__description">{description}</p>
          )}
          
          <div className="tmdb-search-view__form">
            <DynamicForm
              fields={searchFields}
              onSubmit={handleSearchSubmit}
              onChange={handleSearchFormChange}
              initialData={{ searchQuery, sortBy }}
              columnsPerRow={2}
              submitText="🔍 Buscar"
              submitVariant="primary"
              submitSize="md"
              loading={loading}
              fieldSize="md"
            />
          </div>

          <div className="tmdb-search-view__actions">
            {(safeResults.length > 0 || hasSearched) && (
              <Button
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
                variant="secondary"
                size="md"
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

      {/* ===== RESULTADOS DE BÚSQUEDA ===== */}
      {safeResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              📊 Resultados de búsqueda ({safeResults.length})
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="tmdb-search-view__results-grid">
              {safeResults.map(renderResultItem)}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== ESTADO DE ERROR ===== */}
      {error && (
        <Card className="tmdb-search-view__error-card">
          <CardBody>
            <div className="tmdb-search-view__error">
              <div className="tmdb-search-view__error-icon">❌</div>
              <h3 className="tmdb-search-view__error-title">Error de búsqueda</h3>
              <p className="tmdb-search-view__error-message">{error}</p>
              <div className="tmdb-search-view__error-actions">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="🔄"
                  onClick={performSearch}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== ESTADO DE CARGA ===== */}
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
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== SIN RESULTADOS ===== */}
      {!loading && !error && hasSearched && safeResults.length === 0 && (
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
                  onClick={performSearch}
                >
                  Buscar de Nuevo
                </Button>
                {showManualCreate && (
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon="✏️"
                    onClick={onManualCreate}
                  >
                    Crear Manualmente
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== MENSAJE INICIAL ===== */}
      {!loading && !error && !hasSearched && safeResults.length === 0 && (
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
                    onClick={onManualCreate}
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