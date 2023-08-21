import React, { useContext } from 'react';
import {
  Modal,
  Sheet,
  ModalClose,
  Typography,
  IconButton,
  Card,
} from '@mui/joy';
import { GameOfLifeContext } from '../../Context/GameOfLifeContext';
import { BookmarkOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const ExamplesModalButton: React.FC = () => {
  const context = useContext(GameOfLifeContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setExamplesModalOpen] = context.examplesModalOpen;

  return (
    <IconButton variant='solid' onClick={() => setExamplesModalOpen(true)}>
      <BookmarkOutlined />
    </IconButton>
  );
};

export const ExamplesModal: React.FC = () => {
  const context = useContext(GameOfLifeContext);
  const [examplesModalOpen, setExamplesModalOpen] = context.examplesModalOpen;
  const examples = context.examples;
  return (
    <Modal
      open={examplesModalOpen}
      onClose={() => setExamplesModalOpen(false)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'scroll',
      }}
    >
      <Sheet
        variant='outlined'
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ModalClose />
        <Typography level='h3'>Basic Examples</Typography>
        {Object.getOwnPropertyNames(examples).map((exampleName, i) => (
          <Card key={i}>
            <Link
              to={`/game/${exampleName}`}
              style={{ textDecoration: 'underlined' }}
              onClick={() => setExamplesModalOpen(false)}
            >
              <Typography level='h5'>{exampleName}</Typography>
            </Link>
            <Typography level='body1'>
              {/* @ts-ignore */}
              {examples[exampleName].description}
            </Typography>
          </Card>
        ))}
      </Sheet>
    </Modal>
  );
};
