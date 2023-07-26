import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/joy';
import { Clear, Replay, PlayArrow, Pause } from '@mui/icons-material';
import GoLField from './GoLField';
import { Cell, calculateNextState } from './GameOfLifeService';

const env = process.env.NODE_ENV;

const GameOfLife: React.FC = (props) => {
  const [tick, setTick] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  const [gameState, setGameState] = useState<Cell[]>([
    { x: 15, y: 2 },
    { x: 16, y: 3 },
    { x: 14, y: 4 },
    { x: 15, y: 4 },
    { x: 16, y: 4 },
  ]);
  const [startingGameState, setStartingGameState] = useState<Cell[]>(gameState);

  useEffect(() => {
    if (tick === 0) {
      setStartingGameState(gameState);
    }
  }, [gameState, tick]);

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

  const toggleCell = (clicked: Cell) => {
    const clickedIndex = gameState.findIndex(
      (cell) => cell.x === clicked.x && cell.y === clicked.y
    );
    if (clickedIndex >= 0) {
      setGameState(gameState.filter((_cell, index) => index !== clickedIndex));
    } else {
      setGameState([...gameState, { ...clicked }]);
    }
  };

  const reset = () => {
    setGameState(startingGameState);
    setTick(0);
  };

  const clear = () => {
    setGameState([]);
  };

  return (
    <Stack spacing={0} justifyContent='center'>
      <Typography level='display1' variant='solid' id='title'>
        Conway's Game of Life
      </Typography>
      <GoLField cellSize={40} livingCells={gameState} toggleFn={toggleCell} />
      {env === 'test' && (
        <div data-testid='game-data'>{JSON.stringify(gameState)}</div>
      )}
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
        {tick === 0 && (
          <Button
            size='lg'
            startDecorator={<Clear />}
            onClick={clear}
            data-testid='clear-game'
          >
            Clear
          </Button>
        )}
        {tick > 0 && (
          <Button
            size='lg'
            startDecorator={<Replay />}
            onClick={reset}
            data-testid='reset-game'
          >
            Reset
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default GameOfLife;
