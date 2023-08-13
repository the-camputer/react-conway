import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, act, screen } from '@testing-library/react';
import { ExportButton } from './ExportButton';

describe('ExportButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  it('exports the initial game state as json', async () => {
    const link = {
      href: '',
      download: '',
      click: jest.fn(),
    };

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<ExportButton />);

    // @ts-ignore
    jest.spyOn(document, 'createElement').mockImplementation(() => link);

    await act(async () => {
      await user.click(screen.getByTestId('export-button'));
    });

    expect(link.href).toMatch(/^data:application\/json;charset=utf-8/);
    expect(link.download).toBe('conway-seed.json');
    expect(link.click).toHaveBeenCalledTimes(1);
  });
});
