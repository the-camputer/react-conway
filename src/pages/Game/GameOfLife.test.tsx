import GameOfLife from './GameOfLife';
import { render, act, screen, fireEvent } from '@testing-library/react';

describe('GameOfLife', () => {
  it("Doesn't crash while rendering state updates", async () => {
    global.innerWidth = 1920;
    global.innerHeight = 640;
    const view = render(<GameOfLife />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 2000));
    });

    expect(view).toMatchSnapshot();
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
