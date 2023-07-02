import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  const setCanvasSize = useCallback(() => {
    setCanvasWidth(
      Math.floor(window.innerWidth / cellSize) * cellSize - cellSize
    );
    setCanvasHeight(
      Math.floor((window.innerWidth * 0.4) / cellSize) * cellSize - cellSize
    );
  }, [setCanvasWidth, setCanvasHeight]);

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
    if (context) {
      const columns = Math.floor(canvasWidth / props.cellSize);
      const pixelFactorX = canvasWidth / columns;
      const rows = Math.floor(canvasHeight / props.cellSize);
      const pixelFactorY = canvasHeight / rows;
      for (let i = 0; i < columns; i++) {
        for (let ii = 0; ii < rows; ii++) {
          context.beginPath();
          context.fillStyle = props.livingCells.some(
            (cell) => cell.x === i && cell.y === ii
          )
            ? 'yellow'
            : 'gray';
          context.fillRect(
            i * pixelFactorX + 1,
            ii * pixelFactorY + 1,
            pixelFactorX - 1,
            pixelFactorY - 1
          );
        }
      }
    }
  }, [context, canvasWidth, canvasHeight, props.cellSize, props.livingCells]);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} />
    </CanvasContainer>
  );
};

export default GoLField;
