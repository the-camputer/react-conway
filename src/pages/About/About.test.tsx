import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from './About';

describe('About', () => {
  it('renders without crashing', () => {
    const view = render(<About />, { wrapper: BrowserRouter });
    expect(view).toMatchSnapshot();
  });
});
