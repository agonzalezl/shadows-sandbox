import { Point, Circle, Segment } from "geomescript";
import { drawCircle, drawSegment } from "./drawing";
import { CameraBase } from "./model";
import {
  SpotLight,
  calculateShadows,
  renderLightingEffects,
} from "./misc/lights";
import { GameData } from "../GameData";

class Camera extends CameraBase {
  constructor(
    public position: Point,
    public width: number,
    public height: number,
    public ctx: CanvasRenderingContext2D
  ) {
    super(position, width, height);
  }

  // Main rendering method
  render(gameData: GameData): void {
    this.ctx.drawImage(gameData.backgroundImage, 0, 0, 1000, 1000);
    renderLightingEffects(
      this.ctx,
      generateSpotlightsAndShadows(
        gameData.spotlights.concat(gameData.player),
        gameData.obstacles
      )
    );
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

function generateSpotlightsAndShadows(
  circleList: Circle[],
  segment: Segment[]
): SpotLight[] {
  let spotLight = [];
  for (var spotlightCircle of circleList) {
    let spotlight = new SpotLight(spotlightCircle);
    spotlight.shadows = calculateShadows(spotlight, segment);
    spotLight.push(spotlight);
  }
  return spotLight;
}

export { Camera };
