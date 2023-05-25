import React, { useState } from 'react';
import Canvas from './canvas'
import { Point, Segment, Polyline, Vector } from 'geomescript';
import { renderLightingEffects, Spotlight } from './lights';
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
    spotlightList.push(new Spotlight(mouseCoords.x, mouseCoords.y));
    renderLightingEffects(ctx, spotlightList,  obstacles());
  }

  function handleCanvasMouseMove(x: any, y: any) {
    mouseCoords = { 'x': x, 'y':y }
  }


function spotlights(): Spotlight[]{
  return [
      new Spotlight(100, 250),
      new Spotlight(50, 50),
      new Spotlight(200, 300),
      new Spotlight(900, 700), 
      new Spotlight(50, 800),
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
