import React, { FC } from 'react';
import useCanvas from './useCanvas';
import './canvas.css';

type DrawFunction = (context: CanvasRenderingContext2D, frameCount: number) => void;

interface CanvasProps {
  draw: DrawFunction;
  options?: any;
  mouseMoveCallback?: (x: number, y: number) => void;
  clickCallback?: (x: number, y: number) => void;
  [x: string]: any; // Allow any additional props
}

const Canvas: FC<CanvasProps> = (props) => {
  const { draw, options, mouseMoveCallback, clickCallback, ...rest } = props;
  const canvasRef = useCanvas(draw, options, {mouseMoveCallback, clickCallback});
  return (
    <canvas className="my-canvas" width="1000" height="1000" ref={canvasRef} {...rest} />
  );
};

export default Canvas;