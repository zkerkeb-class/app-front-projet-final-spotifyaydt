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
  mockTracks,
  mockAlbums,
  mockArtists,
  mockPlaylists,
} from '../../constant/mockData';
import {
  intelligentSearch,
  getAutocompleteSuggestions,
} from '../../utils/searchUtils';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const Search = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
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

  const INITIAL_LIMIT = 6;

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
        tracks: intelligentSearch(mockTracks, searchQuery, {
          fields: ['title', 'artist'],
          usePhonetic: false,
        }),
        albums: intelligentSearch(mockAlbums, searchQuery, {
          fields: ['title', 'artist'],
          usePhonetic: false,
        }),
        artists: intelligentSearch(mockArtists, searchQuery, {
          fields: ['name'],
          usePhonetic: true,
          similarityThreshold: 0.3,
        }),
        playlists: intelligentSearch(mockPlaylists, searchQuery, {
          fields: ['title'],
          usePhonetic: false,
        }),
      };

      setResults(searchResults);
      const bestMatch = findBestResult(searchResults, searchQuery);
      setBestResult(bestMatch);
      setIsLoading(false);
    },
    [] // Remove query dependency since we use the searchQuery parameter
  );

  const findBestResult = (searchResults, searchQuery) => {
    // Priority order: Artist > Album > Track > Playlist
    const typeScores = {
      artist: 4,
      album: 3,
      track: 2,
      playlist: 1,
    };

    let bestMatch = null;
    let highestScore = -1;

    // Check artists first (exact name match gets highest priority)
    const artistMatch = searchResults.artists.find(
      (artist) => artist.name.toLowerCase() === searchQuery.toLowerCase()
    );
    if (artistMatch) {
      return { type: 'artist', item: artistMatch };
    }

    // Calculate scores for all results
    Object.entries(searchResults).forEach(([type, items]) => {
      if (items.length > 0) {
        const baseTypeScore = typeScores[type.slice(0, -1)] || 0;
        items.forEach((item) => {
          let score = baseTypeScore;

          // Add relevance factors
          const name = item.name || item.title;
          if (name.toLowerCase() === searchQuery.toLowerCase()) score += 5;
          else if (name.toLowerCase().startsWith(searchQuery.toLowerCase()))
            score += 3;
          else if (name.toLowerCase().includes(searchQuery.toLowerCase()))
            score += 1;

          if (score > highestScore) {
            highestScore = score;
            bestMatch = { type: type.slice(0, -1), item };
          }
        });
      }
    });

    return bestMatch;
  };

  // Handle autocomplete suggestions
  const updateSuggestions = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const trackSuggestions = getAutocompleteSuggestions(
      mockTracks,
      searchQuery,
      {
        fields: ['title', 'artist'],
      }
    );

    const artistSuggestions = getAutocompleteSuggestions(
      mockArtists,
      searchQuery,
      {
        fields: ['name'],
      }
    );

    const allSuggestions = [
      ...new Set([...trackSuggestions, ...artistSuggestions]),
    ];
    setSuggestions(allSuggestions);
  }, []);

  useEffect(() => {
    handleSearch(query);
    updateSuggestions(query);
  }, [query, handleSearch, updateSuggestions]);

  const applyFilters = useCallback((filters, items) => {
    return items.filter((item) => {
      const matchesArtist =
        !filters.artist ||
        (item.artist || item.name || '')
          .toLowerCase()
          .includes(filters.artist.toLowerCase());

      const matchesAlbum =
        !filters.album ||
        (item.album || item.title || '')
          .toLowerCase()
          .includes(filters.album.toLowerCase());

      const matchesGenre =
        !filters.genre ||
        (item.genre || '').toLowerCase().includes(filters.genre.toLowerCase());

      const matchesYear =
        !filters.year ||
        (item.releaseYear || item.year || '').toString() === filters.year;

      const getDurationInSeconds = (duration) => {
        if (!duration) return 0;
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
      };

      const itemDuration = getDurationInSeconds(item.duration);
      const matchesDuration =
        !filters.duration ||
        (filters.duration === 'short' && itemDuration < 180) ||
        (filters.duration === 'medium' &&
          itemDuration >= 180 &&
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
          const getDurationInSeconds = (duration) => {
            if (!duration) return 0;
            const [minutes, seconds] = duration.split(':').map(Number);
            return minutes * 60 + seconds;
          };
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

    const { type, item } = bestResult;
    return (
      <div className={style.best_result}>
        <h2>Best Result</h2>
        <div className={style.best_result__content}>
          {type === 'artist' && <ArtistCard artist={item} />}
          {type === 'album' && <AlbumCard album={item} />}
          {type === 'track' && <TrackCard track={item} />}
          {type === 'playlist' && <PlaylistCard playlist={item} />}
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
              filterName="All"
              onFilter={handleFilterChange}
              isActive={activeFilter === 'All'}
            />
            <Filter
              filterName="Tracks"
              onFilter={handleFilterChange}
              isActive={activeFilter === 'Tracks'}
            />
            <Filter
              filterName="Albums"
              onFilter={handleFilterChange}
              isActive={activeFilter === 'Albums'}
            />
            <Filter
              filterName="Artists"
              onFilter={handleFilterChange}
              isActive={activeFilter === 'Artists'}
            />
          </div>
          <FilterMenu
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </header>

        <main className={style.results}>
          {isLoading ? (
            <div className={style.loading}>
              <div className={style.spinner}></div>
            </div>
          ) : query.trim() === '' ? (
            <div className={style.empty_state}>
              <FaSearch className={style.empty_icon} />
              <p>Search for your favorite songs, artists, or albums</p>
            </div>
          ) : (
            <>
              {showSuggestions && suggestions.length > 0 && (
                <div className={style.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className={style.suggestion_item}>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

              {bestResult && renderBestResult()}

              {(activeFilter === 'All' || activeFilter === 'Tracks') &&
                filteredResults.tracks.length > 0 && (
                  <HorizontalScroll
                    title={`Tracks (${filteredResults.tracks.length})`}
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

              {(activeFilter === 'All' || activeFilter === 'Albums') &&
                filteredResults.albums.length > 0 && (
                  <HorizontalScroll
                    title={`Albums (${filteredResults.albums.length})`}
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

              {(activeFilter === 'All' || activeFilter === 'Artists') &&
                filteredResults.artists.length > 0 && (
                  <HorizontalScroll
                    title={`Artists (${filteredResults.artists.length})`}
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
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === 'All' || activeFilter === 'Playlists') &&
                filteredResults.playlists.length > 0 && (
                  <HorizontalScroll
                    title={`Playlists (${filteredResults.playlists.length})`}
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
                  <p>No results found for "{query}"</p>
                  <p>Try searching for something else</p>
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
