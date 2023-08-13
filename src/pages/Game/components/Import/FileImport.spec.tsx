import { ImportButton, ImportModal } from './FileImport';
import userEvent from '@testing-library/user-event';
import { render, act, screen, waitFor } from '@testing-library/react';
import { GoLProvider } from '../../GameOfLifeContext';

describe('Import', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('button opens a modal to select file when clicked', async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    render(
      <GoLProvider>
        <ImportButton />
        <ImportModal />
      </GoLProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('open-import'));
    });

    expect(screen.getByTestId('import-select')).toBeInTheDocument();
  });

  it('file select allows file upload', async () => {
    const testData = [
      { x: 2, y: 3 },
      { x: 4, y: 12 },
    ];
    const str = JSON.stringify(testData);
    const blob = new Blob([str]);
    const file = new File([blob], 'test.json', {
      type: 'application/json',
    });

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    render(
      <GoLProvider>
        <ImportButton />
        <ImportModal />
      </GoLProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('open-import'));
    });

    user.upload(screen.getByTestId('import-select'), file);
    await waitFor(async () => {
      const importButton = screen.getByTestId('import-button');
      expect(importButton.getAttribute('disabled')).toBeNull();
    });

    expect(screen.getByTestId('import-select-label').textContent).toContain(
      'test.json'
    );
  });
});
