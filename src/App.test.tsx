import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks } from 'jest-fetch-mock';

import { App } from './App';

enableFetchMocks();

describe('routing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('/ routes to Home page', () => {
    window.history.pushState({}, 'Default Route', '/');
    render(<App />);
    expect(screen.getByTestId('play-link')).toBeInTheDocument();
  });

  test('/game routes to Game page', () => {
    window.history.pushState({}, 'Game Route', '/game');
    render(<App />);
    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  test('Clicking play button from Home page routes to game page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Default Route', '/');
    render(<App />);
    await act(async () => {
      await user.click(screen.getByTestId('play-link'));
    });

    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  test('Clicking home button from Game page routes to the homne page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.history.pushState({}, 'Game Route', '/game');
    render(<App />);
    await act(async () => {
      await user.click(screen.getByTestId('home-link'));
    });

    expect(screen.getByTestId('play-link')).toBeInTheDocument();
  });
});
