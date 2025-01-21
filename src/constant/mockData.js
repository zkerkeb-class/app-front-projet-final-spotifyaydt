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
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb7dd9647a6512e6f6978b5a86',
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
];

export const mockTracks = [
  // The Weeknd Tracks
  {
    id: 1,
    title: 'Lazy Day',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
    audio: Audio1,
    duration: '3:45',
    type: 'track',
    releaseYear: 2020,
    genre: 'Pop',
    isLiked: true,
    plays: 3245678,
    addedDate: '2020-03-20',
    lyrics: true,
    explicit: false,
    mood: 'Relaxing',
  },
  {
    id: 2,
    title: 'Creative Technology',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
    audio: Audio2,
    duration: '4:20',
    type: 'track',
    releaseYear: 2020,
    genre: 'R&B',
    isLiked: false,
    plays: 2987654,
    addedDate: '2020-03-20',
    lyrics: true,
    explicit: false,
    mood: 'Energetic',
  },
  {
    id: 3,
    title: 'Lost in Dreams',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
    audio: Audio3,
    duration: '3:15',
    type: 'track',
    releaseYear: 2020,
    genre: 'Pop',
    isLiked: true,
    plays: 2134567,
    addedDate: '2020-03-20',
    lyrics: true,
    explicit: false,
    mood: 'Dreamy',
  },

  // Doja Cat Tracks
  {
    id: 4,
    title: 'Nightfall',
    artist: 'Doja Cat',
    album: 'Planet Her',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273b0e4102646726ec6f7da755a',
    audio: Audio4,
    duration: '5:30',
    type: 'track',
    releaseYear: 2021,
    genre: 'Pop',
    isLiked: true,
    plays: 1987654,
    addedDate: '2021-04-09',
    lyrics: true,
    explicit: true,
    mood: 'Atmospheric',
  },
  {
    id: 5,
    title: 'Showreel',
    artist: 'Doja Cat',
    album: 'Planet Her',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273b0e4102646726ec6f7da755a',
    audio: Audio5,
    duration: '4:10',
    type: 'track',
    releaseYear: 2021,
    genre: 'Hip-Hop',
    isLiked: false,
    plays: 1876543,
    addedDate: '2021-04-09',
    lyrics: true,
    explicit: true,
    mood: 'Confident',
  },
  {
    id: 6,
    title: 'Soulsweeper',
    artist: 'Doja Cat',
    album: 'Planet Her',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273b0e4102646726ec6f7da755a',
    audio: Audio6,
    duration: '3:55',
    type: 'track',
    releaseYear: 2021,
    genre: 'Pop',
    isLiked: true,
    plays: 1765432,
    addedDate: '2021-04-09',
    lyrics: true,
    explicit: true,
    mood: 'Fun',
  },

  // Drake Tracks
  {
    id: 7,
    title: 'Spinning Head',
    artist: 'Drake',
    album: 'Certified Lover Boy',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c',
    audio: Audio7,
    duration: '6:15',
    type: 'track',
    releaseYear: 2021,
    genre: 'Hip-Hop',
    isLiked: false,
    plays: 2345678,
    addedDate: '2021-09-03',
    lyrics: true,
    explicit: true,
    mood: 'Confident',
  },
  {
    id: 8,
    title: 'Stylish Deep',
    artist: 'Drake',
    album: 'Certified Lover Boy',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c',
    audio: Audio8,
    duration: '4:45',
    type: 'track',
    releaseYear: 2021,
    genre: 'Rap',
    isLiked: true,
    plays: 2234567,
    addedDate: '2021-09-03',
    lyrics: true,
    explicit: true,
    mood: 'Smooth',
  },
  {
    id: 9,
    title: 'Tell Me The Truth',
    artist: 'Drake',
    album: 'Certified Lover Boy',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c',
    audio: Audio9,
    duration: '5:20',
    type: 'track',
    releaseYear: 2021,
    genre: 'R&B',
    isLiked: true,
    plays: 2123456,
    addedDate: '2021-09-03',
    lyrics: true,
    explicit: true,
    mood: 'Emotional',
  },

  // Taylor Swift Tracks
  {
    id: 10,
    title: 'Vlog Life',
    artist: 'Taylor Swift',
    album: 'Midnights',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    audio: Audio10,
    duration: '3:30',
    type: 'track',
    releaseYear: 2022,
    genre: 'Pop',
    isLiked: false,
    plays: 3456789,
    addedDate: '2022-10-21',
    lyrics: true,
    explicit: false,
    mood: 'Upbeat',
  },
];

