import GameOfLife from './GameOfLife';
import { render, act } from '@testing-library/react';

describe('GameOfLife', () => {
  it("Doesn't crash while rendering state updates", async () => {
    global.innerWidth = 1920;
    global.innerHeight = 640;
    const view = render(<GameOfLife />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 2000));
    });

    expect(view).toMatchSnapshot();
  });
});
