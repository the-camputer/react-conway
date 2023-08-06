import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Sheet, Button, Typography, ListItem, List } from '@mui/joy';
import { Home } from '@mui/icons-material';

const About: React.FC = () => {
  return (
    <div className='background'>
      <Stack height='100vh' justifyContent='space-around' alignItems='center'>
        <Sheet sx={{ width: '75vw' }} data-testid='game-explanation'>
          <Typography level='body1'>From Wikipedia:</Typography>
          <br />
          <Typography level='body1'>
            The universe of the Game of Life is an infinite, two-dimensional
            orthogonal grid of square cells, each of which is in one of two
            possible states, live or dead (or populated and unpopulated,
            respectively). Every cell interacts with its eight neighbours, which
            are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
          </Typography>
          <List>
            <ListItem sx={{ display: 'list-item' }}>
              Any live cell with fewer than two live neighbours dies, as if by
              underpopulation.
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              Any live cell with two or three live neighbours lives on to the
              next generation.
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              Any live cell with more than three live neighbours dies, as if by
              overpopulation.
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              Any dead cell with exactly three live neighbours becomes a live
              cell, as if by reproduction.
            </ListItem>
          </List>
          <br />
          <Typography>
            These rules, which compare the behaviour of the automaton to real
            life, can be condensed into the following:
          </Typography>
          <List>
            <ListItem sx={{ display: 'list-item' }}>
              Any live cell with two or three live neighbours survives.
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              Any dead cell with three live neighbours becomes a live cell.
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </ListItem>
          </List>
          <br />
          <Typography>
            The initial pattern constitutes the seed of the system. The first
            generation is created by applying the above rules simultaneously to
            every cell in the seed, live or dead; births and deaths occur
            simultaneously, and the discrete moment at which this happens is
            sometimes called a tick
          </Typography>
        </Sheet>
        <Link to={'/'} data-testid='home-link'>
          <Button size='lg' startDecorator={<Home />}>
            Home
          </Button>
        </Link>
      </Stack>
    </div>
  );
};

export default About;
