// MainPage.jsx - REFACTORIZADO usando solo componentes con Storybook
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organism/AppHeader/AppHeader';
import { FilterBar } from '../../components/molecules/FilterBar/FilterBar';
import { ContentSection } from '../../components/molecules/ContentSection/ContentSection';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { getMoviesService } from '../../services/Movies/getMoviesService';

// Datos de ejemplo para series (mantenidos del código original)
const SAMPLE_SERIES = [
    {
        id: 11,
        title: "Stranger Things",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
        rating: 9.0,
        seasons: 4,
        episodes: 42
    },
    {
        id: 12,
        title: "The Crown",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
        rating: 8.8,
        seasons: 6,
        episodes: 60
    },
    {
        id: 13,
        title: "House of Dragons",
        category: "Fantasía",
        year: 2022,
        type: "series",
        cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
        rating: 8.9,
        seasons: 2,
        episodes: 20
    }
];

function MainPage() {
    const navigate = useNavigate();
    
    // Estados (mantenidos del código original) - Inicializar con arrays vacíos
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);
    const [movies, setMovies] = useState([]); // Inicializar como array vacío
    const [series, setSeries] = useState(SAMPLE_SERIES);
    const [loading, setLoading] = useState(true);
    const [moviesLoading, setMoviesLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verificar autenticación (lógica original mantenida)
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

    // Cargar películas (lógica original mantenida y mejorada)
    useEffect(() => {
        const loadMovies = async () => {
            if (!user) return;
            
            setMoviesLoading(true);
            setError(null);
            
            try {
                const moviesData = await getMoviesService();
                console.log('Películas cargadas:', moviesData);
                
                // Verificar que sea un array válido
                if (Array.isArray(moviesData)) {
                    setMovies(moviesData);
                } else if (moviesData && typeof moviesData === 'object' && moviesData.data && Array.isArray(moviesData.data)) {
                    // Si viene en formato { data: [...] }
                    setMovies(moviesData.data);
                } else {
                    console.warn('getMoviesService no devolvió un array válido:', moviesData);
                    // Usar datos de ejemplo si no es un array válido
                    setMovies([
                        {
                            id: 1,
                            title: "Avatar: El Camino del Agua",
                            category: "Acción",
                            year: 2022,
                            type: "movie",
                            cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
                            rating: 8.5,
                            duration: "192 min"
                        },
                        {
                            id: 2,
                            title: "Top Gun: Maverick",
                            category: "Acción",
                            year: 2022,
                            type: "movie",
                            cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
                            rating: 9.1,
                            duration: "130 min"
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error loading movies:', error);
                setError('Error al cargar las películas. Inténtalo de nuevo.');
                
                // Datos de ejemplo en caso de error
                setMovies([
                    {
                        id: 1,
                        title: "Avatar: El Camino del Agua",
                        category: "Acción",
                        year: 2022,
                        type: "movie",
                        cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
                        rating: 8.5,
                        duration: "192 min"
                    },
                    {
                        id: 2,
                        title: "Top Gun: Maverick",
                        category: "Acción",
                        year: 2022,
                        type: "movie",
                        cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
                        rating: 9.1,
                        duration: "130 min"
                    }
                ]);
            } finally {
                setMoviesLoading(false);
                setLoading(false);
            }
        };

        loadMovies();
    }, [user]);

    // Obtener categorías únicas con protección completa
    const allContent = [...(movies || []), ...(series || [])];
    const uniqueCategories = new Set(
        allContent
            .map(item => item?.category)
            .filter(category => category && typeof category === 'string')
    );
    
    const categories = [
        { value: 'all', label: 'Todo', icon: '🎬' },
        ...Array.from(uniqueCategories).map(category => ({
            value: category,
            label: category,
            icon: getCategoryIcon(category)
        }))
    ];

    // Helper para íconos de categorías
    function getCategoryIcon(category) {
        if (!category || typeof category !== 'string') return '🎞️';
        
        const icons = {
            'Acción': '💥',
            'Drama': '🎭',
            'Comedia': '😂',
            'Terror': '👻',
            'Fantasía': '🧙‍♂️',
            'Ciencia Ficción': '🚀',
            'Romance': '💕',
            'Animación': '🎨'
        };
        return icons[category] || '🎞️';
    }

    // Filtrar contenido con protección adicional
    const filteredMovies = (movies || []).filter(movie => {
        if (!movie || typeof movie.title !== 'string') return false;
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredSeries = (series || []).filter(serie => {
        if (!serie || typeof serie.title !== 'string') return false;
        const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || serie.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Handlers (lógica original mantenida)
    const handleLogout = () => {
        sessionStorage.removeItem('sessionUser');
        navigate('/login');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePlayContent = (content) => {
        navigate(`/video-player/${content.id}`);
    };

    const handleAddContent = () => {
        // Mantener lógica original o mejorar
        alert('Funcionalidad de agregar contenido - por implementar');
    };

    const handleRetryLoad = () => {
        window.location.reload();
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleViewAllCategories = () => {
        setSelectedCategory('all');
        setSearchTerm('');
    };

    // Loading inicial
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
                    userName={user.username || user.sub || 'Usuario'}
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
                    onCategoryChange={setSelectedCategory}
                    actions={
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddContent}
                            leftIcon="➕"
                        >
                            Subir Video
                        </Button>
                    }
                    variant="elevated"
                />
            }
            variant="default"
            containerMaxWidth="144rem"
        >
            {/* Banner de error global */}
            {error && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <EmptyState
                        icon="⚠️"
                        title="Error de conexión"
                        description={error}
                        action={
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <Button variant="outline" size="sm" onClick={() => setError(null)}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleRetryLoad}>
                                    Reintentar
                                </Button>
                            </div>
                        }
                        variant="error"
                        size="md"
                    />
                </div>
            )}

            {/* Sección de Películas */}
            <ContentSection
                title="🎬 Películas Populares"
                icon="🎬"
                loading={moviesLoading}
                empty={!moviesLoading && filteredMovies.length === 0}
                emptyIcon={searchTerm ? "🔍" : "🎬"}
                emptyTitle={
                    searchTerm 
                        ? `Sin resultados para "${searchTerm}"` 
                        : selectedCategory === 'all' 
                            ? "No hay películas disponibles"
                            : `No hay películas en ${selectedCategory}`
                }
                emptyDescription={
                    searchTerm
                        ? "Intenta con otros términos de búsqueda o explora por categorías."
                        : "El catálogo de películas está siendo actualizado. Vuelve pronto para ver el nuevo contenido."
                }
                emptyAction={
                    searchTerm ? (
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <Button variant="outline" size="sm" onClick={handleClearSearch}>
                                Limpiar búsqueda
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleViewAllCategories}>
                                Ver todas las películas
                            </Button>
                        </div>
                    ) : selectedCategory !== 'all' ? (
                        <Button variant="primary" onClick={handleViewAllCategories}>
                            Ver todas las categorías
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => navigate('/search-form')}>
                            Explorar contenido
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
                        key={movie.id}
                        content={movie}
                        onClick={() => handlePlayContent(movie)}
                        onFavoriteClick={() => console.log('Favorito:', movie.title)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>

            {/* Sección de Series */}
            <ContentSection
                title="📺 Series en Tendencia"
                icon="📺"
                empty={filteredSeries.length === 0}
                emptyIcon={searchTerm ? "🔍" : "📺"}
                emptyTitle={
                    searchTerm 
                        ? `Sin series para "${searchTerm}"` 
                        : selectedCategory === 'all'
                            ? "No hay series disponibles"
                            : `No hay series en ${selectedCategory}`
                }
                emptyDescription={
                    searchTerm
                        ? "No encontramos series que coincidan con tu búsqueda."
                        : "Las series están siendo actualizadas. Vuelve pronto para ver nuevo contenido."
                }
                emptyAction={
                    searchTerm ? (
                        <Button variant="outline" onClick={handleClearSearch}>
                            Limpiar búsqueda
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => handleViewAllCategories()}>
                            Explorar películas
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
                        key={serie.id}
                        content={serie}
                        onClick={() => handlePlayContent(serie)}
                        onFavoriteClick={() => console.log('Favorito:', serie.title)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>

            {/* Mensaje especial si no hay contenido en absoluto */}
            {!loading && !moviesLoading && 
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
                            <Button variant="outline" size="md" onClick={() => alert('Explorar catálogo')}>
                                Explorar catálogo
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