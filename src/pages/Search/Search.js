import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import style from './Search.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import PlaylistCard from '../../components/UI/Cards/PlaylistCard';
import Filter from '../../components/UI/Filter/Filter';
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

const Search = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const INITIAL_LIMIT = 6;

  const handleSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ tracks: [], albums: [], artists: [], playlists: [] });
      return;
    }

    setIsLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      // Use intelligent search for each category
      const filteredTracks = intelligentSearch(mockTracks, searchQuery, {
        fields: ['title', 'artist'],
        usePhonetic: false,
      });

      const filteredAlbums = intelligentSearch(mockAlbums, searchQuery, {
        fields: ['title', 'artist'],
        usePhonetic: false,
      });

      const filteredArtists = intelligentSearch(mockArtists, searchQuery, {
        fields: ['name'],
        usePhonetic: true, // Enable phonetic matching for artists
        similarityThreshold: 0.3, // More lenient for artist names
      });

      const filteredPlaylists = intelligentSearch(mockPlaylists, searchQuery, {
        fields: ['title'],
        usePhonetic: false,
      });

      setResults({
        tracks: filteredTracks,
        albums: filteredAlbums,
        artists: filteredArtists,
        playlists: filteredPlaylists,
      });
      setIsLoading(false);
    }, 500);
  }, []);

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

  const handleFilterChange = useCallback((filterName) => {
    setActiveFilter(filterName);
  }, []);

  const handlePlay = useCallback((item) => {
    console.log('Playing:', item);
  }, []);

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

              {(activeFilter === 'All' || activeFilter === 'Tracks') &&
                results.tracks.length > 0 && (
                  <HorizontalScroll
                    title={`Tracks (${results.tracks.length})`}
                    showShowMore={results.tracks.length > INITIAL_LIMIT}
                    moreLink={`/search/tracks?query=${encodeURIComponent(query)}`}
                    itemCount={results.tracks.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {results.tracks.slice(0, INITIAL_LIMIT).map((track) => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === 'All' || activeFilter === 'Albums') &&
                results.albums.length > 0 && (
                  <HorizontalScroll
                    title={`Albums (${results.albums.length})`}
                    showShowMore={results.albums.length > INITIAL_LIMIT}
                    moreLink={`/search/albums?query=${encodeURIComponent(query)}`}
                    itemCount={results.albums.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {results.albums.slice(0, INITIAL_LIMIT).map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === 'All' || activeFilter === 'Artists') &&
                results.artists.length > 0 && (
                  <HorizontalScroll
                    title={`Artists (${results.artists.length})`}
                    showShowMore={results.artists.length > INITIAL_LIMIT}
                    moreLink={`/search/artists?query=${encodeURIComponent(query)}`}
                    itemCount={results.artists.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {results.artists.slice(0, INITIAL_LIMIT).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </HorizontalScroll>
                )}

              {(activeFilter === 'All' || activeFilter === 'Playlists') &&
                results.playlists.length > 0 && (
                  <HorizontalScroll
                    title={`Playlists (${results.playlists.length})`}
                    showShowMore={results.playlists.length > INITIAL_LIMIT}
                    moreLink={`/search/playlists?query=${encodeURIComponent(query)}`}
                    itemCount={results.playlists.length}
                    maxItems={INITIAL_LIMIT}
                  >
                    {results.playlists
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

              {Object.values(results).every((arr) => arr.length === 0) && (
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
