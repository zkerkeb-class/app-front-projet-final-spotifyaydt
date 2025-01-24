import Audio1 from '../assests/audio/lazy-day.mp3';
import Audio2 from '../assests/audio/creative-technology.mp3';
import Audio3 from '../assests/audio/lost-in-dreams.mp3';
import Audio4 from '../assests/audio/nightfall.mp3';
import Audio5 from '../assests/audio/showreel.mp3';
import Audio6 from '../assests/audio/soulsweeper.mp3';
import Audio7 from '../assests/audio/spinning-head.mp3';
import Audio8 from '../assests/audio/stylish-deep.mp3';
import Audio9 from '../assests/audio/tell-me-the-truth.mp3';
import Audio10 from '../assests/audio/vlog.mp3';

const audioFiles = [
  Audio1,
  Audio2,
  Audio3,
  Audio4,
  Audio5,
  Audio6,
  Audio7,
  Audio8,
  Audio9,
  Audio10,
];

export const mockArtists = [
  {
    id: 1,
    name: 'The Weeknd',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb',
    followers: 108435789,
    type: 'artist',
    genres: ['pop', 'r&b', 'hip-hop'],
  },
  {
    id: 2,
    name: 'Doja Cat',
    imageUrl: '',
    followers: 54321789,
    type: 'artist',
    genres: ['pop', 'hip-hop', 'rap'],
  },
  {
    id: 3,
    name: 'Drake',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
    followers: 98765432,
    type: 'artist',
    genres: ['rap', 'hip-hop', 'r&b'],
  },
  {
    id: 4,
    name: 'Taylor Swift',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
    followers: 87654321,
    type: 'artist',
    genres: ['pop', 'country', 'folk'],
  },
  {
    id: 5,
    name: 'Ed Sheeran',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6',
    followers: 95432167,
    type: 'artist',
    genres: ['pop', 'folk', 'acoustic'],
  },
  {
    id: 6,
    name: 'Ariana Grande',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952',
    followers: 89765432,
    type: 'artist',
    genres: ['pop', 'r&b', 'trap-pop'],
  },
  {
    id: 7,
    name: 'Post Malone',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb6be070445b03e0b63147c2c1',
    followers: 76543210,
    type: 'artist',
    genres: ['hip-hop', 'rap', 'pop-rap'],
  },
  {
    id: 8,
    name: 'Billie Eilish',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf',
    followers: 82345678,
    type: 'artist',
    genres: ['pop', 'alternative', 'electropop'],
  },
  {
    id: 9,
    name: 'Bad Bunny',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb8ee9a6f54dcbd4bc95126b14',
    followers: 93456789,
    type: 'artist',
    genres: ['reggaeton', 'latin', 'trap-latino'],
  },
  {
    id: 10,
    name: 'Justin Bieber',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36',
    followers: 88776655,
    type: 'artist',
    genres: ['pop', 'dance-pop', 'canadian-pop'],
  },
];

// Generate 3 albums for each artist
export const mockAlbums = mockArtists.flatMap((artist, artistIndex) => {
  const albumTitles = {
    1: ['After Hours', 'Starboy', 'Dawn FM'],
    2: ['Planet Her', 'Hot Pink', 'Amala'],
    3: ['Certified Lover Boy', 'Scorpion', 'Views'],
    4: ['Midnights', '1989', 'Red'],
    5: ['÷ (Divide)', '× (Multiply)', '+ (Plus)'],
    6: ['Positions', 'Thank U, Next', 'Sweetener'],
    7: ["Hollywood's Bleeding", 'Beerbongs & Bentleys', 'Stoney'],
    8: ['Happier Than Ever', 'When We All Fall Asleep', 'Dont Smile at Me'],
    9: ['Un Verano Sin Ti', 'YHLQMDLG', 'X 100PRE'],
    10: ['Justice', 'Changes', 'Purpose'],
  };

  const years = {
    1: [2020, 2016, 2022],
    2: [2021, 2019, 2018],
    3: [2021, 2018, 2016],
    4: [2022, 2014, 2012],
    5: [2017, 2014, 2011],
    6: [2020, 2019, 2018],
    7: [2019, 2018, 2016],
    8: [2021, 2019, 2017],
    9: [2022, 2020, 2018],
    10: [2021, 2020, 2015],
  };

  return Array(3)
    .fill()
    .map((_, i) => ({
      id: artistIndex * 3 + i + 1,
      title: albumTitles[artist.id][i],
      artist: artist.name,
      coverUrl: `https://picsum.photos/400?random=${artistIndex * 3 + i}`,
      year: years[artist.id][i],
      type: 'album',
      trackCount: 10,
      duration: '45:00',
    }));
});

