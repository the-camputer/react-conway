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
  importModalOpen: [boolean, Dispatch<SetStateAction<boolean>>];
  fileImport: [File | null, Dispatch<SetStateAction<File | null>>];
  examples: object;
  examplesModalOpen: [boolean, Dispatch<SetStateAction<boolean>>];
  toggleCell: (clicked: Cell) => void;
};

export const GameOfLifeContext = createContext<GoLState>({
  cell: [0, () => {}],
  gameState: [[], () => {}],
  startingGameState: [[], () => {}],
  tick: [0, () => {}],
  importModalOpen: [false, () => {}],
  fileImport: [null, () => {}],
  examples: {},
  examplesModalOpen: [false, () => {}],
  toggleCell: () => {},
});

type GoLProviderProps = {
  children: any;
  startingData?: Cell[];
};

const defaultStartingGameState: Cell[] = examples.glider.data;

export const GoLProvider = ({ children, startingData }: GoLProviderProps) => {
  const cell = useState(40);
  const gameState = useState(startingData ?? defaultStartingGameState);
  const startingGameState = useState(startingData ?? defaultStartingGameState);
  const tick = useState(0);
  const importModalOpen = useState(false);
  const fileImport = useState<File | null>(null);
  const examplesModalOpen = useState(false);

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
    importModalOpen,
    fileImport,
    examples,
    examplesModalOpen,
    toggleCell,
  };
  return (
    <GameOfLifeContext.Provider value={store}>
      {children}
    </GameOfLifeContext.Provider>
  );
};
