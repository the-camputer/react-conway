import GameOfLife from './GameOfLife';
import { render, act, screen, fireEvent } from '@testing-library/react';

global.innerWidth = 1920;
global.innerHeight = 640;

describe('GameOfLife', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders game without crashing', () => {
    let view = render(<GameOfLife />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(view).toMatchSnapshot();
  });

  it('calcualtes a new game state on a regular cadence', async () => {
    render(<GameOfLife />);

    let gameState1 = JSON.parse(screen.getByTestId('game-data').textContent!);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    let gameState2 = JSON.parse(screen.getByTestId('game-data').textContent!);

    expect(gameState1[0]).toEqual(expect.objectContaining({ x: 15, y: 2 }));
    expect(gameState2[0]).toEqual(expect.objectContaining({ x: 14, y: 3 }));
  });

  it('Shows a pause button when the game first starts', () => {
    render(<GameOfLife />);
    expect(screen.getByTestId('pause-game')).toBeInTheDocument();
  });

  it('Switches the pause button to play when pressed', () => {
    render(<GameOfLife />);
    fireEvent.click(screen.getByTestId('pause-game'));
    expect(screen.getByTestId('play-game')).toBeInTheDocument();
  });

  it('Switches the play button back to pause when pressed', () => {
    render(<GameOfLife />);
    fireEvent.click(screen.getByTestId('pause-game'));
    fireEvent.click(screen.getByTestId('play-game'));
    expect(screen.getByTestId('pause-game')).toBeInTheDocument();
  });
});
