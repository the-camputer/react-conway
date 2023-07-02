import React from 'react';
import GoLField from './GoLField';
import { styled } from 'styled-components';

const GameContainer = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`;

const GameOfLife: React.FC = (props) => {
  // basic glider
  const livingCells = [
    { x: 10, y: 5 },
    { x: 11, y: 6 },
    { x: 9, y: 7 },
    { x: 10, y: 7 },
    { x: 11, y: 7 },
  ];
  return (
    <GameContainer>
      <header>
        <div>Conway's Game of Life</div>
      </header>
      <GoLField cellSize={50} livingCells={livingCells} />
      <footer>
        <div>Place controls here</div>
      </footer>
    </GameContainer>
  );
};

export default GameOfLife;
