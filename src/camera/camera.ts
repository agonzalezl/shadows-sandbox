import { Point, Vector, Polyline, Segment } from "geomescript";
import { drawCircle, drawSegment } from "./drawing";
import { CameraBase } from "./model";

class Camera extends CameraBase {
  constructor(
    public position: Point,
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D
  ) {
    super(position, width, height);
  }

  // Method overloads
  drawCircle(point: Point, size: number, color: string | CanvasGradient): void;
  drawCircle(
    point: Point,
    size: number,
    color: string | CanvasGradient,
    ctx: CanvasRenderingContext2D
  ): void;

  drawCircle(
    point: Point,
    size: number,
    color: string | CanvasGradient,
    ctx?: CanvasRenderingContext2D
  ): void {
    drawCircle(this.ctx, this.transformCoordinates(point), size, color);
  }

  drawSegment(segment: Segment, color = "#FF0000", thickness: number = 1) {
    drawSegment(
      this.ctx,
      new Segment(
        this.transformCoordinates(segment.start),
        this.transformCoordinates(segment.end)
      ),
      color,
      thickness
    );
  }
}

export { Camera };
