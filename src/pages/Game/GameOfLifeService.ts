export interface Cell {
  x: number,
  y: number,
  h?: number,
  w?: number
  alive?: boolean
}

export interface CellReproducibilityState {
  cell: Cell,
  livingNeighborsCount: number,
  alive: boolean
}

const calculateGrid = (cellSize: number, fieldWidth: number, fieldHeight: number, livingCells?: Cell[]): Cell[] => {
  let grid: Cell[] = [];
  const columns = Math.floor(fieldWidth / cellSize);
  const rows = Math.floor(fieldHeight / cellSize);

  for(let i = 0; i < columns; i++) {
    for (let ii = 0; ii < rows; ii++) {
      // The -1 on the height and width calculations create the grid lines 
      grid.push({ 
        x: i * cellSize, 
        y: ii * cellSize, 
        h: cellSize - 1, 
        w: cellSize - 1, 
        alive: livingCells?.some(livingCell => livingCell.x === i && livingCell.y === ii)
      });
    }
  }
  
  return grid;
}

const calculateNextState = (currentState: Cell[], overpopulationThreshold: number = 3, underpopulationThreshold: number = 2, rebirthThreshold: number = 3): Cell[] => {
  let nextState: Cell[] = [];

  // Each instance of a neighbor represents the time that the cell is neighbor to a living cell from the current state
  let neighbors: Cell[] = currentState.map(cell => getNeighbors(cell, currentState)).flat();

  const neighborCounts: CellReproducibilityState[] = neighbors.reduce<CellReproducibilityState[]>((acc, curr) => {
    const reprodState = acc.findIndex(state =>  sameLocation(state.cell, curr));
    if (reprodState > -1) {
      acc[reprodState].livingNeighborsCount++
    } else {
      acc.push({ cell: curr, alive: curr.alive ?? false, livingNeighborsCount: 1});
    }
    return acc;
  }, []);


  neighborCounts.forEach(cellStateData => {
    // Rebirth
    if (!cellStateData.alive && cellStateData.livingNeighborsCount === rebirthThreshold) {
      nextState.push({...cellStateData.cell, alive: true});
    }
    // Survival
    if (cellStateData.alive && (cellStateData.livingNeighborsCount <= overpopulationThreshold && cellStateData.livingNeighborsCount >= underpopulationThreshold)) {
      nextState.push({...cellStateData.cell, alive: true});
    }
  });

  return nextState;
}

const getNeighbors = (cell: Cell, state: Cell[]): Cell[] => {
  // Because state must contain only a set of living cells, we can just check if the 'neighbor' exists in that set
  return [
    { x: cell.x - 1, y: cell.y - 1, alive: state.some(productiveCell => productiveCell.x === cell.x - 1 && productiveCell.y === cell.y - 1) },
    { x: cell.x,     y: cell.y - 1, alive: state.some(productiveCell => productiveCell.x === cell.x     && productiveCell.y === cell.y - 1) },
    { x: cell.x + 1, y: cell.y - 1, alive: state.some(productiveCell => productiveCell.x === cell.x + 1 && productiveCell.y === cell.y - 1) },
    { x: cell.x - 1, y: cell.y,     alive: state.some(productiveCell => productiveCell.x === cell.x - 1 && productiveCell.y === cell.y    ) },
    { x: cell.x + 1, y: cell.y,     alive: state.some(productiveCell => productiveCell.x === cell.x + 1 && productiveCell.y === cell.y    ) },
    { x: cell.x - 1, y: cell.y + 1, alive: state.some(productiveCell => productiveCell.x === cell.x - 1 && productiveCell.y === cell.y + 1) },
    { x: cell.x,     y: cell.y + 1, alive: state.some(productiveCell => productiveCell.x === cell.x     && productiveCell.y === cell.y + 1) },
    { x: cell.x + 1, y: cell.y + 1, alive: state.some(productiveCell => productiveCell.x === cell.x + 1 && productiveCell.y === cell.y + 1) }
  ];
}

const sameLocation = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;

export { calculateGrid, calculateNextState };