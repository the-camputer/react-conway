import userEvent from '@testing-library/user-event';
import GameOfLife from './GameOfLife';
import { render, act, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

global.innerWidth = 1920;
global.innerHeight = 640;

describe('GameOfLife', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders game without crashing', () => {
    let view = render(<GameOfLife />, { wrapper: BrowserRouter });
    expect(view).toMatchSnapshot();
  });

  it('calcualtes a new game state on a regular cadence during play', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<GameOfLife />, { wrapper: BrowserRouter });

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
    render(<GameOfLife />, { wrapper: BrowserRouter });

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
        render(<GameOfLife />, { wrapper: BrowserRouter });
        expect(screen.getByTestId('play-game')).toBeInTheDocument();
      });

      it('Play button switches to pause when pressed', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<GameOfLife />, { wrapper: BrowserRouter });
        await act(async () => {
          await user.click(screen.getByTestId('play-game'));
        });

        expect(screen.getByTestId('pause-game')).toBeInTheDocument();
      });

      it('Pause button switches to play when pressed', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(<GameOfLife />, { wrapper: BrowserRouter });
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
        render(<GameOfLife />, { wrapper: BrowserRouter });
        expect(screen.getByTestId('clear-game')).toBeInTheDocument();
        expect(screen.queryByTestId('reset-game')).not.toBeInTheDocument();
      });

      it('Clear button empties the game state', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<GameOfLife />, { wrapper: BrowserRouter });
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

        render(<GameOfLife />, { wrapper: BrowserRouter });

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

    describe('Grid Manipulators', () => {
      describe('Cell Size', () => {
        it('starts with default size', () => {
          render(<GameOfLife />, { wrapper: BrowserRouter });
          const cellSize = parseInt(
            screen.getByTestId('cell-size').textContent!
          );
          expect(cellSize).toBe(40);
        });

        it('changes the size of the grid when the slider adjusts', async () => {
          const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
          });

          render(<GameOfLife />, { wrapper: BrowserRouter });

          const sliderRail = screen.getByTestId('cell-size-rail');

          const originalCellSize = parseInt(
            screen.getByTestId('cell-size').textContent!
          );

          await act(async () => {
            await user.pointer({
              keys: '[MouseLeft]',
              target: sliderRail,
              coords: {
                x: sliderRail.clientLeft + 20,
                y: sliderRail.clientTop,
              },
            });
          });

          const newCellSize = parseInt(
            screen.getByTestId('cell-size').textContent!
          );

          expect(newCellSize).toBeGreaterThan(originalCellSize);
        });
      });

      describe('Update Speed', () => {
        it('starts with default speed', () => {
          render(<GameOfLife />, { wrapper: BrowserRouter });
          const cellSize = parseInt(
            screen.getByTestId('update-speed').textContent!
          );
          expect(cellSize).toBe(500);
        });

        it('changes the update speed when the slider adjusts', async () => {
          const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
          });

          render(<GameOfLife />, { wrapper: BrowserRouter });

          const sliderRail = screen.getByTestId('update-speed-rail');

          const originalCellSize = parseInt(
            screen.getByTestId('update-speed').textContent!
          );

          await act(async () => {
            await user.pointer({
              keys: '[MouseLeft]',
              target: sliderRail,
              coords: {
                x: sliderRail.clientLeft + 20,
                y: sliderRail.clientTop,
              },
            });
          });

          const newCellSize = parseInt(
            screen.getByTestId('update-speed').textContent!
          );

          expect(newCellSize).toBeGreaterThan(originalCellSize);
        });
      });
    });
    describe('Import & Export', () => {
      describe('import', () => {
        it('button opens a modal to select file when clicked', async () => {
          const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
          });
          render(<GameOfLife />, { wrapper: BrowserRouter });

          await act(async () => {
            await user.click(screen.getByTestId('open-import'));
          });

          expect(screen.getByTestId('import-select')).toBeInTheDocument();
        });

        it('file select allows file upload', async () => {
          const testData = [
            { x: 2, y: 3 },
            { x: 4, y: 12 },
          ];
          const str = JSON.stringify(testData);
          const blob = new Blob([str]);
          const file = new File([blob], 'test.json', {
            type: 'application/json',
          });

          const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
          });
          render(<GameOfLife />, { wrapper: BrowserRouter });

          await act(async () => {
            await user.click(screen.getByTestId('open-import'));
          });

          user.upload(screen.getByTestId('import-select'), file);
          await waitFor(async () => {
            const importButton = screen.getByTestId('import-button');
            expect(importButton.getAttribute('disabled')).toBeNull();
          });

          expect(
            screen.getByTestId('import-select-label').textContent
          ).toContain('test.json');
        });

        it('sets the game configuration based on the uploaded file', async () => {
          const testData = [
            { x: 2, y: 3 },
            { x: 4, y: 12 },
          ];
          const str = JSON.stringify(testData);
          const blob = new Blob([str]);
          const file = new File([blob], 'test.json', {
            type: 'application/json',
          });
          File.prototype.text = jest.fn().mockResolvedValueOnce(str);

          const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
          });
          render(<GameOfLife />, { wrapper: BrowserRouter });

          await act(async () => {
            await user.click(screen.getByTestId('open-import'));
          });

          user.upload(screen.getByTestId('import-select'), file);
          await waitFor(async () => {
            const importButton = screen.getByTestId('import-button');
            expect(importButton.getAttribute('disabled')).toBeNull();
          });

          await act(
            async () => await user.click(screen.getByTestId('import-button'))
          );

          let gameState = JSON.parse(
            screen.getByTestId('game-data').textContent!
          );

          expect(gameState).toEqual(testData);
        });
      });
    });
  });
});
