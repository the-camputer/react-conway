import React, { useContext } from 'react';
import {
  Modal,
  Sheet,
  Button,
  IconButton,
  ButtonGroup,
  ModalClose,
  Typography,
} from '@mui/joy';
import { AttachFile, Clear, FileUpload } from '@mui/icons-material';
import { GameOfLifeContext } from '../../Context/GameOfLifeContext';

export const ImportButton: React.FC = () => {
  const setImportModalOpen = useContext(GameOfLifeContext).importModalOpen[1];
  return (
    <Button
      startDecorator={<FileUpload />}
      onClick={() => setImportModalOpen(true)}
      data-testid='open-import'
    >
      Import
    </Button>
  );
};

export const ImportModal: React.FC = () => {
  const context = useContext(GameOfLifeContext);
  const [importModalOpen, setImportModalOpen] = context.importModalOpen;
  const [fileImport, setFileImport] = context.fileImport;
  const setGameState = context.gameState[1];
  const setTick = context.tick[1];
  const setStartingGameState = context.startingGameState[1];

  const updateImportFile = (e: any) => {
    const files = e.target.files;
    files ? setFileImport(files[0]) : setFileImport(null);
  };

  const importFile = async () => {
    try {
      let text = await fileImport!.text();
      if (!text) {
        throw new Error('Text not parsed');
      }
      const seedJSON = JSON.parse(text!);
      if (seedJSON instanceof Array && seedJSON.length > 0) {
        const allAreCells: boolean = seedJSON.reduce((prev, curr) => {
          return prev && 'x' in curr && 'y' in curr;
        }, true);
        if (allAreCells) {
          setGameState(seedJSON);
          setStartingGameState(seedJSON);
          setTick(0);
          setFileImport(null);
          setImportModalOpen(false);
        } else {
          throw new Error(
            'Not all objects in list are of the form {x: number, y: number}'
          );
        }
      }
    } catch (err) {
      console.log(err);
      alert(`Unable to load provided JSON file: ${err}`);
      setFileImport(null);
    }
  };

  return (
    <Modal
      open={importModalOpen}
      onClose={() => setImportModalOpen(false)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        <Typography level='h4' fontWeight='lg' sx={{ p: 2 }}>
          Seed Configuration Import
        </Typography>
        <ButtonGroup
          color='primary'
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button
            startDecorator={<AttachFile />}
            component='label'
            data-testid='import-select-label'
          >
            {fileImport ? fileImport.name : 'Select File'}
            <input
              type='file'
              hidden
              data-testid='import-select'
              onChange={updateImportFile}
              accept='.json'
            />
          </Button>
          <IconButton onClick={() => setFileImport(null)}>
            <Clear />
          </IconButton>
        </ButtonGroup>
        <ButtonGroup
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 2,
          }}
        >
          <Button
            color='danger'
            onClick={() => {
              setFileImport(null);
              setImportModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            onClick={importFile}
            disabled={fileImport == null}
            data-testid='import-button'
          >
            Import
          </Button>
        </ButtonGroup>
      </Sheet>
    </Modal>
  );
};
