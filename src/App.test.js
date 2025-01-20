import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia
global.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: {
    setAttribute: jest.fn(),
  },
});

// Mock the lazy-loaded components
jest.mock('./pages/Main/Main', () => () => (
  <div data-testid="main">Main Content</div>
));
jest.mock('./components/partials/Navbar/Navbar', () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock('./components/partials/SideBarLeft/SideBar', () => () => (
  <div data-testid="sidebar-left">Left Sidebar</div>
));
jest.mock('./components/partials/SideBarRight/SideBar', () => () => (
  <div data-testid="sidebar-right">Right Sidebar</div>
));
jest.mock('./components/partials/AudioPlayer/AudioPlayerF', () => () => (
  <div data-testid="audio-player">Audio Player</div>
));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders without crashing', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-left')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-right')).toBeInTheDocument();
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });
});
