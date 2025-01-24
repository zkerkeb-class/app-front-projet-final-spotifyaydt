import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import style from './Navbar.module.scss';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  mockTracks,
  mockAlbums,
  mockArtists,
} from '../../../constant/mockData';

//icons
import { FiSearch, FiClock, FiX } from 'react-icons/fi';
import { GrHomeRounded } from 'react-icons/gr';
import { FaSpotify } from 'react-icons/fa';
import { PiSunDimFill } from 'react-icons/pi';
import { PiMoonFill } from 'react-icons/pi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaUserNinja, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { FaGlobe } from 'react-icons/fa';
import { BsInboxes, BsInboxesFill } from 'react-icons/bs';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const avatarUrl = `https://picsum.photos/200?random=1`;

  const [language, setLanguage] = useState('ENG');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Cache for search results
  const searchCache = new Map();

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Check cache first
    if (searchCache.has(query)) {
      setSearchResults(searchCache.get(query));
      return;
    }

    setIsLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const searchTerm = query.toLowerCase();

      // Limit initial results
      const tracks = mockTracks
        .filter(
          (track) =>
            track.title.toLowerCase().includes(searchTerm) ||
            track.artist.toLowerCase().includes(searchTerm)
        )
        .slice(0, 3);

      const albums = mockAlbums
        .filter(
          (album) =>
            album.title.toLowerCase().includes(searchTerm) ||
            album.artist.toLowerCase().includes(searchTerm)
        )
        .slice(0, 2);

      const artists = mockArtists
        .filter((artist) => artist.name.toLowerCase().includes(searchTerm))
        .slice(0, 2);

      const results = {
        tracks,
        albums,
        artists,
        query,
      };

      // Cache the results
      searchCache.set(query, results);
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        debouncedSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    // Check if we can go back (not on home page and has history)
    setCanGoBack(location.pathname !== '/' && window.history.length > 1);

    // Check if we can go forward
    setCanGoForward(window.history.state?.idx < window.history.length - 1);
  }, [location]);

  // Add click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${style.search_bar}`)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(true); // Only show dropdown (recent searches) when empty
    }
  };

  const handleClearSearch = (e) => {
    e.preventDefault(); // Prevent any bubbling
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(true); // Show dropdown with recent searches after clearing
  };

  const handleClearHistory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem('recentSearches');
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    // Only show dropdown if search is empty
    if (!searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Add to recent searches with timestamp
    const timestamp = Date.now();
    const searchItem = { query, timestamp };

    // Get existing searches from localStorage
    const existingSearches = JSON.parse(
      localStorage.getItem('recentSearches') || '[]'
    );

    // Add new search and limit to 8 items
    const updatedSearches = [
      searchItem,
      ...existingSearches.filter((item) => item.query !== query),
    ].slice(0, 8);

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Navigate to search page with query
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  // Get recent searches from localStorage
  const getRecentSearches = useCallback(() => {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    return searches.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, []);

  const handleSearchItemClick = (query) => {
    setSearchQuery(query);
    handleSearch(query); // Use handleSearch instead of direct navigation
    setShowResults(false);
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleDeleteSearchItem = (e, timestamp) => {
    e.stopPropagation(); // Prevent triggering the parent click

    // Get existing searches
    const existingSearches = JSON.parse(
      localStorage.getItem('recentSearches') || '[]'
    );

    // Remove the specific search item
    const updatedSearches = existingSearches.filter(
      (item) => item.timestamp !== timestamp
    );

    // Save back to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Force a re-render by updating state
    setSearchResults([]); // Reset search results to trigger re-render
  };

  return (
    <div className={style.container}>
      <div className={style.navigation_buttons}>
        <div className={style.logo}>
          <div className={style.logo_icon}>
            <FaSpotify />
          </div>
          <span>Spotify AYDT</span>
        </div>
        <div className={style.nav_button}>
          <button
            className={`${style.nav_buttons} ${!canGoBack ? style.disabled : ''}`}
            onClick={handleGoBack}
            aria-label="Go back"
            disabled={!canGoBack}
            title="Back"
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${style.nav_buttons} ${!canGoForward ? style.disabled : ''}`}
            onClick={handleGoForward}
            aria-label="Go forward"
            disabled={!canGoForward}
            title="Forward"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className={style.middle_cont}>
        <Link to="/" className={style.nav_large_button} title="Home">
          <GrHomeRounded className={style.middle_cont_icon} />
        </Link>
        <div className={style.search_bar}>
          <div className={style.search_wrapper}>
            <span
              className={style.search_icon}
              title="Search"
              onClick={handleSearchIconClick}
              style={{ cursor: 'pointer' }}
            >
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Que souhaitez-vous écouter ?"
              className={style.search_input}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleSearchFocus}
            />
            {showResults && !searchQuery && (
              <div className={style.search_results}>
                <div className={style.result_section}>
                  <h3>Recent Searches</h3>
                  {getRecentSearches().map((item, index) => (
                    <div
                      key={item.timestamp}
                      className={style.result_item}
                      onClick={() => handleSearchItemClick(item.query)}
                    >
                      <FiClock className={style.search_history_icon} />
                      <span>{item.query}</span>
                      <FiX
                        className={style.delete_icon}
                        onClick={(e) =>
                          handleDeleteSearchItem(e, item.timestamp)
                        }
                      />
                    </div>
                  ))}
                </div>
                {getRecentSearches().length > 0 && (
                  <div
                    className={style.clear_history}
                    onClick={handleClearHistory}
                  >
                    Clear search history
                  </div>
                )}
              </div>
            )}
            <span
              className={style.grouped_icon}
              title={searchQuery ? 'Clear search' : 'Sort'}
              onClick={searchQuery ? handleClearSearch : undefined}
            >
              {searchQuery ? (
                <FiX />
              ) : (
                <Link to="/inbox" className={style.grouped_link}>
                  <BsInboxes />
                </Link>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className={style.user_controls}>
        <button
          onClick={toggleTheme}
          className={style.theme_toggle}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? (
            <PiSunDimFill className={style.toggle_icon} />
          ) : (
            <PiMoonFill className={style.toggle_icon} />
          )}
        </button>
        <button className={style.user_button}>
          <HiMiniUserGroup className={style.user_icon} title="User" />
        </button>
        <div className={style.language_selector}>
          <FaGlobe aria-hidden="true" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="FR">FR</option>
            <option value="EN">EN</option>
            <option value="AR">AR</option>
          </select>
        </div>
        <div className={style.avatar_button}>
          <img src={avatarUrl} alt="avatar" className={style.avatar} />
          <FaUserNinja className={style.avatar} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
