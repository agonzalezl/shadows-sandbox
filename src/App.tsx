import React, { useState } from 'react';
import Canvas from './canvas'
import { Point, Segment, Circle } from 'geomescript';
import { GameData } from './GameData';
import { Camera } from './camera/camera';
function App() {
  
  const backgroundImage = new Image();
  backgroundImage.src = require('./waldo.jpeg');

  let gameData = new GameData(
    [
      new Circle(new Point(100, 250), 70),
      new Circle(new Point(50, 50), 70),
      new Circle(new Point(200, 300), 70),
      new Circle(new Point(900, 700), 70), 
      new Circle(new Point(50, 800), 70),
  ],
  new Circle(new Point(100, 250), 70),
  [
    new Segment(new Point(0, 200), new Point(200, 200)),
    new Segment(new Point(0, 100), new Point(200, 200))
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
    let initialCamera = new Camera(new Point(0, 1000), 1000, 1000, ctx);

    predraw(ctx, ctx.canvas);

    gameData.player = new Circle(new Point(mouseCoords.x, mouseCoords.y), 70);
    initialCamera.render(gameData);

  }

  function handleCanvasMouseMove(x: any, y: any) {
    mouseCoords = { 'x': x, 'y':y }
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
