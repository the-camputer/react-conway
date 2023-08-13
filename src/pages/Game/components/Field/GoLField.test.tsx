import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { GoLField } from './GoLField';
import { calculateGrid } from '../../GameOfLifeService';
import { GameOfLifeContext } from '../../GameOfLifeContext';

jest.mock('../../GameOfLifeService', () => ({
  calculateGrid: jest.fn(),
  calculateNextState: jest.fn(),
}));

describe('GolField', () => {
  afterEach(cleanup);

  it("Creates a game field divisible by cell size and sized close to the window's height and width minus padding", () => {
    jest.mocked(calculateGrid).mockImplementation(() => {
      return [
        { x: 0, y: 0, h: 9, w: 9, alive: false },
        { x: 0, y: 1, h: 9, w: 9, alive: true },
      ];
    });

    global.innerHeight = 600;
    global.innerWidth = 800;

    render(
      <GameOfLifeContext.Provider
        value={{
          cell: [50, jest.fn()],
          gameState: [[], jest.fn()],
          startingGameState: [[], jest.fn()],
          tick: [0, jest.fn()],
          modalOpen: [false, jest.fn()],
          fileImport: [null, jest.fn()],
          toggleCell: jest.fn(),
        }}
      >
        <GoLField />
      </GameOfLifeContext.Provider>
    );
    const canvas = screen.getByTestId('gol-canvas');
    expect(canvas).toHaveAttribute('width', '750');
    expect(canvas).toHaveAttribute('height', '350');
  });
});
