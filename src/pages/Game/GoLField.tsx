import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { calculateGrid, Cell } from './GameOfLifeService';

const Canvas = styled.canvas`
  background-color: #fff;
`;

const CanvasContainer = styled.div`
  padding: 10px;
  background-color: black;
`;

interface GoLFieldProperties {
  cellSize: number;
  livingCells?: Cell[];
  toggleFn: (clicked: Cell) => void;
}

const GoLField: React.FC<GoLFieldProperties> = (props: GoLFieldProperties) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  const [grid, setGrid] = useState<Cell[]>();

  const setCanvasSize = () => {
    setCanvasWidth(
      Math.floor(window.innerWidth / props.cellSize) * props.cellSize -
        props.cellSize
    );
    setCanvasHeight(
      Math.floor((window.innerHeight * 0.7) / props.cellSize) * props.cellSize -
        props.cellSize
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
    if (context && props.livingCells) {
      setGrid(
        calculateGrid(
          props.cellSize,
          canvasWidth,
          canvasHeight,
          props.livingCells
        )
      );
    }
  }, [context, props.cellSize, props.livingCells, canvasWidth, canvasHeight]);

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
    let gridX = Math.floor(xClicked / props.cellSize);
    let gridY = Math.floor(yClicked / props.cellSize);

    props.toggleFn({ x: gridX, y: gridY });
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

export default GoLField;
