import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import GameOfLife from './pages/Game';

function App() {
  return (
    <div className='App'>
      <CssVarsProvider defaultMode='light'>
        <GameOfLife />
      </CssVarsProvider>
    </div>
  );
}

export default App;
