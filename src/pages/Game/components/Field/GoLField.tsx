import React, { useEffect, useRef, useState, useContext } from 'react';
import { styled } from 'styled-components';
import { calculateGrid, Cell } from '../../GameOfLifeService';
import { GameOfLifeContext, GoLState } from '../../Context/GameOfLifeContext';

const Canvas = styled.canvas`
  background-color: #fff;
`;

const CanvasContainer = styled.div`
  padding: 10px;
  background-color: black;
`;

export const GoLField: React.FC = () => {
  const golContext: GoLState = useContext(GameOfLifeContext);
  const [cellSize] = golContext.cell;
  const [livingCells] = golContext.gameState;
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  const [grid, setGrid] = useState<Cell[]>();

  const setCanvasSize = () => {
    setCanvasWidth(
      Math.floor(window.innerWidth / cellSize) * cellSize - cellSize
    );
    setCanvasHeight(
      Math.floor((window.innerHeight * 0.7) / cellSize) * cellSize - cellSize
    );
  };

  // re-calculate the canvas width & height when the window is resized
  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
  });

  useEffect(() => {
    canvasRef && setCanvas(canvasRef.current);
  }, [canvasRef]);

  useEffect(() => {
    if (canvas) {
      setContext(canvas.getContext('2d'));
    }
  }, [canvas]);

  useEffect(() => {
    if (context && livingCells) {
      setGrid(calculateGrid(cellSize, canvasWidth, canvasHeight, livingCells));
    }
  }, [context, cellSize, livingCells, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (grid && context) {
      grid.forEach((cell) => {
        context.beginPath();
        context.fillStyle = cell.alive ? 'yellow' : 'gray';
        context.fillRect(cell.x, cell.y, cell.h ?? 0, cell.w ?? 0);
      });
    }
  }, [context, grid]);

  const handleUserInput = (e: any) => {
    const xClicked = e.clientX - canvas!.offsetLeft;
    const yClicked = e.clientY - canvas!.offsetTop;
    let gridX = Math.floor(xClicked / cellSize);
    let gridY = Math.floor(yClicked / cellSize);

    golContext.toggleCell({ x: gridX, y: gridY });
  };

  return (
    <CanvasContainer>
      <Canvas
        data-testid='gol-canvas'
        ref={canvasRef}
        height={canvasHeight}
        width={canvasWidth}
        onClick={handleUserInput}
      />
    </CanvasContainer>
  );
};
