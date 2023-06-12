import { Point, Segment, Vector, Circle, Polygon } from "geomescript";
import { drawPolygon, drawCircle } from "../drawing";

function calculateShadows(
  spotLight: SpotLight,
  obstacles: Segment[]
): Shadow[] {
  const polygons: Shadow[] = [];
  for (var obstacle of obstacles) {
    polygons.push(calculateShadow(spotLight, obstacle));
  }
  return polygons;
}

function calculateShadow(spotLight: SpotLight, obstacle: Segment): Shadow {
  let v1 = Vector.fromPoints(spotLight.shape.center, obstacle.start).scaled(
    1000
  );
  let p1 = obstacle.start.translate(v1);
  let v2 = Vector.fromPoints(spotLight.shape.center, obstacle.end).scaled(1000);
  let p2 = obstacle.end.translate(v2);
  return new Shadow(new Polygon([obstacle.start, obstacle.end, p2, p1]));
}

class SpotLight {
  constructor(public shape: Circle, public shadows: Shadow[] = []) {}
}

class Shadow {
  constructor(public shape: Polygon) {}
}

function renderLightingEffects(
  context: CanvasRenderingContext2D,
  spotlights: SpotLight[]
) {
  renderSpotlights(context, spotlights);
  renderShiningEffect(context, spotlights);
}

function renderSpotlights(
  context: CanvasRenderingContext2D,
  spotlights: SpotLight[]
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

    drawCircle(individualctx, spotlight.shape.center, spotlight.shape.radius);

    individualctx.globalCompositeOperation = "destination-out";

    for (let shadow of spotlight.shadows) {
      drawPolygon(individualctx, shadow.shape);
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
  spotlights: SpotLight[]
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
      spotlight.shape.center,
      spotlight.shape.radius * 1.5,
      generateShiningGradient(copyctx, spotlight.shape)
    );

    copyctx.globalCompositeOperation = "destination-out";
    for (let shadow of spotlight.shadows) {
      drawPolygon(copyctx, shadow.shape);
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

export { renderLightingEffects, SpotLight, Shadow, calculateShadows };
