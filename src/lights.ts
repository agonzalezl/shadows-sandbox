import { Point, Segment, Vector, Circle, Polygon } from "geomescript";
import { drawPolygon, drawCircle } from "./drawing";

function calculateShadows(spotLight: Point, obstacles: Segment[]): Polygon[] {
  const polygons: Polygon[] = [];
  for (var obstacle of obstacles) {
    polygons.push(calculateShadow(spotLight, obstacle));
  }
  return polygons;
}

function calculateShadow(spotLight: Point, obstacle: Segment): Polygon {
  let v1 = Vector.fromPoints(spotLight, obstacle.start).scaled(1000);
  let p1 = obstacle.start.translate(v1);
  let v2 = Vector.fromPoints(spotLight, obstacle.end).scaled(1000);
  let p2 = obstacle.end.translate(v2);
  return new Polygon([obstacle.start, obstacle.end, p2, p1]);
}

function renderLightingEffects(
  context: CanvasRenderingContext2D,
  spotlights: Circle[],
  obstacles: Segment[]
) {
  renderSpotlights(context, spotlights, obstacles);
  renderShiningEffect(context, spotlights, obstacles);
}

function renderSpotlights(
  context: CanvasRenderingContext2D,
  spotlights: Circle[],
  obstacles: Segment[]
) {
  let currentglobalCompositeOperation = context.globalCompositeOperation;
  // Temp canvas where all the spotlights will be drawn
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
    // Temp canvas where individual spotlight will be drawn
    let individualCanvas = context.canvas.cloneNode() as HTMLCanvasElement;
    let individualctx = individualCanvas.getContext("2d");

    if (!individualctx) {
      console.error(
        "Unable to obtain 2D rendering context for renderLightingEffects"
      );
      return;
    }

    drawCircle(individualctx, spotlight.center, spotlight.radius);

    individualctx.globalCompositeOperation = "destination-out";
    let shadows = calculateShadows(
      new Point(spotlight.center.x, spotlight.center.y),
      obstacles
    );

    for (let shadow of shadows) {
      drawPolygon(individualctx, shadow);
    }

    allShadowsctx.globalCompositeOperation = "source-over";
    allShadowsctx.drawImage(individualCanvas, 0, 0);
  }

  context.globalCompositeOperation = "destination-in";
  context.drawImage(allShadowsCanvas, 0, 0);

  // WAR FOG
  // Cover the rest of the map with a black rectangle
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "black";
  context.fillRect(0, 0, 1000, 1000);

  // Restore
  context.globalCompositeOperation = currentglobalCompositeOperation;
}

function renderShiningEffect(
  context: CanvasRenderingContext2D,
  spotlights: Circle[],
  obstacles: Segment[]
) {
  let currentglobalCompositeOperation = context.globalCompositeOperation;
  let copycanvas = context.canvas.cloneNode() as HTMLCanvasElement;
  let copyctx = copycanvas.getContext("2d");

  if (!copyctx) {
    console.error(
      "Unable to obtain 2D rendering context for renderLightingEffects"
    );
    return;
  }

  // Draw gradients
  copyctx.globalAlpha = 0.4;
  for (var spotlight of spotlights) {
    copyctx.clearRect(0, 0, 1000, 1000);

    copyctx.globalCompositeOperation = "lighter";
    drawCircle(
      copyctx,
      spotlight.center,
      spotlight.radius * 1.5,
      generateShiningGradient(copyctx, spotlight)
    );

    copyctx.globalCompositeOperation = "destination-out";
    let shadows = calculateShadows(spotlight.center, obstacles);

    for (let shadow of shadows) {
      drawPolygon(copyctx, shadow);
    }

    context.globalCompositeOperation = "lighter";
    context.drawImage(copycanvas, 0, 0);
  }

  // Restore
  context.globalCompositeOperation = currentglobalCompositeOperation;
}

function generateShiningGradient(
  ctx: CanvasRenderingContext2D,
  spotlight: Circle
): CanvasGradient {
  const gradient1 = ctx.createRadialGradient(
    spotlight.center.x,
    spotlight.center.y,
    0,
    spotlight.center.x,
    spotlight.center.y,
    spotlight.radius * 1.5
  );
  gradient1.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient1.addColorStop(1, "rgba(0, 0, 0, 1)");
  return gradient1;
}

export { renderLightingEffects };
