import React, { useContext } from 'react';
import { Button } from '@mui/joy';
import { FileDownload } from '@mui/icons-material';
import { GameOfLifeContext } from '../../GameOfLifeContext';

export const ExportButton: React.FC = () => {
  const [startingGameState] = useContext(GameOfLifeContext).startingGameState;

  const exportFile = () => {
    const data = JSON.stringify(startingGameState, null, 2);
    const uri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(data);

    // @ts-ignore
    const link = document.createElement('a');
    link.href = uri;
    link.download = 'conway-seed.json';
    link.click();
  };

  return (
    <Button
      startDecorator={<FileDownload />}
      onClick={exportFile}
      data-testid='export-button'
    >
      Export
    </Button>
  );
};
