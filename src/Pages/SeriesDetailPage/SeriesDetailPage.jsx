// src/Pages/SeriesDetail/SeriesDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organism/AppHeader/AppHeader';
import { ContentSection } from '../../components/molecules/ContentSection/ContentSection';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';

// Servicios (necesitarás crearlos)
import { getSerieByIdService } from '../../services/Series/getSerieByIdService';
import { getEpisodesBySerieService } from '../../services/Episodes/getEpisodesBySerieService';

function SeriesDetailPage() {
    const { id } = useParams(); // ID de la serie
    const navigate = useNavigate();
    const { navigateToPlayer } = useMovieNavigation();
    
    // Estados
    const [serie, setSerie] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    
    // Estados de carga
    const [loadingSerie, setLoadingSerie] = useState(true);
    const [loadingEpisodes, setLoadingEpisodes] = useState(true);
    
    // Estados de error
    const [serieError, setSerieError] = useState(null);
    const [episodesError, setEpisodesError] = useState(null);

    // ===== CARGAR DATOS DE LA SERIE =====
    useEffect(() => {
        const fetchSerie = async () => {
            try {
                setLoadingSerie(true);
                setSerieError(null);
                
                const response = await getSerieByIdService(id);
                
                if (response.success) {
                    setSerie(response.data);
                    console.log('Serie cargada:', response.data);
                } else {
                    throw new Error(response.message || 'Error al cargar la serie');
                }
            } catch (error) {
                console.error('Error fetching serie:', error);
                setSerieError(error.message);
            } finally {
                setLoadingSerie(false);
            }
        };

        if (id) {
            fetchSerie();
        }
    }, [id]);

    // ===== CARGAR EPISODIOS =====
    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoadingEpisodes(true);
                setEpisodesError(null);
                
                const response = await getEpisodesBySerieService(id);
                
                if (response.success) {
                    setEpisodes(response.data || []);
                    console.log('Episodios cargados:', response.data);
                } else {
                    throw new Error(response.message || 'Error al cargar episodios');
                }
            } catch (error) {
                console.error('Error fetching episodes:', error);
                setEpisodesError(error.message);
            } finally {
                setLoadingEpisodes(false);
            }
        };

        if (id) {
            fetchEpisodes();
        }
    }, [id]);

    // ===== HANDLERS =====
    const handlePlayEpisode = (episode) => {
        console.log('Reproducir episodio:', episode);
        
        // Transformar datos del episodio para que funcione con navigateToPlayer
        const episodeData = {
            ...episode,
            _original: episode,
            // Asegurar que tenga los campos necesarios
            file_hash: episode.file_hash,
            available_resolutions: episode.available_resolutions || [480, 720, 1080]
        };
        
        navigateToPlayer(episodeData);
    };

    const handleEpisodeClick = (episode) => {
        // Por ahora, mismo comportamiento que play
        handlePlayEpisode(episode);
    };

    const handleBackToSeries = () => {
        navigate('/main-page');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    // ===== FILTRAR EPISODIOS POR TEMPORADA =====
    const episodesBySeason = episodes.reduce((acc, episode) => {
        const season = episode.season || 1;
        if (!acc[season]) acc[season] = [];
        acc[season].push(episode);
        return acc;
    }, {});

    const availableSeasons = Object.keys(episodesBySeason)
        .map(Number)
        .sort((a, b) => a - b);

    const currentSeasonEpisodes = episodesBySeason[selectedSeason] || [];

    // ===== TRANSFORMAR EPISODIOS PARA CONTENTCARD =====
    const transformEpisodeForCard = (episode) => {
        return {
            id: episode.id,
            title: episode.title || `Episodio ${episode.episode_number}`,
            cover: episode.cover_image || serie?.cover_image || 'https://via.placeholder.com/300x450?text=Episodio',
            category: `T${episode.season} E${episode.episode_number}`,
            year: new Date(episode.created_at || episode.createdAt).getFullYear(),
            type: 'episode',
            rating: episode.rating || serie?.rating || 0,
            duration: episode.video_duration || episode.duration || '45 min',
            // Campos necesarios para el reproductor
            file_hash: episode.file_hash,
            available_resolutions: episode.available_resolutions,
            _original: episode
        };
    };

    // ===== VERIFICAR ERRORES =====
    if (serieError) {
        return (
            <PageLayout
                header={<AppHeader showBackButton onBackClick={handleBackToSeries} />}
                main={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '50vh',
                        textAlign: 'center',
                        padding: 'var(--space-xl)'
                    }}>
                        <div>
                            <h2>Error al cargar la serie</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                                {serieError}
                            </p>
                            <Button variant="primary" onClick={handleRetry}>
                                Reintentar
                            </Button>
                        </div>
                    </div>
                }
            />
        );
    }

    return (
        <PageLayout
            header={
                <AppHeader 
                    showBackButton 
                    onBackClick={handleBackToSeries}
                    title={serie?.title || 'Cargando...'}
                />
            }
            main={
                <div style={{ padding: 'var(--space-lg)' }}>
                    {/* ===== INFORMACIÓN DE LA SERIE ===== */}
                    {serie && (
                        <div style={{ 
                            marginBottom: 'var(--space-xl)',
                            display: 'flex',
                            gap: 'var(--space-lg)',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <img 
                                src={serie.cover_image ? `http://localhost:8080/covers/${serie.cover_image}` : 'https://via.placeholder.com/300x450?text=Serie'}
                                alt={`Carátula de ${serie.title}`}
                                style={{
                                    width: '200px',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=Serie';
                                }}
                            />
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <h1 style={{ 
                                    fontSize: 'var(--font-size-2xl)', 
                                    marginBottom: 'var(--space-md)',
                                    color: 'var(--text-primary)'
                                }}>
                                    {serie.title}
                                </h1>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    marginBottom: 'var(--space-md)',
                                    lineHeight: 'var(--line-height-relaxed)'
                                }}>
                                    {serie.description || 'Sin descripción disponible'}
                                </p>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: 'var(--space-md)', 
                                    flexWrap: 'wrap',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ 
                                        background: 'var(--bg-accent)', 
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        {serie.release_year}
                                    </span>
                                    <span style={{ 
                                        background: 'var(--bg-primary-light)', 
                                        color: 'var(--color-primary)',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        Categoría {serie.category_id}
                                    </span>
                                    {serie.rating && (
                                        <span style={{ 
                                            background: 'var(--bg-success-light)', 
                                            color: 'var(--color-success)',
                                            padding: 'var(--space-xs) var(--space-sm)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: 'var(--font-weight-semibold)'
                                        }}>
                                            ⭐ {serie.rating}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== SELECTOR DE TEMPORADAS ===== */}
                    {availableSeasons.length > 1 && (
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ 
                                marginBottom: 'var(--space-md)',
                                color: 'var(--text-primary)'
                            }}>
                                Temporadas
                            </h3>
                            <div style={{ 
                                display: 'flex', 
                                gap: 'var(--space-sm)', 
                                flexWrap: 'wrap' 
                            }}>
                                {availableSeasons.map(season => (
                                    <Button
                                        key={season}
                                        variant={selectedSeason === season ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedSeason(season)}
                                    >
                                        Temporada {season}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== LISTA DE EPISODIOS ===== */}
                    <ContentSection
                        title={`📺 Episodios${availableSeasons.length > 1 ? ` - Temporada ${selectedSeason}` : ''}`}
                        icon="🎬"
                        loading={loadingEpisodes}
                        error={episodesError}
                        empty={currentSeasonEpisodes.length === 0 && !loadingEpisodes}
                        emptyTitle="No hay episodios disponibles"
                        emptyDescription={
                            availableSeasons.length > 1 
                                ? `No se encontraron episodios para la temporada ${selectedSeason}`
                                : "Esta serie aún no tiene episodios disponibles"
                        }
                        emptyAction={
                            episodesError ? (
                                <Button variant="outline" onClick={handleRetry}>
                                    Reintentar
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={handleBackToSeries}>
                                    Volver a series
                                </Button>
                            )
                        }
                        variant="default"
                        size="md"
                        gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
                        gridGap="var(--space-md)"
                    >
                        {currentSeasonEpisodes.map(episode => (
                            <ContentCard
                                key={`episode-${episode.id}`}
                                content={transformEpisodeForCard(episode)}
                                onPlay={() => handlePlayEpisode(episode)}
                                onClick={() => handleEpisodeClick(episode)}
                                size="md"
                                showRating={true}
                                variant="elevated"
                            />
                        ))}
                    </ContentSection>
                </div>
            }
        />
    );
}

export { SeriesDetailPage };