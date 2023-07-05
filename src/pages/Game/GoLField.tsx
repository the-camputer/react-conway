import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

const cellSize = 50;

const Canvas = styled.canvas`
  background-color: #fff;
`;

const CanvasContainer = styled.div`
  padding: 10px;
  background-color: black;
`;

interface Cell {
  x: number;
  y: number;
}

interface GoLFieldProperties {
  cellSize: number;
  livingCells: Cell[];
}

const GoLField: React.FC<GoLFieldProperties> = (props: GoLFieldProperties) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  const [rows, setRows] = useState<number>(1);
  const [columns, setColumns] = useState<number>(4);

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

  // re-calculate the number of available rows and columns when canvas size changes
  useEffect(() => {
    setRows(Math.floor(canvasHeight / props.cellSize));
    setColumns(Math.floor(canvasWidth / props.cellSize));
  }, [canvasHeight, canvasWidth, props.cellSize]);

  useEffect(() => {
    canvasRef && setCanvas(canvasRef.current);
  }, [canvasRef]);

  useEffect(() => {
    if (canvas) {
      setContext(canvas.getContext('2d'));
    }
  }, [canvas]);

  useEffect(() => {
    if (context) {
      for (let i = 0; i < columns; i++) {
        for (let ii = 0; ii < rows; ii++) {
          context.beginPath();
          context.fillStyle = props.livingCells.some(
            (cell) => cell.x === i && cell.y === ii
          )
            ? 'yellow'
            : 'gray';
          context.fillRect(
            i * props.cellSize + 1,
            ii * props.cellSize + 1,
            props.cellSize - 1,
            props.cellSize - 1
          );
        }
      }
    }
  }, [context, props.cellSize, props.livingCells, columns, rows]);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} />
    </CanvasContainer>
  );
};

export default GoLField;
