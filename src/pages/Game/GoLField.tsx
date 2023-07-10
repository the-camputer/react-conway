import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { calculateGrid, Cell } from './GameOfLifeService';

const cellSize = 50;

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
}

const GoLField: React.FC<GoLFieldProperties> = (props: GoLFieldProperties) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);

  const setCanvasSize = () => {
    setCanvasWidth(
      Math.floor(window.innerWidth / cellSize) * cellSize - cellSize
    );
    setCanvasHeight(
      Math.floor((window.innerWidth * 0.4) / cellSize) * cellSize - cellSize
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
      const field = calculateGrid(
        props.cellSize,
        canvasWidth,
        canvasHeight,
        props.livingCells
      );

      field.forEach((cell) => {
        context.beginPath();
        context.fillStyle = cell.alive ? 'yellow' : 'gray';
        context.fillRect(cell.x, cell.y, cell.h ?? 0, cell.w ?? 0);
      });
    }
  }, [context, props.cellSize, props.livingCells, canvasWidth, canvasHeight]);

  return (
    <CanvasContainer>
      <Canvas
        data-testid='gol-canvas'
        ref={canvasRef}
        height={canvasHeight}
        width={canvasWidth}
      />
    </CanvasContainer>
  );
};

export default GoLField;
