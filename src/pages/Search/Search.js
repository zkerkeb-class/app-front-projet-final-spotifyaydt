import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import style from './Search.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import PlaylistCard from '../../components/UI/Cards/PlaylistCard';
import Filter from '../../components/UI/Filter/Filter';
import FilterMenu from '../../components/UI/FilterMenu/FilterMenu';
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import { FaSearch } from 'react-icons/fa';
import {
  intelligentSearch,
  getAutocompleteSuggestions,
  getSimilarity,
} from '../../utils/searchUtils';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(t('search.filters.all'));
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
  });
  const [filteredResults, setFilteredResults] = useState({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
  });
  const [bestResult, setBestResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const [searchParams] = useSearchParams();
  const { handlePlay } = useAudioPlayer();

  // Fetch data from API
  const { data: tracks, isLoading: tracksLoading } = useApi(
    () => api.tracks.getAll(),
    []
  );
  const { data: albums, isLoading: albumsLoading } = useApi(
    () => api.albums.getAll(),
    []
  );
  const { data: artists, isLoading: artistsLoading } = useApi(
    () => api.artists.getAll(),
    []
  );
  const { data: playlists, isLoading: playlistsLoading } = useApi(
    () => api.playlists.getAll(),
    []
  );

  const INITIAL_LIMIT = 6;

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const getAlbumTitle = (track) => {
    if (!track?.album) return t('common.unknownAlbum');
    if (typeof track.album === 'string') return track.album;
    if (track.album._id) return track.album.title || t('common.unknownAlbum');
    return track.album.title || t('common.unknownAlbum');
  };

  const getDurationInSeconds = (duration) => {
    if (!duration) return 0;

    // If duration is already a number, return it
    if (typeof duration === 'number') return duration;

    // If duration is a string in MM:SS format
    if (typeof duration === 'string' && duration.includes(':')) {
      try {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + (seconds || 0);
      } catch (error) {
        console.warn('Invalid duration format:', duration);
        return 0;
      }
    }

    // If duration is a string number, try to parse it
    if (typeof duration === 'string') {
      const parsed = parseInt(duration, 10);
      if (!isNaN(parsed)) return parsed;
    }

    console.warn('Unhandled duration format:', duration);
    return 0;
  };

  const handleSearch = useCallback(
    (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults({ tracks: [], albums: [], artists: [], playlists: [] });
        setBestResult(null);
        return;
      }

      setIsLoading(true);

      // Use intelligent search for each category
      const searchResults = {
        tracks: tracks
          ? intelligentSearch(tracks, searchQuery, {
              fields: ['title', 'artist.name'],
              usePhonetic: false,
            })
          : [],
        albums: albums
          ? intelligentSearch(albums, searchQuery, {
              fields: ['title', 'artist'],
              usePhonetic: false,
            })
          : [],
        artists: artists
          ? intelligentSearch(artists, searchQuery, {
              fields: ['name'],
              usePhonetic: true,
              similarityThreshold: 0.3,
            })
          : [],
        playlists: playlists
          ? intelligentSearch(playlists, searchQuery, {
              fields: ['title'],
              usePhonetic: false,
            })
          : [],
      };

      setResults(searchResults);
      const bestMatch = findBestResult(searchResults, searchQuery);
      setBestResult(bestMatch);
      setIsLoading(false);
    },
    [tracks, albums, artists, playlists]
  );

  const findBestResult = (searchResults, searchQuery) => {
    if (!searchResults || !searchQuery) return null;

    // Combine all results into a single array with type information
    const allResults = [
      ...searchResults.tracks.map((item) => ({ type: 'track', item })),
      ...searchResults.albums.map((item) => ({ type: 'album', item })),
      ...searchResults.artists.map((item) => ({ type: 'artist', item })),
      ...searchResults.playlists.map((item) => ({ type: 'playlist', item })),
    ];

    if (allResults.length === 0) return null;

    // Calculate scores for each result
    const scoredResults = allResults.map(({ type, item }) => {
      const searchString =
        type === 'track'
          ? `${item.title} ${getArtistName(item)}`
          : type === 'album'
            ? `${item.title} ${item.artist?.name || item.artist || ''}`
            : type === 'artist'
              ? item.name
              : item.title;

      return {
        type,
        item,
        score: getSimilarity(
          searchQuery.toLowerCase(),
          searchString.toLowerCase()
        ),
      };
    });

    // Find the result with the highest score
    return scoredResults.reduce((best, current) =>
      current.score > best.score ? current : best
    );
  };

  // Handle autocomplete suggestions
  const updateSuggestions = useCallback(
    (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      const trackSuggestions = tracks
        ? getAutocompleteSuggestions(tracks, searchQuery, {
            fields: ['title', 'artist.name'],
          })
        : [];

      const artistSuggestions = artists
        ? getAutocompleteSuggestions(artists, searchQuery, {
            fields: ['name'],
          })
        : [];

      const allSuggestions = [
        ...new Set([...trackSuggestions, ...artistSuggestions]),
      ];
      setSuggestions(allSuggestions);
    },
    [tracks, artists]
  );

  useEffect(() => {
    handleSearch(query);
    updateSuggestions(query);
  }, [query, handleSearch, updateSuggestions]);

  const applyFilters = useCallback((filters, items) => {
    return items.filter((item) => {
      const matchesArtist =
        !filters.artist ||
        (item.artist?.name || item.name || '')
          .toLowerCase()
          .includes(filters.artist.toLowerCase());

      const matchesAlbum =
        !filters.album ||
        (item.album?.title || item.title || '')
          .toLowerCase()
          .includes(filters.album.toLowerCase());

      const matchesGenre =
        !filters.genre ||
        (item.genre || '').toLowerCase().includes(filters.genre.toLowerCase());

      const matchesYear =
        !filters.year ||
        (item.releaseYear || item.year || '').toString() === filters.year;

      const itemDuration = getDurationInSeconds(item.duration);
      const matchesDuration =
        !filters.duration ||
        (filters.duration === 'short' && itemDuration <= 180) ||
        (filters.duration === 'medium' &&
          itemDuration > 180 &&
          itemDuration <= 300) ||
        (filters.duration === 'long' && itemDuration > 300);

      const matchesPopularity =
        !filters.popularity ||
        (filters.popularity === 'high' && item.plays > 1000000) ||
        (filters.popularity === 'medium' &&
          item.plays > 100000 &&
          item.plays <= 1000000) ||
        (filters.popularity === 'low' && item.plays <= 100000);

      return (
        matchesArtist &&
        matchesAlbum &&
        matchesGenre &&
        matchesYear &&
        matchesDuration &&
        matchesPopularity
      );
    });
  }, []);

  const applySorting = useCallback((sortBy, items) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return (
            getDurationInSeconds(a.duration) - getDurationInSeconds(b.duration)
          );

        case 'releaseDate':
          return (
            (b.releaseYear || b.year || 0) - (a.releaseYear || a.year || 0)
          );

        case 'alphabetical':
          return (a.title || a.name || '').localeCompare(
            b.title || b.name || ''
          );

        case 'popularity':
          return (b.plays || 0) - (a.plays || 0);

        case 'plays':
          return (b.plays || 0) - (a.plays || 0);

        default:
          return 0;
      }
    });
  }, []);

  const handleFilterChange = useCallback(
    (filters) => {
      setFilteredResults({
        tracks: applyFilters(filters, results.tracks),
        albums: applyFilters(filters, results.albums),
        artists: applyFilters(filters, results.artists),
        playlists: applyFilters(filters, results.playlists),
      });
    },
    [results, applyFilters]
  );

  const handleSortChange = useCallback(
    (sortBy) => {
      setFilteredResults((prev) => ({
        tracks: applySorting(sortBy, prev.tracks),
        albums: applySorting(sortBy, prev.albums),
        artists: applySorting(sortBy, prev.artists),
        playlists: applySorting(sortBy, prev.playlists),
      }));
    },
    [applySorting]
  );

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  const renderBestResult = () => {
    if (!bestResult) return null;

    return (
      <div className={style.best_result}>
        <h2>{t('search.bestMatch')}</h2>
        <div className={style.best_result__content}>
          {bestResult.type === 'artist' && (
            <ArtistCard artist={bestResult.item} />
          )}
          {bestResult.type === 'album' && <AlbumCard album={bestResult.item} />}
          {bestResult.type === 'track' && <TrackCard track={bestResult.item} />}
          {bestResult.type === 'playlist' && (
            <PlaylistCard playlist={bestResult.item} />
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.filters}>
            <Filter
              filterName={t('search.filters.all')}
              onFilter={() => setActiveFilter(t('search.filters.all'))}
              isActive={activeFilter === t('search.filters.all')}
            />
            <Filter
              filterName={t('search.filters.tracks')}
              onFilter={() => setActiveFilter(t('search.filters.tracks'))}
              isActive={activeFilter === t('search.filters.tracks')}
            />
            <Filter
              filterName={t('search.filters.albums')}
              onFilter={() => setActiveFilter(t('search.filters.albums'))}
              isActive={activeFilter === t('search.filters.albums')}
            />
            <Filter
              filterName={t('search.filters.artists')}
              onFilter={() => setActiveFilter(t('search.filters.artists'))}
              isActive={activeFilter === t('search.filters.artists')}
            />
            <Filter
              filterName={t('search.filters.playlists')}
              onFilter={() => setActiveFilter(t('search.filters.playlists'))}
              isActive={activeFilter === t('search.filters.playlists')}
            />
          </div>
          <FilterMenu
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </header>

        <main className={style.results}>
          {isLoading ||
          tracksLoading ||
          albumsLoading ||
          artistsLoading ||
          playlistsLoading ? (
            <div className={style.loading}>
              <div className={style.spinner}></div>
            </div>
          ) : query.trim() === '' ? (
            <div className={style.empty_state}>
              <FaSearch className={style.empty_icon} />
              <p>{t('search.emptyState')}</p>
            </div>
          ) : (
            <>
              {showSuggestions && suggestions.length > 0 && (
                <div className={style.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={style.suggestion_item}
                      onClick={() => {
                        navigate(
                          `/search?query=${encodeURIComponent(suggestion)}`
                        );
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

              {bestResult && renderBestResult()}

              {(activeFilter === t('search.filters.all') ||
                activeFilter === t('search.filters.tracks')) &&
                filteredResults.tracks.length > 0 && (
                  <HorizontalScroll
                    title={t('search.tracksCount', {
                      count: filteredResults.tracks.length,
                    })}
                    showShowMore={filteredResults.tracks.length > INITIAL_LIMIT}
                    moreLink={`/search/tracks?query=${encodeURIComponent(query)}`}
                    itemCount={filteredResults.tracks.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {filteredResults.tracks
                      .slice(0, INITIAL_LIMIT)
                      .map((track) => (
                        <TrackCard key={track.id} track={track} />
                      ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === t('search.filters.all') ||
                activeFilter === t('search.filters.albums')) &&
                filteredResults.albums.length > 0 && (
                  <HorizontalScroll
                    title={t('search.albumsCount', {
                      count: filteredResults.albums.length,
                    })}
                    showShowMore={filteredResults.albums.length > INITIAL_LIMIT}
                    moreLink={`/search/albums?query=${encodeURIComponent(query)}`}
                    itemCount={filteredResults.albums.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {filteredResults.albums
                      .slice(0, INITIAL_LIMIT)
                      .map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === t('search.filters.all') ||
                activeFilter === t('search.filters.artists')) &&
                filteredResults.artists.length > 0 && (
                  <HorizontalScroll
                    title={t('search.artistsCount', {
                      count: filteredResults.artists.length,
                    })}
                    showShowMore={
                      filteredResults.artists.length > INITIAL_LIMIT
                    }
                    moreLink={`/search/artists?query=${encodeURIComponent(query)}`}
                    itemCount={filteredResults.artists.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {filteredResults.artists
                      .slice(0, INITIAL_LIMIT)
                      .map((artist) => (
                        <ArtistCard key={artist._id} artist={artist} />
                      ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === t('search.filters.all') ||
                activeFilter === t('search.filters.playlists')) &&
                filteredResults.playlists.length > 0 && (
                  <HorizontalScroll
                    title={t('search.playlistsCount', {
                      count: filteredResults.playlists.length,
                    })}
                    showShowMore={
                      filteredResults.playlists.length > INITIAL_LIMIT
                    }
                    moreLink={`/search/playlists?query=${encodeURIComponent(query)}`}
                    itemCount={filteredResults.playlists.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {filteredResults.playlists
                      .slice(0, INITIAL_LIMIT)
                      .map((playlist) => (
                        <PlaylistCard
                          key={playlist.id}
                          playlist={playlist}
                          onPlay={handlePlay}
                        />
                      ))}
                  </HorizontalScroll>
                )}

              {Object.values(filteredResults).every(
                (arr) => arr.length === 0
              ) && (
                <div className={style.no_results}>
                  <p>{t('search.noResults', { query })}</p>
                  <p>{t('search.tryAgain')}</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Search;
