import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Artist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { generateGradient } from '../../utils/colorUtils';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';

import { mockArtists, mockTracks, mockAlbums } from '../../constant/mockData';

const Artist = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, currentTrack } = useAudioPlayer();

  const artist = mockArtists.find((a) => a.id === Number(id)) || mockArtists[0];
  const artistTracks = mockTracks.filter((track) =>
    track.artist.includes(artist.name)
  );
  const artistAlbums = mockAlbums.filter(
    (album) => album.artist === artist.name
  );

  // Generate unique gradient for this artist
  const headerStyle = generateGradient(artist.name);

  // Check if this artist's tracks are currently playing
  const isThisPlaying =
    isPlaying && currentTrack && artistTracks.includes(currentTrack);

  const handlePlayClick = useCallback(() => {
    if (!artist || artistTracks.length === 0) {
      console.warn(`No tracks found for artist: ${artist?.name}`);
      return;
    }

    handlePlay({
      track: artistTracks[0],
      tracks: artistTracks,
      action: isThisPlaying ? 'pause' : 'play',
    });
  }, [artist, artistTracks, handlePlay, isThisPlaying]);

  const handleTrackPlay = useCallback(
    (track) => {
      if (!artist) return;
      handlePlay({
        track,
        tracks: artistTracks,
        action: isPlaying && currentTrack?.id === track.id ? 'pause' : 'play',
      });
    },
    [artist, artistTracks, handlePlay, isPlaying, currentTrack]
  );

  const handleShuffle = useCallback(() => {
    if (!artist || artistTracks.length === 0) return;

    const shuffledTracks = [...artistTracks].sort(() => Math.random() - 0.5);

    handlePlay({
      track: shuffledTracks[0],
      tracks: shuffledTracks,
      action: 'play',
    });
  }, [artist, artistTracks, handlePlay]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (duration) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.header} style={headerStyle}>
          <div className={styles.header__container}>
            <img
              className={styles.header__container__image}
              src={artist.imageUrl}
              alt={artist.name}
              loading="lazy"
            />
          </div>
          <div className={styles.header__info}>
            <span>Artist</span>
            <h1 className={styles.header__info__title}>{artist.name}</h1>
            <div className={styles.header__info__more}>
              <span>{formatNumber(artist.followers)} followers</span>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.main__header}>
            <div className={styles.main__header__container}>
              <button
                className={styles.main__header__container__button}
                onClick={handlePlayClick}
                aria-label={
                  isThisPlaying
                    ? `Pause ${artist.name}'s popular tracks`
                    : `Play ${artist.name}'s popular tracks`
                }
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${styles.main__header__container__button} ${styles.shuffle_button}`}
                onClick={handleShuffle}
                aria-label={`Shuffle ${artist.name}'s tracks`}
              >
                <PiShuffleBold />
              </button>
            </div>
          </div>

          <div className={styles.main__content}>
            <section className={styles.popular}>
              <h2>Popular Tracks</h2>
              <div className={styles.tracks}>
                {artistTracks.slice(0, 5).map((track, index) => (
                  <div
                    key={track.id}
                    className={styles.track}
                    onClick={() => handleTrackPlay(track)}
                  >
                    <div className={styles.track__info}>
                      {isPlaying &&
                      currentTrack &&
                      currentTrack.id === track.id ? (
                        <button
                          className={`${styles.track__play_icon} ${styles.visible}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackPlay(track);
                          }}
                          aria-label={
                            isPlaying && currentTrack.id === track.id
                              ? 'Pause track'
                              : 'Play track'
                          }
                        >
                          <WaveformAnimation className={styles.waveform} />
                          <FaPause className={styles.pause_icon} />
                        </button>
                      ) : (
                        <>
                          <span className={styles.track__number}>
                            {index + 1}
                          </span>
                          <button
                            className={styles.track__play_icon}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrackPlay(track);
                            }}
                            aria-label="Play track"
                          >
                            <FaPlay />
                          </button>
                        </>
                      )}
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className={styles.track__image}
                      />
                      <div className={styles.track__details}>
                        {isPlaying &&
                        currentTrack &&
                        currentTrack.id === track.id ? (
                          <span
                            className={`${styles.track__title} ${styles.green}`}
                          >
                            {track.title}
                          </span>
                        ) : (
                          <span className={styles.track__title}>
                            {track.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={styles.track__plays}>
                      {formatNumber(track.plays || 0)} plays
                    </span>
                    <span className={styles.track__duration}>
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.discography}>
              <HorizontalScroll title="Albums">
                {artistAlbums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPlay={handleTrackPlay}
                  />
                ))}
              </HorizontalScroll>
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Artist;
