import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders without crashing', () => {
    const view = render(<Home />, { wrapper: BrowserRouter });
    expect(view).toMatchSnapshot();
  });
});
