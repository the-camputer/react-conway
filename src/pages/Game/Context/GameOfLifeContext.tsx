import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';
import { Cell } from '../GameOfLifeService';
import examples from './examples.json';

export type GoLState = {
  cell: [number, Dispatch<SetStateAction<number>>];
  gameState: [Cell[], Dispatch<SetStateAction<Cell[]>>];
  startingGameState: [Cell[], Dispatch<SetStateAction<Cell[]>>];
  tick: [number, Dispatch<SetStateAction<number>>];
  modalOpen: [boolean, Dispatch<SetStateAction<boolean>>];
  fileImport: [File | null, Dispatch<SetStateAction<File | null>>];
  toggleCell: (clicked: Cell) => void;
};

export const GameOfLifeContext = createContext<GoLState>({
  cell: [0, () => {}],
  gameState: [[], () => {}],
  startingGameState: [[], () => {}],
  tick: [0, () => {}],
  modalOpen: [false, () => {}],
  fileImport: [null, () => {}],
  toggleCell: () => {},
});

type GoLProviderProps = {
  children: any;
};

const defaultStartingGameState: Cell[] = examples.glider.data;

export const GoLProvider = ({ children }: GoLProviderProps) => {
  const cell = useState(40);
  const gameState = useState(defaultStartingGameState);
  const startingGameState = useState(defaultStartingGameState);
  const tick = useState(0);
  const modalOpen = useState(false);
  const fileImport = useState<File | null>(null);

  const toggleCell = (clicked: Cell) => {
    const [state, setState] = gameState;
    const clickedIndex = state.findIndex(
      (cell) => cell.x === clicked.x && cell.y === clicked.y
    );
    if (clickedIndex >= 0) {
      setState(state.filter((_cell, index) => index !== clickedIndex));
    } else {
      setState([...state, { ...clicked }]);
    }
  };
  const store = {
    cell,
    gameState,
    startingGameState,
    tick,
    modalOpen,
    fileImport,
    toggleCell,
  };
  return (
    <GameOfLifeContext.Provider value={store}>
      {children}
    </GameOfLifeContext.Provider>
  );
};
