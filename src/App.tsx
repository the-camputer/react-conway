import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import GameOfLife from './pages/Game';
import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const App = () => {
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
  return <RouterProvider router={router} />;
};

function WrappedApp() {
  return (
    <div className='App'>
      <CssVarsProvider defaultMode='light'>
        <App />
      </CssVarsProvider>
    </div>
  );
}

export default WrappedApp;
export { App };
