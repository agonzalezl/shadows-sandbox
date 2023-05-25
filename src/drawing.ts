import { Segment, Point } from "geomescript";

function drawCircle(ctx: any, point: Point, size: number, color = "#00FF00") {
  ctx.fillStyle = color;
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

export { drawCircle, drawSegment };
