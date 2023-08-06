import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  Slider,
  Sheet,
  FormControl,
  FormLabel,
  IconButton,
} from '@mui/joy';
import { Clear, Replay, PlayArrow, Pause, Home } from '@mui/icons-material';
import GoLField from './GoLField';
import { Cell, calculateNextState } from './GameOfLifeService';
import { Link } from 'react-router-dom';

const env = process.env.NODE_ENV;

const defaultCellSize = 40;
const defaultUpdateSpeed = 500;

const GameOfLife: React.FC = (props) => {
  const [tick, setTick] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  const [cellSize, setCellSize] = useState<number>(defaultCellSize);
  const [updateSpeed, setUpdateSpeed] = useState<number>(defaultUpdateSpeed);
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
    }, updateSpeed);
    return () => clearInterval(interval);
  }, [setTick, paused, updateSpeed]);

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

  const scaleCell = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ) => {
    if (Array.isArray(value)) {
      setCellSize(value[0]);
    } else {
      setCellSize(value);
    }
  };

  const scaleUpdateSpeed = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ) => {
    if (Array.isArray(value)) {
      setUpdateSpeed(value[0]);
    } else {
      setUpdateSpeed(value);
    }
  };

  return (
    <Stack spacing={0} justifyContent='center'>
      <Sheet variant='solid'>
        <Stack direction='row' justifyContent='center' alignItems='center'>
          <Link to='/' style={{ marginLeft: '10px' }} data-testid='home-link'>
            <IconButton variant='solid'>
              <Home />
            </IconButton>
          </Link>

          <Typography
            level='h1'
            sx={{
              color: 'white',
              WebkitTextStroke: '1px black',
              fontSize: '4em',
              flexGrow: 2,
            }}
          >
            Conway's Game of Life
          </Typography>
        </Stack>
      </Sheet>
      <GoLField
        cellSize={cellSize}
        livingCells={gameState}
        toggleFn={toggleCell}
      />
      {env === 'test' && (
        <div data-testid='game-data'>{JSON.stringify(gameState)}</div>
      )}
      <Sheet
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
      </Sheet>
      <Sheet
        sx={{
          display: 'flex',
          gap: 10,
          margin: '10px 10px 10px 10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <FormControl sx={{ flexGrow: 0 }}>
          <FormLabel>
            Cell Size{' '}
            {env === 'test' && (
              <p data-testid='cell-size'>{cellSize.toString()}</p>
            )}
          </FormLabel>
          <Slider
            size='lg'
            defaultValue={defaultCellSize}
            slotProps={{
              rail: { 'data-testid': 'cell-size-rail' },
            }}
            min={10}
            max={100}
            step={2}
            onChange={scaleCell}
            sx={{ width: 200 }}
          />
        </FormControl>
        <FormControl sx={{ flexGrow: 0 }}>
          <FormLabel>
            Update Speed{' '}
            {env === 'test' && (
              <p data-testid='update-speed'>{updateSpeed.toString()}</p>
            )}
          </FormLabel>
          <Slider
            size='lg'
            defaultValue={defaultUpdateSpeed}
            slotProps={{
              rail: { 'data-testid': 'update-speed-rail' },
            }}
            min={50}
            max={1000}
            step={10}
            onChange={scaleUpdateSpeed}
            sx={{ width: 200 }}
          />
        </FormControl>
      </Sheet>
    </Stack>
  );
};

export default GameOfLife;
