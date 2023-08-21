import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks } from 'jest-fetch-mock';

import { App } from './App';
import { GoLProvider } from './pages/Game/Context/GameOfLifeContext';

enableFetchMocks();

global.innerWidth = 1920;
global.innerHeight = 640;

describe('routing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('/ routes to Home page', () => {
    window.history.pushState({}, 'Default Route', '/');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    expect(screen.getByTestId('play-link')).toBeInTheDocument();
  });

  test('/game routes to Game page', () => {
    window.history.pushState({}, 'Game Route', '/game');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  test('Clicking play button from Home page routes to game page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Default Route', '/');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    await act(async () => {
      await user.click(screen.getByTestId('play-link'));
    });

    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  test('Clicking home button from Game page routes to the home page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Game Route', '/game');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    await act(async () => {
      await user.click(screen.getByTestId('home-link'));
    });

    expect(screen.getByTestId('play-link')).toBeInTheDocument();
  });

  test('Clicking about button from Home page routes to the about page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Default Route', '/');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    await act(async () => {
      await user.click(screen.getByTestId('about-link'));
    });

    expect(screen.getByTestId('game-explanation')).toBeInTheDocument();
  });

  test('Clicking home button from the About page routes to the home page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'About Page', '/about');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    await act(async () => {
      await user.click(screen.getByTestId('home-link'));
    });

    expect(screen.getByTestId('play-link')).toBeInTheDocument();
  });

  test('Clicking an example loads the data into the field', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Game Page', '/game');
    render(
      <GoLProvider>
        <App />
      </GoLProvider>
    );
    await act(async () => {
      await user.click(screen.getByTestId('examples-link'));
    });

    await waitFor(async () => {
      expect(screen.getByTestId('blinker-link')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByTestId('blinker-link'));
    });

    const gameState = JSON.parse(screen.getByTestId('game-data').textContent!);

    expect(gameState).toEqual([
      { x: 17, y: 5 },
      { x: 17, y: 6 },
      { x: 17, y: 7 },
    ]);
  });
});
