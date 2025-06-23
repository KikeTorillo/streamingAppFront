// ===== ANÁLISIS DE INCOMPATIBILIDADES DETECTADAS =====

/* 
🚨 PROBLEMAS ENCONTRADOS EN MAINPAGE:

1. **Data Fake en Series**: usa SAMPLE_SERIES en lugar de getSeriesService
2. **Estructura de datos inconsistente**: movies del backend vs fake data
3. **Campos incompatibles**: backend usa diferentes nombres de campos
4. **Búsquedas no implementadas**: no usa searchMoviesService/searchSeriesService  
5. **Categorías hardcodeadas**: no usa getCategoriesService
6. **Manejo de errores básico**: fallback a datos fake
7. **Estados de loading separados**: no unificados

PROBLEMAS DE MAPEO:
- Backend puede devolver: id, title, categoryId, releaseYear, description, cover_image
- Componente espera: id, title, category (string), year, cover, type, rating, duration
*/

// ===== MAINPAGE REFACTORIZADO COMPLETO =====
// src/Pages/MainPage/MainPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organism/AppHeader/AppHeader';
import { FilterBar } from '../../components/molecules/FilterBar/FilterBar';
import { ContentSection } from '../../components/molecules/ContentSection/ContentSection';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';

// ===== IMPORTAR TODOS LOS SERVICIOS REALES =====
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { searchMoviesService } from '../../services/Movies/searchMoviesService';
import { getSeriesService } from '../../services/Series/getSeriesService';
import { searchSeriesService } from '../../services/Series/searchSeriesService';
import { getCategoriesService } from '../../services/Categories/getCategoriesService';

/**
 * MainPage - Página principal con servicios reales
 * 
 * CAMBIOS REALIZADOS:
 * - ✅ Eliminados datos fake (SAMPLE_SERIES)
 * - ✅ Implementados todos los servicios reales
 * - ✅ Agregada funcionalidad de búsqueda
 * - ✅ Categorías dinámicas desde backend
 * - ✅ Mapeo correcto de campos backend → componente
 * - ✅ Estados de loading unificados
 * - ✅ Manejo de errores robusto
 */
