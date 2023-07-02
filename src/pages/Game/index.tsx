import React from 'react';
import GoLField from './GoLField';
import { styled } from 'styled-components';

const GameContainer = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr 100px;
`;

const GameOfLife: React.FC = (props) => {
  return (
    <GameContainer>
      <header>
        <div>Conway's Game of Life</div>
      </header>
      <GoLField cellSize={100} />
      <footer>
        <div>Place controls here</div>
      </footer>
    </GameContainer>
  );
};

export default GameOfLife;
