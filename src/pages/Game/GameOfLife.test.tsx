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

  describe('buttons', () => {
    describe('Pause & Play', () => {
      it('A play button appears when the game first starts', () => {
        render(<GameOfLife />);
        expect(screen.getByTestId('play-game')).toBeInTheDocument();
      });

      it('Play button switches to pause when pressed', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<GameOfLife />);
        await act(async () => {
          await user.click(screen.getByTestId('play-game'));
        });

        expect(screen.getByTestId('pause-game')).toBeInTheDocument();
      });

      it('Pause button switches to play when pressed', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

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
    describe('Reset & Clear', () => {
      it('Clear button appears at tick 0 and reset button does not', async () => {
        render(<GameOfLife />);
        expect(screen.getByTestId('clear-game')).toBeInTheDocument();
        expect(screen.queryByTestId('reset-game')).not.toBeInTheDocument();
      });

      it('Clear button empties the game state', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<GameOfLife />);
        const gameState1 = JSON.parse(
          screen.getByTestId('game-data').textContent!
        );
        await act(async () => {
          user.click(screen.getByTestId('clear-game'));
        });
        const gameState2 = JSON.parse(
          screen.getByTestId('game-data').textContent!
        );

        expect(gameState1.length).toBeGreaterThan(0);
        expect(gameState2.length).toBe(0);
      });

      it('Reset button sets the game state back to what it was at tick 0', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(<GameOfLife />);

        const gameState1 = JSON.parse(
          screen.getByTestId('game-data').textContent!
        );

        await act(async () => {
          await user.click(screen.getByTestId('play-game'));
        });

        act(() => {
          jest.advanceTimersByTime(501);
        });

        const gameState2 = JSON.parse(
          screen.getByTestId('game-data').textContent!
        );

        await act(async () => {
          await user.click(screen.getByTestId('reset-game'));
        });

        const gameState3 = JSON.parse(
          screen.getByTestId('game-data').textContent!
        );

        expect(gameState2).not.toEqual(gameState1);
        expect(gameState3).toEqual(gameState1);
      });
    });
  });
});