// Generate 10 tracks for each album
export const mockTracks = mockAlbums.flatMap((album, albumIndex) => {
  return Array(10)
    .fill()
    .map((_, i) => ({
      id: albumIndex * 10 + i + 1,
      title: `${album.title} - Track ${i + 1}`,
      artist: album.artist,
      album: album.title,
      coverUrl: album.coverUrl,
      audio: audioFiles[i % 10],
      duration: '3:30',
      type: 'track',
      releaseYear: album.year,
      genre: mockArtists.find((artist) => artist.name === album.artist)
        .genres[0],
      isLiked: Math.random() > 0.5,
      plays: Math.floor(Math.random() * 5000000) + 1000000,
      addedDate: `${album.year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      lyrics: true,
      explicit: Math.random() > 0.7,
      mood: ['Energetic', 'Chill', 'Happy', 'Sad', 'Party', 'Focus'][
        Math.floor(Math.random() * 6)
      ],
    }));
});

export const mockPlaylists = [
  {
    id: 1,
    title: "Today's Top Hits",
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112',
    description: 'The hottest tracks in your region',
    type: 'playlist',
    trackCount: 10,
    followers: 32456789,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks.slice(0, 10).map((track) => track.id),
  },
  {
    id: 2,
    title: 'RapCaviar',
    coverUrl: '',
    description: "Hip-hop's heavy hitters and rising stars",
    type: 'playlist',
    trackCount: 10,
    followers: 15678932,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.genre === 'rap')
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 3,
    title: 'Pop Rising',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1',
    description: 'The hits of tomorrow are on Spotify today',
    type: 'playlist',
    trackCount: 10,
    followers: 8765432,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.genre === 'pop')
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 4,
    title: 'Mood Booster',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002bd0e19e810bb4b55ab164a95',
    description: "Get happy with today's dose of feel-good songs!",
    type: 'playlist',
    trackCount: 10,
    followers: 12345678,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.mood === 'Happy')
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 5,
    title: 'Chill Hits',
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000025ae7aa0454c9eafdd6505fda',
    description: 'Kick back to the best new and recent chill hits',
    type: 'playlist',
    trackCount: 10,
    followers: 9876543,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.mood === 'Chill')
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 6,
    title: 'Rock Classics',
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000025d87659dcadef82dd0e73f56',
    description:
      'Rock legends & epic songs that continue to inspire generations',
    type: 'playlist',
    trackCount: 10,
    followers: 7654321,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks.slice(50, 60).map((track) => track.id),
  },
  {
    id: 7,
    title: 'All Out 2010s',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1',
    description: 'The biggest songs of the 2010s',
    type: 'playlist',
    trackCount: 10,
    followers: 6543210,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.releaseYear >= 2010 && track.releaseYear < 2020)
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 8,
    title: 'Focus Flow',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
    description: 'Uptempo instrumental hip hop beats',
    type: 'playlist',
    trackCount: 10,
    followers: 5432109,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.mood === 'Focus')
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 9,
    title: 'Viral Hits',
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31',
    description: 'Viral, trending and taking off',
    type: 'playlist',
    trackCount: 10,
    followers: 4321098,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((track) => track.id),
  },
  {
    id: 10,
    title: 'Party Mix',
    coverUrl: '',
    description: 'Move your feet to these dance hits',
    type: 'playlist',
    trackCount: 10,
    followers: 3210987,
    owner: 'Spotify',
    isPublic: true,
    tracks: mockTracks
      .filter((track) => track.mood === 'Party')
      .slice(0, 10)
      .map((track) => track.id),
  },
];

export const mockRecentlyPlayed = [
  {
    id: 1,
    title: mockTracks[0].title,
    artist: mockTracks[0].artist,
    coverUrl: mockTracks[0].coverUrl,
    type: 'track',
    audio: mockTracks[0].audio,
    playedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    title: mockPlaylists[0].title,
    coverUrl: mockPlaylists[0].coverUrl,
    type: 'playlist',
    playedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 3,
    name: mockArtists[2].name,
    imageUrl: mockArtists[2].imageUrl,
    type: 'artist',
    playedAt: '2024-01-20T08:45:00Z',
  },
  {
    id: 4,
    title: mockAlbums[3].title,
    artist: mockAlbums[3].artist,
    coverUrl: mockAlbums[3].coverUrl,
    type: 'album',
    playedAt: '2024-01-20T07:20:00Z',
  },
];