export const mockAlbums = [
  {
    id: 1,
    title: 'After Hours',
    artist: 'The Weeknd',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
    year: 2020,
    type: 'album',
    trackCount: 14,
    duration: '56:23',
    tracks: [1, 2, 3], // Track IDs
  },
  {
    id: 2,
    title: 'Planet Her',
    artist: 'Doja Cat',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273b0e4102646726ec6f7da755a',
    year: 2021,
    type: 'album',
    trackCount: 19,
    duration: '1:08:43',
    tracks: [4, 5, 6], // Track IDs
  },
  {
    id: 3,
    title: 'Certified Lover Boy',
    artist: 'Drake',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c',
    year: 2021,
    type: 'album',
    trackCount: 21,
    duration: '1:26:02',
    tracks: [7, 8, 9], // Track IDs
  },
  {
    id: 4,
    title: 'Midnights',
    artist: 'Taylor Swift',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    year: 2022,
    type: 'album',
    trackCount: 13,
    duration: '44:09',
    tracks: [10], // Track IDs
  },
];

export const mockPlaylists = [
  {
    id: 1,
    title: "Today's Top Hits",
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112',
    description: 'The hottest tracks in your region',
    type: 'playlist',
    trackCount: 50,
    followers: 32456789,
    owner: 'Spotify',
    isPublic: true,
    tracks: [1, 4, 7, 10, 2], // Track IDs - mix of different artists
  },
  {
    id: 2,
    title: 'RapCaviar',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002b1c181ae600398a6a94c8b37',
    description: 'New music from Drake, Future and more',
    type: 'playlist',
    trackCount: 50,
    followers: 15678932,
    owner: 'Spotify',
    isPublic: true,
    tracks: [7, 8, 9, 5, 6], // Track IDs - focus on rap/hip-hop
  },
  {
    id: 3,
    title: 'All Out 2010s',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1',
    description: 'The biggest songs of the 2010s',
    type: 'playlist',
    trackCount: 100,
    followers: 8765432,
    owner: 'Spotify',
    isPublic: true,
    tracks: [1, 2, 3, 4, 5], // Track IDs - mix of popular tracks
  },
  {
    id: 4,
    title: 'Mood Booster',
    coverUrl:
      'https://i.scdn.co/image/ab67706f00000002bd0e19e810bb4b55ab164a95',
    description: "Get happy with today's dose of feel-good songs!",
    type: 'playlist',
    trackCount: 75,
    followers: 12345678,
    owner: 'Spotify',
    isPublic: true,
    tracks: [10, 6, 2, 4, 8], // Track IDs - upbeat/positive tracks
  },
];

export const mockRecentlyPlayed = [
  {
    id: 1,
    title: 'Lazy Day',
    artist: 'The Weeknd',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
    type: 'track',
    audio: Audio1,
    playedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    title: "Today's Top Hits",
    coverUrl:
      'https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112',
    type: 'playlist',
    playedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 3,
    name: 'Drake',
    imageUrl:
      'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
    type: 'artist',
    playedAt: '2024-01-20T08:45:00Z',
  },
  {
    id: 4,
    title: 'Midnights',
    artist: 'Taylor Swift',
    coverUrl:
      'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
    type: 'album',
    playedAt: '2024-01-20T07:20:00Z',
  },
];
