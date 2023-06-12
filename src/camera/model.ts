import { Point } from "geomescript";

class CameraBase {
  constructor(
    public position: Point,
    public width: number,
    public height: number
  ) {}

  leftBottomCornerCoordinates(): Point {
    return new Point(this.position.x, this.position.y - this.height);
  }

  // This help you can help you to get the coordinate of a point from from different corners (up-down left) of the camera
  canvasCoordinates(point: Point): Point {
    return new Point(point.x, this.height - point.y);
  }

  cameraCoordinates(point: Point): Point {
    let leftBottomCoordinates = this.leftBottomCornerCoordinates();
    return new Point(
      point.x - leftBottomCoordinates.x,
      point.y - leftBottomCoordinates.y
    );
  }

  transformCoordinates(point: Point): Point {
    return this.canvasCoordinates(this.cameraCoordinates(point));
  }

  // Used for example to see which map coordinates are you pointing to with the mouse
  fromCanvasCoordinatesToMap(point: Point): Point {
    let leftBottomCoordinates = this.leftBottomCornerCoordinates();
    let canvasCoordinates = this.canvasCoordinates(point); // coordinates from left bottom
    return new Point(
      canvasCoordinates.x + leftBottomCoordinates.x,
      canvasCoordinates.y + leftBottomCoordinates.y
    );
  }
}

export { CameraBase };
