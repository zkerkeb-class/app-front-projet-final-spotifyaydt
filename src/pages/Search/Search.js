import React, { useState, useCallback, useEffect } from 'react';
import style from './Search.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import Filter from '../../components/UI/Filter/Filter';

import { FaSearch } from 'react-icons/fa';
import { mockTracks, mockAlbums, mockArtists } from '../../constant/mockData';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [results, setResults] = useState({
    tracks: [],
    albums: [],
    artists: [],
  });

  const handleSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ tracks: [], albums: [], artists: [] });
      return;
    }

    const searchTerm = searchQuery.toLowerCase();

    const filteredTracks = mockTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm)
    );

    const filteredAlbums = mockAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(searchTerm) ||
        album.artist.toLowerCase().includes(searchTerm)
    );

    const filteredArtists = mockArtists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm)
    );

    setResults({
      tracks: filteredTracks,
      albums: filteredAlbums,
      artists: filteredArtists,
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  const handleFilterChange = useCallback((filterName) => {
    setActiveFilter(filterName);
  }, []);

  const handlePlay = useCallback((item) => {
    console.log('Playing:', item);
    // Implement your play logic here
  }, []);

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.search_bar}>
            <FaSearch className={style.search_icon} />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={style.search_input}
            />
          </div>

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
          {query.trim() === '' ? (
            <div className={style.empty_state}>
              <FaSearch className={style.empty_icon} />
              <p>Search for your favorite songs, artists, or albums</p>
            </div>
          ) : (
            <>
              {(activeFilter === 'All' || activeFilter === 'Tracks') &&
                results.tracks.length > 0 && (
                  <section className={style.section}>
                    <h2>Tracks</h2>
                    <div className={style.grid}>
                      {results.tracks.map((track) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          onPlay={handlePlay}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === 'All' || activeFilter === 'Albums') &&
                results.albums.length > 0 && (
                  <section className={style.section}>
                    <h2>Albums</h2>
                    <div className={style.grid}>
                      {results.albums.map((album) => (
                        <AlbumCard
                          key={album.id}
                          album={album}
                          onPlay={handlePlay}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === 'All' || activeFilter === 'Artists') &&
                results.artists.length > 0 && (
                  <section className={style.section}>
                    <h2>Artists</h2>
                    <div className={style.grid}>
                      {results.artists.map((artist) => (
                        <ArtistCard
                          key={artist.id}
                          artist={artist}
                          onPlay={handlePlay}
                        />
                      ))}
                    </div>
                  </section>
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
