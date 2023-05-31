import { Segment, Point, Polygon } from "geomescript";

function drawCircle(
  ctx: any,
  point: Point,
  size: number,
  fillStyle: string | CanvasGradient = "#00FF00"
) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
  ctx.fill();
}

function drawSegment(
  ctx: any,
  segment: Segment,
  color = "#FF0000",
  thickness: number = 1
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.moveTo(segment.start.x, segment.start.y);
  ctx.lineTo(segment.end.x, segment.end.y);
  ctx.stroke();
}

function drawPolygon(
  context: CanvasRenderingContext2D,
  polygon: Polygon
): void {
  const points = polygon.points;

  if (points.length < 3) {
    // A polygon requires at least 3 points to be drawn
    return;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }

  context.closePath();
  context.fill();
}

export { drawCircle, drawSegment, drawPolygon };
