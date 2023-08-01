import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import GameOfLife from './pages/Game';
import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/game',
      element: <GameOfLife />,
    },
  ]);

  return (
    <div className='App'>
      <CssVarsProvider defaultMode='light'>
        <RouterProvider router={router} />
      </CssVarsProvider>
    </div>
  );
}

export default App;
