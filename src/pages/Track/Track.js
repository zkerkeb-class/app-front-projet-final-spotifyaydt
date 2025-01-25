import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import style from './Track.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import { mockTracks, mockAlbums } from '../../constant/mockData';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import { formatDuration } from '../../utils/formatters';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';

const Track = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, currentTrack, handlePause } = useAudioPlayer();
  const track = mockTracks.find((t) => t.id === id);
  const album = mockAlbums.find((a) => a.title === track.album);

  if (!track) {
    return <div>Track not found</div>;
  }

  const handlePlayClick = () => {
    if (isPlaying && currentTrack?.id === track.id) {
      handlePause();
    } else {
      handlePlay(track);
    }
  };

  const handleLike = useCallback(() => {
    console.log('Toggle like for track:', track);
    // Implement your like logic here
  }, [track]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <div className={style.content}>
          <div className={style.track_info}>
            <div className={style.cover}>
              <img
                src={track.coverUrl}
                alt={track.title}
                className={style.cover_image}
                loading="lazy"
              />
              <button
                className={style.play_button}
                onClick={handlePlayClick}
                aria-label={
                  isPlaying && currentTrack?.id === track.id
                    ? `Pause ${track.title}`
                    : `Play ${track.title}`
                }
              >
                {isPlaying && currentTrack?.id === track.id ? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )}
              </button>
            </div>

            <div className={style.details}>
              <h1 className={style.title}>{track.title}</h1>
              <p className={style.artist}>{track.artist}</p>
              <div className={style.meta}>
                <span>{track.album}</span>
                <span>•</span>
                <span>{track.releaseYear}</span>
                <span>•</span>
                <span>{track.duration}</span>
              </div>

              <div className={style.stats}>
                <button
                  className={`${style.like_button} ${track.isLiked ? style.liked : ''}`}
                  onClick={handleLike}
                  aria-label={track.isLiked ? 'Unlike track' : 'Like track'}
                >
                  <FaHeart />
                </button>
                <span className={style.plays}>
                  {formatNumber(track.plays)} plays
                </span>
              </div>
            </div>
          </div>

          <div className={style.additional_info}>
            {track.lyrics && (
              <section className={style.lyrics}>
                <h2>Lyrics</h2>
                <p>Lyrics are available for this track</p>
              </section>
            )}

            <section className={style.track_details}>
              <h2>Track Details</h2>
              <div className={style.detail_grid}>
                <div className={style.detail_item}>
                  <span className={style.label}>Album</span>
                  <span className={style.value}>{track.album}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>Artist</span>
                  <span className={style.value}>{track.artist}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>Genre</span>
                  <span className={style.value}>{track.genre}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>Release Year</span>
                  <span className={style.value}>{track.releaseYear}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>Duration</span>
                  <span className={style.value}>{track.duration}</span>
                </div>
                <div className={style.detail_item}>
                  <span className={style.label}>Mood</span>
                  <span className={style.value}>{track.mood}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Track;
