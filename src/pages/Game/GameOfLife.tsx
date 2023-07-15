import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/joy';
import { PlayArrow, Pause } from '@mui/icons-material';
import GoLField from './GoLField';
import { Cell, calculateNextState } from './GameOfLifeService';

const GameOfLife: React.FC = (props) => {
  const [tick, setTick] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [gameState, setGameState] = useState<Cell[]>([
    { x: 15, y: 2 },
    { x: 16, y: 3 },
    { x: 14, y: 4 },
    { x: 15, y: 4 },
    { x: 16, y: 4 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setTick((tick) => tick + 1);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setTick, paused]);

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
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          margin: '10px 0 10px 0',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {!paused && (
          <Button
            size='lg'
            startDecorator={<Pause />}
            onClick={() => setPaused(true)}
            data-testid='pause-game'
          >
            Pause
          </Button>
        )}
        {paused && (
          <Button
            size='lg'
            startDecorator={<PlayArrow />}
            onClick={() => setPaused(false)}
            data-testid='play-game'
          >
            Play
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default GameOfLife;
