import React, { useEffect, useState } from 'react';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import GoLField from './GoLField';
import { Cell, calculateNextState } from './GameOfLifeService';

const GameOfLife: React.FC = (props) => {
  const [tick, setTick] = useState<number>(0);
  const [gameState, setGameState] = useState<Cell[]>([
    { x: 15, y: 2 },
    { x: 16, y: 3 },
    { x: 14, y: 4 },
    { x: 15, y: 4 },
    { x: 16, y: 4 },
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
    <Stack spacing={0} justifyContent='center'>
      <Typography level='display1' variant='solid' id='title'>
        Conway's Game of Life
      </Typography>
      <GoLField cellSize={40} livingCells={gameState} />
      <Sheet id='control-center'>
        <Typography level='body1' variant='solid'>
          Place controls here
        </Typography>
      </Sheet>
    </Stack>
  );
};

export default GameOfLife;
