import React, { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const ArtistCard = ({ artist, onPlay }) => {
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  // Check if this specific artist is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === artist.id;

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/artist/${artist.id}`);
    },
    [navigate, artist.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const artistTracks = mockTracks
        .filter((track) => track.artist === artist.name)
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

      if (artistTracks.length === 0) {
        console.warn(`No tracks found for artist: ${artist.name}`);
        return;
      }

      handlePlay({
        track: artistTracks[0],
        tracks: artistTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [artist, handlePlay, isThisPlaying]
  );

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

  return (
    <Link
      to={`/artist/${artist.id}`}
      className={`${styles.card} ${styles.artistCard}`}
    >
      <div className={styles.artistImageContainer}>
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className={`${styles.image} ${styles.artistImage}`}
            loading="lazy"
          />
        ) : (
          <CardFallbackIcon type="artist" />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? `Pause ${artist.name}'s top tracks`
              : `Play ${artist.name}'s top tracks`
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.followers}>
          {new Intl.NumberFormat().format(artist.followers)} followers
        </p>
      </div>
    </Link>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    followers: PropTypes.number.isRequired,
  }).isRequired,
  onPlay: PropTypes.func,
};

export default ArtistCard;
