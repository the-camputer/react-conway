import userEvent from '@testing-library/user-event';
import GameOfLife from './GameOfLife';
import { render, act, screen } from '@testing-library/react';

global.innerWidth = 1920;
global.innerHeight = 640;

describe('GameOfLife', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders game without crashing', () => {
    let view = render(<GameOfLife />);
    expect(view).toMatchSnapshot();
  });

  it('calcualtes a new game state on a regular cadence during play', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<GameOfLife />);

    let gameState1 = JSON.parse(screen.getByTestId('game-data').textContent!);

    await act(async () => {
      await user.click(screen.getByTestId('play-game'));
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    let gameState2 = JSON.parse(screen.getByTestId('game-data').textContent!);

    expect(gameState1[0]).toEqual(expect.objectContaining({ x: 15, y: 2 }));
    expect(gameState2[0]).toEqual(expect.objectContaining({ x: 14, y: 3 }));
  });

  it('adds a clicked cell that is currently dead to the game state to be rendered alive', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<GameOfLife />);

    await act(async () => {
      await user.pointer({
        keys: '[MouseLeft]',
        coords: { clientX: 120, clientY: 160 },
        target: screen.getByTestId('gol-canvas'),
      });
    });

    let gameState = JSON.parse(screen.getByTestId('game-data').textContent!);
    expect(gameState).toEqual(
      expect.arrayContaining([expect.objectContaining({ x: 3, y: 4 })])
    );
  });

  it('Shows a play button when the game first starts', () => {
    render(<GameOfLife />);
    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  it('Switches the play button to pause when pressed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<GameOfLife />);
    await act(async () => {
      await user.click(screen.getByTestId('play-game'));
    });

    expect(screen.getByTestId('pause-game')).toBeInTheDocument();
  });

  it('Switches the play button back to pause when pressed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<GameOfLife />);
    await act(async () => {
      await user.click(screen.getByTestId('play-game'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('pause-game'));
    });

    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });
});
