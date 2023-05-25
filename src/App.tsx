import React, { useState } from 'react';
import Canvas from './canvas'
import { Point, Segment, Circle } from 'geomescript';
import { renderLightingEffects } from './lights';
function App() {
  
  let [mouseCoords] = useState({ x: 0, y: 0 });

  let [click] = useState(false);

  const backgroundImage = new Image();
  backgroundImage.src = require('./waldo.jpeg');

  const predraw = (context:any, canvas:any) => {
    const { width, height } = context.canvas
    context.clearRect(0, 0, width, height)
  }

  const draw = (ctx:CanvasRenderingContext2D, frameCount:number) => {
    predraw(ctx, ctx.canvas);

    ctx.drawImage(backgroundImage, 0, 0, 1000, 1000);
    let spotlightList = spotlights();
    spotlightList.push(new Circle(new Point(mouseCoords.x, mouseCoords.y), 0));
    renderLightingEffects(ctx, spotlightList,  obstacles());
  }

  function handleCanvasMouseMove(x: any, y: any) {
    mouseCoords = { 'x': x, 'y':y }
  }


function spotlights(): Circle[]{
  return [
      new Circle(new Point(100, 250), 0),
      new Circle(new Point(50, 50), 0),
      new Circle(new Point(200, 300), 0),
      new Circle(new Point(900, 700), 0), 
      new Circle(new Point(50, 800), 0),
  ]
}

function obstacles(): Segment[]{
  return [
    new Segment(new Point(0, 200), new Point(200, 200)),
    new Segment(new Point(0, 100), new Point(200, 200))
  ];
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
