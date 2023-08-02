import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Button, Typography } from '@mui/joy';
import styled from 'styled-components';

const Background = styled.div`
  background-image: url('background.gif');
  background-origin: center;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
`;

const Home: React.FC = (props: any) => {
  return (
    <Background>
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
        <Link to={'/game'}>
          <Button size='lg'>Play</Button>
        </Link>
      </Stack>
    </Background>
  );
};

export default Home;