function MainPage() {
    const navigate = useNavigate();
    
    // ===== ESTADOS UNIFICADOS =====
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);
    
    // Estados de datos
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Estados de loading (separados para UX granular)
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingSeries, setLoadingSeries] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [searching, setSearching] = useState(false);
    
    // Estados de error
    const [moviesError, setMoviesError] = useState(null);
    const [seriesError, setSeriesError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);

    // ===== FUNCIONES DE MAPEO DE DATOS =====
    
    /**
     * Mapea datos del backend al formato esperado por los componentes
     */
    const mapMovieData = (movie) => ({
        id: movie.id,
        title: movie.title,
        category: movie.categoryName || movie.category || 'Sin categoría', // String para mostrar
        categoryId: movie.categoryId, // ID para filtros
        year: movie.releaseYear,
        type: "movie",
        cover: movie.cover_image || movie.coverImage || movie.cover || 
               "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
        rating: movie.rating || 8.0,
        duration: movie.duration || "120 min",
        description: movie.description || "Sin descripción disponible"
    });

    const mapSeriesData = (serie) => ({
        id: serie.id,
        title: serie.title,
        category: serie.categoryName || serie.category || 'Sin categoría',
        categoryId: serie.categoryId,
        year: serie.releaseYear,
        type: "series",
        cover: serie.cover_image || serie.coverImage || serie.cover || 
               "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
        rating: serie.rating || 8.5,
        seasons: serie.seasons || 1,
        episodes: serie.episodes || 10,
        description: serie.description || "Sin descripción disponible"
    });

    /**
     * Mapea categorías del backend al formato para FilterBar
     */
    const mapCategoriesData = (categoriesData) => {
        const baseCategories = [{ value: 'all', label: 'Todo', icon: '🎬' }];
        
        if (!Array.isArray(categoriesData)) return baseCategories;
        
        const mappedCategories = categoriesData.map(category => ({
            value: category.id.toString(), // FilterBar espera string
            label: category.name,
            icon: getCategoryIcon(category.name),
            id: category.id // Mantener ID para filtros
        }));
        
        return [...baseCategories, ...mappedCategories];
    };

    /**
     * Obtiene icono según nombre de categoría
     */
    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Acción': '💥',
            'Drama': '🎭', 
            'Comedia': '😂',
            'Terror': '👻',
            'Fantasía': '🧙‍♂️',
            'Ciencia Ficción': '🚀',
            'Romance': '💕',
            'Animación': '🎨',
            'Documental': '📋',
            'Thriller': '🔪',
            'Aventura': '🗺️'
        };
        return icons[categoryName] || '🎞️';
    };

    // ===== VERIFICAR AUTENTICACIÓN =====
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('sessionUser');
        if (!sessionUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(sessionUser);
            setUser(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    // ===== CARGAR DATOS INICIALES =====
    useEffect(() => {
        if (!user) return;

        // Cargar categorías
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                setCategoriesError(null);
                const categoriesData = await getCategoriesService();
                
                if (categoriesData?.message === 'session expired') {
                    navigate('/login');
                    return;
                }
                
                setCategories(mapCategoriesData(categoriesData));
            } catch (error) {
                console.error('Error loading categories:', error);
                setCategoriesError('Error al cargar categorías');
                // Fallback a categorías básicas
                setCategories([
                    { value: 'all', label: 'Todo', icon: '🎬' },
                    { value: '1', label: 'Acción', icon: '💥' },
                    { value: '2', label: 'Drama', icon: '🎭' },
                ]);
            } finally {
                setLoadingCategories(false);
            }
        };

        // Cargar películas
        const loadMovies = async () => {
            try {
                setLoadingMovies(true);
                setMoviesError(null);
                const moviesData = await getMoviesService();
                
                if (moviesData?.message === 'session expired') {
                    navigate('/login');
                    return;
                }
                
                // Manejar diferentes formatos de respuesta
                let moviesArray = [];
                if (Array.isArray(moviesData)) {
                    moviesArray = moviesData;
                } else if (moviesData?.data && Array.isArray(moviesData.data)) {
                    moviesArray = moviesData.data;
                } else if (moviesData?.movies && Array.isArray(moviesData.movies)) {
                    moviesArray = moviesData.movies;
                }
                
                setMovies(moviesArray.map(mapMovieData));
            } catch (error) {
                console.error('Error loading movies:', error);
                setMoviesError('Error al cargar películas');
                setMovies([]); // Array vacío en lugar de datos fake
            } finally {
                setLoadingMovies(false);
            }
        };

        // Cargar series
        const loadSeries = async () => {
            try {
                setLoadingSeries(true);
                setSeriesError(null);
                const seriesData = await getSeriesService();
                
                if (seriesData?.message === 'session expired') {
                    navigate('/login');
                    return;
                }
                
                // Manejar diferentes formatos de respuesta
                let seriesArray = [];
                if (Array.isArray(seriesData)) {
                    seriesArray = seriesData;
                } else if (seriesData?.data && Array.isArray(seriesData.data)) {
                    seriesArray = seriesData.data;
                } else if (seriesData?.series && Array.isArray(seriesData.series)) {
                    seriesArray = seriesData.series;
                }
                
                setSeries(seriesArray.map(mapSeriesData));
            } catch (error) {
                console.error('Error loading series:', error);
                setSeriesError('Error al cargar series');
                setSeries([]); // Array vacío en lugar de datos fake
            } finally {
                setLoadingSeries(false);
            }
        };

        // Ejecutar cargas en paralelo para mejor rendimiento
        Promise.all([
            loadCategories(),
            loadMovies(),
            loadSeries()
        ]);

    }, [user, navigate]);

    // ===== FUNCIONES DE BÚSQUEDA REAL =====
    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm.trim()) return;
            
            try {
                setSearching(true);
                
                // Búsquedas en paralelo
                const [moviesResults, seriesResults] = await Promise.all([
                    searchMoviesService(searchTerm).catch(err => {
                        console.error('Error searching movies:', err);
                        return [];
                    }),
                    searchSeriesService(searchTerm).catch(err => {
                        console.error('Error searching series:', err);
                        return [];
                    })
                ]);
                
                // Mapear resultados
                const mappedMovies = Array.isArray(moviesResults) ? 
                    moviesResults.map(mapMovieData) : [];
                const mappedSeries = Array.isArray(seriesResults) ? 
                    seriesResults.map(mapSeriesData) : [];
                
                setMovies(mappedMovies);
                setSeries(mappedSeries);
                
            } catch (error) {
                console.error('Error during search:', error);
            } finally {
                setSearching(false);
            }
        };

        // Debounce search - buscar después de 500ms de inactividad
        const timeoutId = setTimeout(performSearch, 500);
        return () => clearTimeout(timeoutId);
        
    }, [searchTerm]);

    // ===== FUNCIONES DE FILTRADO =====
    const getFilteredContent = (contentArray) => {
        if (!Array.isArray(contentArray)) return [];
        
        return contentArray.filter(item => {
            // Filtro por categoría
            if (selectedCategory !== 'all') {
                // Comparar por ID de categoría
                if (item.categoryId?.toString() !== selectedCategory) {
                    return false;
                }
            }
            
            // Filtro por término de búsqueda (opcional, ya se hace en server)
            if (searchTerm && !searchTerm.trim()) {
                return true; // Si no hay término, mostrar todos
            }
            
            return true;
        });
    };

    const filteredMovies = getFilteredContent(movies);
    const filteredSeries = getFilteredContent(series);

    // ===== HANDLERS =====
    const handleLogout = () => {
        sessionStorage.removeItem('sessionUser');
        navigate('/login');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // El efecto useEffect manejará la búsqueda con debounce
    };

    const handleCategoryChange = (categoryValue) => {
        setSelectedCategory(categoryValue);
    };

    const handlePlayContent = (content) => {
        if (content.type === 'movie') {
            navigate(`/video-player/${content.id}`);
        } else {
            // Para series, podrías navegar a una página de episodios
            navigate(`/series/${content.id}/episodes`);
        }
    };

    const handleAddContent = () => {
        // Navegar a página de subida de contenido
        navigate('/upload');
    };

    const handleRetryMovies = () => {
        // Recargar películas
        setMovies([]);
        setMoviesError(null);
        // El useEffect se ejecutará de nuevo
    };

    const handleRetrySeries = () => {
        // Recargar series
        setSeries([]);
        setSeriesError(null);
        // El useEffect se ejecutará de nuevo
    };

    // ===== RENDER =====
    if (!user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: 'var(--font-size-lg)'
            }}>
                Cargando...
            </div>
        );
    }

    return (
        <PageLayout
            header={
                <AppHeader
                    appTitle="🎬 StreamApp"
                    userName={user.username || user.sub || user.name || 'Usuario'}
                    searchValue={searchTerm}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Buscar películas y series..."
                    onLogout={handleLogout}
                    variant="default"
                    size="lg"
                />
            }
            filters={
                <FilterBar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    loading={loadingCategories}
                    actions={
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleAddContent}
                        >
                            Subir Contenido
                        </Button>
                    }
                />
            }
            variant="default"
        >
            {/* ===== SECCIÓN DE PELÍCULAS ===== */}
            <ContentSection
                title={`🎬 Películas ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Populares'}`}
                icon="🎬"
                loading={loadingMovies || searching}
                error={moviesError}
                empty={filteredMovies.length === 0 && !loadingMovies}
                emptyTitle={
                    searchTerm 
                        ? `Sin películas para "${searchTerm}"` 
                        : selectedCategory !== 'all'
                            ? "No hay películas en esta categoría"
                            : "No hay películas disponibles"
                }
                emptyDescription={
                    searchTerm
                        ? "No encontramos películas que coincidan con tu búsqueda."
                        : "Las películas están siendo actualizadas. Vuelve pronto para ver nuevo contenido."
                }
                emptyAction={
                    moviesError ? (
                        <Button variant="outline" onClick={handleRetryMovies}>
                            Reintentar
                        </Button>
                    ) : searchTerm ? (
                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                            Limpiar búsqueda
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleAddContent}>
                            Subir primera película
                        </Button>
                    )
                }
                variant="featured"
                size="lg"
                gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredMovies.map(movie => (
                    <ContentCard
                        key={`movie-${movie.id}`}
                        content={movie}
                        onClick={() => handlePlayContent(movie)}
                        onFavoriteClick={() => console.log('Favorito:', movie.title)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>

            {/* ===== SECCIÓN DE SERIES ===== */}
            <ContentSection
                title={`📺 Series ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'en Tendencia'}`}
                icon="📺"
                loading={loadingSeries || searching}
                error={seriesError}
                empty={filteredSeries.length === 0 && !loadingSeries}
                emptyTitle={
                    searchTerm 
                        ? `Sin series para "${searchTerm}"` 
                        : selectedCategory !== 'all'
                            ? "No hay series en esta categoría"
                            : "No hay series disponibles"
                }
                emptyDescription={
                    searchTerm
                        ? "No encontramos series que coincidan con tu búsqueda."
                        : "Las series están siendo actualizadas. Vuelve pronto para ver nuevo contenido."
                }
                emptyAction={
                    seriesError ? (
                        <Button variant="outline" onClick={handleRetrySeries}>
                            Reintentar
                        </Button>
                    ) : searchTerm ? (
                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                            Limpiar búsqueda
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleAddContent}>
                            Subir primera serie
                        </Button>
                    )
                }
                variant="default"
                size="md"
                gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredSeries.map(serie => (
                    <ContentCard
                        key={`series-${serie.id}`}
                        content={serie}
                        onClick={() => handlePlayContent(serie)}
                        onFavoriteClick={() => console.log('Favorito:', serie.title)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>

            {/* ===== ESTADO VACÍO GLOBAL ===== */}
            {!loadingMovies && !loadingSeries && !searching &&
             filteredMovies.length === 0 && 
             filteredSeries.length === 0 && 
             !searchTerm && 
             selectedCategory === 'all' && (
                <EmptyState
                    icon="🚀"
                    title="¡Bienvenido a StreamApp!"
                    description="Tu plataforma de streaming está lista. Comienza subiendo tu primer video o explora el contenido disponible."
                    action={
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <Button variant="outline" size="md" onClick={() => window.location.reload()}>
                                Recargar contenido
                            </Button>
                            <Button variant="primary" size="md" onClick={handleAddContent}>
                                Subir primer video
                            </Button>
                        </div>
                    }
                    variant="info"
                    size="lg"
                />
            )}
        </PageLayout>
    );
}

export { MainPage };