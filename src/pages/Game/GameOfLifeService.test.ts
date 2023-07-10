import { calculateGrid } from './GameOfLifeService';

describe('GameOfLifeService', () => {
    describe('calculateGrid', () => {
        it('creates a grid of cells no bigger than the field size', () => {
            const cellSize = 10;
            const fieldHeight = 100;
            const fieldWidth = 105;
            
            const resultGrid = calculateGrid(cellSize, fieldWidth, fieldHeight);

            expect(resultGrid.length).toBe(100);
            const randomCell = resultGrid[Math.round(Math.random() * resultGrid.length)];
            // Expect height and width to be one less than cell size to account for gridlines
            expect(randomCell.h).toBe(cellSize - 1);
            expect(randomCell.w).toBe(cellSize - 1);
        });

        it('creates a grid with cells that are configured as alive or dead', () => {
            const cellSize = 10;
            const testConfiguration = [
                { x: 1, y: 2, alive: true },
                { x: 3, y: 7, alive: true},
            ];

            const resultGrid = calculateGrid(cellSize, cellSize * 10, cellSize * 10, testConfiguration);

            testConfiguration.forEach(expected => {
                // Multiply expected by cellSize to get actual because expected is created using "column" and "row" for x and y, but actual uses pixels
                expect(resultGrid.some((actual) => actual.x === (expected.x*cellSize) && (actual.y === expected.y*cellSize) && actual.alive)).toBeTruthy();
            });
        })
    });
});