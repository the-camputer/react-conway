import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Button, Typography } from '@mui/joy';
import { Info, PlayArrow } from '@mui/icons-material';

const Home: React.FC = (props: any) => {
  return (
    <div className='background'>
      <Stack height='100vh' justifyContent='space-around'>
        <Typography
          level='h1'
          sx={{
            color: 'white',
            WebkitTextStroke: '1px black',
            fontSize: '12em',
          }}
        >
          Game of Life
        </Typography>
        <Stack spacing={2}>
          <Link to={'/game'} data-testid='play-link'>
            <Button size='lg' startDecorator={<PlayArrow />}>
              Play
            </Button>
          </Link>
          <Link to={'/about'} data-testid='about-link'>
            <Button size='lg' startDecorator={<Info />}>
              About
            </Button>
          </Link>
        </Stack>
      </Stack>
    </div>
  );
};

export default Home;
