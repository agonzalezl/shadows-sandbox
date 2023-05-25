import { useRef, useEffect, MutableRefObject } from 'react';

type DrawFunction = (context: CanvasRenderingContext2D, frameCount: number) => void;

interface Options {
  context?: string;
}

interface CanvasEvents {
  mouseMoveCallback?: (x: number, y: number) => void;
  clickCallback?: (x: number, y: number) => void;
}

type UseCanvasReturnType = MutableRefObject<HTMLCanvasElement | null>;

const useCanvas = (
  draw: DrawFunction,
  options: Options = {},
  { mouseMoveCallback, clickCallback }: CanvasEvents = {},
): UseCanvasReturnType => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext(options.context || '2d') as CanvasRenderingContext2D;
    let frameCount = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.offsetX;
      const y = e.offsetY;
      mouseMoveCallback?.(x, y);
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const x = e.offsetX;
      const y = e.offsetY;
      clickCallback?.(x, y);
    };

    canvas.addEventListener('mousedown', handleCanvasClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draw, options.context, mouseMoveCallback, clickCallback]);

  return canvasRef;
};

export default useCanvas;