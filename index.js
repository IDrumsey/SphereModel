(() => {
  let canvas;
  let canvasCTX;
  let playingAnimation = false;
  let runAnimation;
  const frameRate = 10;
  let trackingMouse;
  const numNodes = 30;
  const outerCircles = 5;
  const defaultNodeRadius = 2;
  const minNodeRadius = .5;
  const outerCircleRadius = 200;

  canvas = document.querySelector("canvas");
  canvasCTX = canvas.getContext("2d");
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  let modelX = canvas.width/2;
  let modelY = canvas.height/2;

    class Circle {
      constructor(x, y, radius, angle){
        this.x = x;
      this.y = y;
      this.radius = radius;
      this.angle = angle;
      }
    }
  
    class Model {
      constructor(originX, originY, radius, numOuterCircles){
        this.originX = originX;
        this.originY = originY;
        this.radius = radius;
        this.numOuterCircles = numOuterCircles;
        this.outerCircles = [];
        this.buildOuterCircles();
        this.drawModel();
        console.log(this)
      }
  
      buildOuterCircles(){
        for(let i = 0; i < this.numOuterCircles; i++){
          let tempOuterCircle = new outerCircle(numNodes, outerCircleRadius, (180 / this.numOuterCircles) * i);
          this.outerCircles.push(tempOuterCircle);
        }
      }

      drawModel(){
        for(let i = 0; i < this.outerCircles.length; i++){
          this.outerCircles[i].drawNodes();
        }
      }
    }
  
    class outerCircle{
      constructor(numNodes, radius, rotationAngle){
        this.numNodes = numNodes;
        this.radius = radius;
        this.nodes = [];
        this.rotationAngle = rotationAngle;
        this.buildNodes();
        this.drawNodes();
        this.color = "#a1d1c9";
        //this.drawLines();
      }
  
      buildNodes(){
        for(let i = 0; i < this.numNodes; i++){
          let angle = (360 / this.numNodes) * i;
          let scalarFactor = Math.sin(convertDegToRad(this.rotationAngle));
          let innerDistance = -Math.cos(convertDegToRad(angle));
          let nodeRadius = defaultNodeRadius + (innerDistance * (scalarFactor * (defaultNodeRadius - minNodeRadius)));
          let tempNode = new Circle(modelX + getX(angle, this.radius, this.rotationAngle), modelY + getY(angle, this.radius, this.rotationAngle), nodeRadius, angle);
          this.nodes.push(tempNode);
        }
      }

      changeRotationAngle(newRotationAngle){
        for(let i = 0; i < this.nodes.length; i++){
          let angle = this.nodes[i].angle;
          let scalarFactor = Math.sin(convertDegToRad(newRotationAngle));
          let innerDistance = -Math.cos(convertDegToRad(angle));
          let nodeRadius = defaultNodeRadius + (innerDistance * (scalarFactor * (defaultNodeRadius - minNodeRadius)));
          this.nodes[i].x = modelX + getX(angle, this.radius, this.rotationAngle);
          this.nodes[i].y = modelY + getY(angle, this.radius, this.rotationAngle);
          this.nodes[i].radius = nodeRadius;
        }
      }
  
      drawNodes(){
        for(let i = 0; i < this.numNodes; i++){
          drawCircle(this.nodes[i],canvasCTX, this.color);
        }
      }

      drawLines(){
        for(let i = 0; i < this.nodes.length; i++){
          for(let j = 0; j < this.nodes.length; j++){
            if(i != j && j % 2 == 0){
              canvasCTX.beginPath();
              canvasCTX.strokeStyle = "#fff";
              canvasCTX.moveTo(this.nodes[i].x, this.nodes[i].y);
              canvasCTX.lineTo(this.nodes[j].x, this.nodes[j].y);
              canvasCTX.stroke();
            }
          }
        }
      }
    }


  let myModel = new Model(canvas.width / 2, canvas.height / 2, 100, outerCircles);

  //Initialize Circles before this event handler
  window.onresize = dimensionChange;

  let trackOriginalMouseMovement = 1;
  let originalMouseX;
  let originalMouseY;
  document.addEventListener("mousemove", (e) => {
    if(trackOriginalMouseMovement == 1){
      originalMouseX = e.clientX;
    originalMouseY = e.clientY;
    }
  })

  document.addEventListener("mousedown", () => {
    trackOriginalMouseMovement = 0;
    document.addEventListener("mousemove", logMouseCoords);
  });
  document.addEventListener("mouseup", () => {
    trackOriginalMouseMovement = 1;
    document.removeEventListener("mousemove", logMouseCoords);
  });

  function logMouseCoords(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let xDiff = (mouseX - originalMouseX);
    let yDiff = mouseY - originalMouseY;

    originalMouseX += xDiff;
    originalMouseY += yDiff;

    canvasCTX.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < myModel.outerCircles.length; i++){
      let currCircle = myModel.outerCircles[i];
     if(currCircle.rotationAngle + xDiff > 180){
       currCircle.rotationAngle = Math.abs(180 - (currCircle.rotationAngle + xDiff));
     }
     else if(currCircle.rotationAngle + xDiff < 0){
       currCircle.rotationAngle = 180 + (currCircle.rotationAngle + xDiff);
     }
     else{
       currCircle.rotationAngle += xDiff;
     }
     currCircle.changeRotationAngle(currCircle.rotationAngle);
     if(currCircle.rotationAngle != 0){
      for(let j = 0; j < currCircle.nodes.length; j++){
        let currNode = currCircle.nodes[j];
        if(currNode.angle - yDiff > 360){
          currNode.angle = Math.abs(360 - (currNode.angle - yDiff));
        }
        else if(currNode.angle - yDiff < 0){
          currNode.angle = 360 - Math.abs(currNode.angle - yDiff);
        }
        else{
          currNode.angle -= yDiff;
        }
      }
     }
     
     currCircle.drawNodes();
    }
  }

  function mapNegate(num) {
    let ratioSplit = 0.5;
    return num < ratioSplit ? -(ratioSplit - num) : num;
  }

  function drawCircle(circle, ctx, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function randomColor(){
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return ("rgb(" + r + ", " + g + ", " + b + ")");
  }

  function updateCirclePosition(circle, x, y, radius) {
    circle.x = x;
    circle.y = y;
    circle.radius = radius;
  }

  function getCirclePosRatios(circle) {
    let prevState = {
      xRatio: circle.x / canvas.width,
      yRatio: circle.y / canvas.height,
    };

    return prevState;
  }

  function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dimensionChange() {
    for(let i = 0; i < myModel.outerCircles.length; i++){
      for(let j = 0; j < myModel.outerCircles[i].nodes.length; j++){
        let prevRatios = getCirclePosRatios(myModel.outerCircles[i].nodes[j]);
        updateCirclePosition(myModel.outerCircles[i].nodes[j],prevRatios.xRatio * innerWidth, prevRatios.yRatio * innerHeight, myModel.outerCircles[i].nodes[j].radius)
      }
    }
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    clearCanvas(canvasCTX);
    for(let i = 0; i < myModel.outerCircles.length; i++){
      for(let j = 0; j < myModel.outerCircles[i].nodes.length; j++){
        drawCircle(myModel.outerCircles[i].nodes[j], canvasCTX, myModel.outerCircles[i].color);
      }
      //myModel.outerCircles[i].drawLines();
    }
  
    console.log(myModel);
  }

  function getY(deg, hyp, rotationAngle){
    
    return hyp * Math.sin(convertDegToRad(deg)).toFixed(3);
  }

  function getX(deg, hyp, rotationAngle){
    if(rotationAngle > 90){
      deg -= 180;
    }
    let z = Math.cos(convertDegToRad(rotationAngle))
    return (hyp * Math.cos(convertDegToRad(deg)).toFixed(3)) * (Math.abs(90-rotationAngle) / 90);
  }

  function convertDegToRad(deg){
    return deg * (Math.PI / 180);
  }

})();
