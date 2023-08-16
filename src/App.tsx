import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import GameOfLife from './pages/Game';
import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import About from './pages/About/About';
import { GoLProvider } from './pages/Game/Context/GameOfLifeContext';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/game',
      element: (
        <GoLProvider>
          <GameOfLife />
        </GoLProvider>
      ),
    },
    {
      path: '/about',
      element: <About />,
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
