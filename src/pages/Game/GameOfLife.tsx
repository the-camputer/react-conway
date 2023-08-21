import React, { useContext, useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  Slider,
  Sheet,
  FormControl,
  FormLabel,
  IconButton,
  ButtonGroup,
  Divider,
} from '@mui/joy';
import { Clear, Replay, PlayArrow, Pause, Home } from '@mui/icons-material';
import { calculateNextState } from './GameOfLifeService';
import { Link, useLoaderData } from 'react-router-dom';
import { GameOfLifeContext, GoLState } from './Context/GameOfLifeContext';

import {
  ExportButton,
  ImportButton,
  ImportModal,
  GoLField,
  ExamplesModalButton,
  ExamplesModal,
} from './components';
import { Cell } from './GameOfLifeService';

const env = process.env.NODE_ENV;

const defaultCellSize = 40;
const defaultUpdateSpeed = 500;

const GameOfLife: React.FC = () => {
  const context: GoLState = useContext(GameOfLifeContext);
  const [size, setSize] = context.cell;
  const [gameState, setGameState] = context.gameState;
  const [startingGameState, setStartingGameState] = context.startingGameState;
  const [tick, setTick] = context.tick;

  const [paused, setPaused] = useState<boolean>(true);
  const [updateSpeed, setUpdateSpeed] = useState<number>(defaultUpdateSpeed);

  const importedStartingState = useLoaderData() as { data: Cell[] };
  useEffect(() => {
    if (importedStartingState?.data) {
      setStartingGameState(importedStartingState.data);
      setGameState(importedStartingState.data);
    }
  }, [setStartingGameState, importedStartingState, setGameState]);

  useEffect(() => {
    if (tick === 0) {
      setStartingGameState(gameState);
      setPaused(true);
    }
  }, [gameState, tick, setStartingGameState]);

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
  }, [tick, setGameState]);

  const reset = () => {
    setGameState(startingGameState);
    setTick(0);
  };

  const scaleCell = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ) => {
    if (Array.isArray(value)) {
      setSize(value[0]);
    } else {
      setSize(value);
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

          <div style={{ marginRight: '10px' }}>
            <ExamplesModalButton />
          </div>
        </Stack>
      </Sheet>
      <ExamplesModal />
      <GoLField />
      {env === 'test' && (
        <div data-testid='game-data'>{JSON.stringify(gameState)}</div>
      )}
      <ButtonGroup
        spacing='0.5rem'
        size='lg'
        variant='solid'
        color='primary'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          margin: '10px 0 10px 0',
        }}
      >
        {!paused && (
          <Button
            startDecorator={<Pause />}
            onClick={() => setPaused(true)}
            data-testid='pause-game'
          >
            Pause
          </Button>
        )}
        {paused && (
          <Button
            startDecorator={<PlayArrow />}
            onClick={() => setPaused(false)}
            data-testid='play-game'
          >
            Play
          </Button>
        )}
        {tick === 0 && (
          <Button
            startDecorator={<Clear />}
            onClick={() => setGameState([])}
            data-testid='clear-game'
          >
            Clear
          </Button>
        )}
        {tick > 0 && (
          <Button
            startDecorator={<Replay />}
            onClick={reset}
            data-testid='reset-game'
          >
            Reset
          </Button>
        )}
        <Divider orientation='vertical' />
        <ImportButton />
        <ExportButton />
        <ImportModal />
      </ButtonGroup>
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
            {env === 'test' && <p data-testid='cell-size'>{size.toString()}</p>}
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
