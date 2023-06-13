import { Point, Segment, Circle } from "geomescript";

class GameData {
  constructor(
    public spotlights: Circle[],
    public player: Circle,
    public obstacles: Segment[],
    public backgroundImage: HTMLImageElement
  ) {}
}
export { GameData };
