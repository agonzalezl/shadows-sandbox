import React, { useState } from 'react';
import Canvas from './canvas'
import { Point, Segment, Circle } from 'geomescript';
import { GameData } from './GameData';
import { Camera } from './camera/camera';
function App() {
  
  const backgroundImage = new Image();
  backgroundImage.src = require('./waldo.jpeg');
  let camera: Camera | undefined = undefined;
  let gameData = new GameData(
    [
      new Circle(new Point(100, 900), 70),
      new Circle(new Point(900, 900), 70),
      new Circle(new Point(100, 500), 70),
      new Circle(new Point(900, 500), 70), 
      new Circle(new Point(500, 750), 120),
  ],
  new Circle(new Point(100, 250), 70),
  [
    new Segment(new Point(300, 850), new Point(700, 850)),
    new Segment(new Point(300, 650), new Point(700, 650)),

    new Segment(new Point(300, 650), new Point(300, 850)),
  ],
  backgroundImage
  );
  let [mouseCoords] = useState({ x: 0, y: 0 });

  let [click] = useState(false);



  const predraw = (context:any, canvas:any) => {
    const { width, height } = context.canvas
    context.clearRect(0, 0, width, height)
  }

  const draw = (ctx:CanvasRenderingContext2D, frameCount:number) => {
    camera = new Camera(new Point(0, 1000), 1000, 1000, ctx);

    predraw(ctx, ctx.canvas);

    gameData.player = new Circle(new Point(mouseCoords.x, mouseCoords.y), 70);
    camera.render(gameData);

  }

  function handleCanvasMouseMove(x: any, y: any) {
    if(!camera){
      return;
    }
    let point= camera.fromCanvasCoordinatesToMap(new Point(x, y));
    mouseCoords = { 'x': point.x, 'y':point.y }
  }

  function handleCanvasClick(x: any, y: any) {
    click = true
  }
  
  return <Canvas draw={draw} options={{'context': '2d'}}
          mouseMoveCallback={handleCanvasMouseMove}
          clickCallback={handleCanvasClick}
          />

}

export default App
