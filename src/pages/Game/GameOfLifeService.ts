export interface Cell {
    x: number,
    y: number,
    h?: number,
    w?: number
    alive?: boolean
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
                alive: livingCells?.some(livingCell => livingCell.x === i && livingCell.y === ii)});
        }
    }
    
    return grid;
}

export { calculateGrid };