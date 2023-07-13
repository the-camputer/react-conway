import React, { useEffect, useState } from 'react';
import GoLField from './GoLField';
import { Cell, calculateNextState } from './GameOfLifeService';
import { styled } from 'styled-components';

const GameContainer = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`;

const GameOfLife: React.FC = (props) => {
  const [tick, setTick] = useState<number>(0);
  const [gameState, setGameState] = useState<Cell[]>([
    { x: 10 + 5, y: 5 - 3 },
    { x: 11 + 5, y: 6 - 3 },
    { x: 9 + 5, y: 7 - 3 },
    { x: 10 + 5, y: 7 - 3 },
    { x: 11 + 5, y: 7 - 3 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [setTick]);

  useEffect(() => {
    if (tick > 0) {
      setGameState((gameState) => calculateNextState(gameState));
    }
  }, [tick]);

  return (
    <GameContainer>
      <header>
        <div>Conway's Game of Life</div>
      </header>
      <GoLField cellSize={50} livingCells={gameState} />
      <footer>
        <div>Place controls here</div>
      </footer>
    </GameContainer>
  );
};

export default GameOfLife;
