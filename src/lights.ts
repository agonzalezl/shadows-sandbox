import { Point, Segment, Vector, Circle, Polygon } from "geomescript";

function calculateShadows(spotLight: Point, obstacles: Segment[]): Polygon[] {
  const polygons: Polygon[] = [];
  for (var obstacle of obstacles) {
    polygons.push(calculateShadow(spotLight, obstacle));
  }
  return polygons;
}

function calculateShadow(spotLight: Point, obstacle: Segment): any {
  let v1 = Vector.fromPoints(spotLight, obstacle.start).scaled(1000);
  let p1 = obstacle.start.translate(v1);
  let v2 = Vector.fromPoints(spotLight, obstacle.end).scaled(1000);
  let p2 = obstacle.end.translate(v2);
  return new Polygon([obstacle.start, obstacle.end, p2, p1]);
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

function renderLightingEffects(
  context: CanvasRenderingContext2D,
  spotlights: Circle[],
  obstacles: Segment[]
) {
  // Spotligts Holes
  context.beginPath();
  context.fillStyle = "black";
  const RATIO = 100;

  // All Shadows
  let allShadowsCanvas = context.canvas.cloneNode() as HTMLCanvasElement;
  let allShadowsctx = allShadowsCanvas.getContext("2d");

  if (!allShadowsctx) {
    console.error(
      "Unable to obtain 2D rendering context for renderLightingEffects"
    );
    return;
  }

  // Draw holes in the canvas
  for (var spotlight of spotlights) {
    let individualCanvas = context.canvas.cloneNode() as HTMLCanvasElement;
    let individualctx = individualCanvas.getContext("2d");

    if (!individualctx) {
      console.error(
        "Unable to obtain 2D rendering context for renderLightingEffects"
      );
      return;
    }

    individualctx.clearRect(0, 0, 1000, 1000);

    individualctx.moveTo(spotlight.center.x, spotlight.center.y);
    individualctx.arc(spotlight.center.x, spotlight.center.y, RATIO, 0, 2 * Math.PI);

    individualctx.globalAlpha = 1.0;
    individualctx.fill();

    individualctx.globalCompositeOperation = "destination-out";
    let shadows = calculateShadows(new Point(spotlight.center.x, spotlight.center.y), obstacles);

    for(let shadow of shadows){
        drawPolygon(individualctx, shadow);
    }

    allShadowsctx.globalCompositeOperation = "source-over";
    allShadowsctx.drawImage(individualCanvas, 0, 0);
  }

  context.globalCompositeOperation = "destination-in";
  context.drawImage(allShadowsCanvas, 0, 0);

  let copycanvas = context.canvas.cloneNode() as HTMLCanvasElement;
  let copyctx = copycanvas.getContext("2d");

  if (!copyctx) {
    console.error(
      "Unable to obtain 2D rendering context for renderLightingEffects"
    );
    return;
  }

  // Draw gradients
  for (var spotlight of spotlights) {
    copyctx.clearRect(0, 0, 1000, 1000);

    copyctx.globalCompositeOperation = "lighter";
    const gradient1 = copyctx.createRadialGradient(
      spotlight.center.x,
      spotlight.center.y,
      0,
      spotlight.center.x,
      spotlight.center.y,
      RATIO * 1.0
    );
    gradient1.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient1.addColorStop(1, "rgba(0, 0, 0, 1)");

    copyctx.beginPath();
    copyctx.fillStyle = gradient1;
    copyctx.moveTo(spotlight.center.x, spotlight.center.y);
    copyctx.arc(spotlight.center.x, spotlight.center.y, RATIO, 0, 2 * Math.PI);
    context.globalAlpha = 0.4;
    copyctx.fill();

    copyctx.globalCompositeOperation = "destination-out";
    let shadows = calculateShadows(spotlight.center, obstacles);

    for(let shadow of shadows){
        drawPolygon(copyctx, shadow);
    }

    context.globalCompositeOperation = "lighter";
    context.drawImage(copycanvas, 0, 0);
  }

  // WAR FOG
  context.globalAlpha = 1.0;
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "black";
  context.fillRect(0, 0, 1000, 1000);

  // Restore
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1.0;
}

export { renderLightingEffects };
