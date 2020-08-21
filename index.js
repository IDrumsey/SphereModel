(() => {
  let canvas;
  let canvasCTX;
  let playingAnimation = false;
  let runAnimation;
  const frameRate = 10;
  let trackingMouse;
  const skewVal = 10;
  const numNodes = 16;
  const outerCircles = 6;
  const defaultNodeRadius = 2.5;

  canvas = document.querySelector("canvas");
  canvasCTX = canvas.getContext("2d");
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  let modelX = canvas.width/2;
  let modelY = canvas.height/2;

    class Circle {
      constructor(x, y, radius){
        this.x = x;
      this.y = y;
      this.radius = radius;
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
          let tempOuterCircle = new outerCircle(numNodes, 100, (180 / this.numOuterCircles) * i);
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
        this.color = "#fff";
      }
  
      buildNodes(){
        for(let i = 0; i < this.numNodes; i++){
          let angle = (360 / this.numNodes) * i;
          console.log((1 - Math.sin(convertDegToRad(this.rotationAngle) * (getX((360 / this.numNodes) * i, this.radius, this.rotationAngle) / this.radius))))
          let nodeRadius = this.rotationAngle < 90 ? defaultNodeRadius * (1 - Math.sin(convertDegToRad(this.rotationAngle) * (getX((360 / this.numNodes) * i, this.radius, this.rotationAngle) / this.radius))) : defaultNodeRadius * (defaultNodeRadius - (1 - Math.sin(convertDegToRad(this.rotationAngle) * (getX((360 / this.numNodes) * i, this.radius, this.rotationAngle) / this.radius))))
          if(this.rotationAngle > 90){
            nodeRadius
          }
          console.log("Rotation Angle : ", this.rotationAngle,"Node angle : ", angle,  "  Node Radius : ", nodeRadius);
          let tempNode = new Circle(modelX + getX((360 / this.numNodes) * i, this.radius, this.rotationAngle), modelY + getY((360 / this.numNodes) * i, this.radius, this.rotationAngle), nodeRadius);
          this.nodes.push(tempNode);
        }
      }
  
      drawNodes(){
        for(let i = 0; i < this.numNodes; i++){
          drawCircle(this.nodes[i],canvasCTX, this.color);
        }
      }
    }


  let myModel = new Model(canvas.width / 2, canvas.height / 2, 100, outerCircles);

  //Initialize Circles before this event handler
  window.onresize = dimensionChange;

  document.addEventListener("mousedown", () => {
    document.addEventListener("mousemove", logMouseCoords);
  });
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", logMouseCoords);
  });

  function logMouseCoords(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let circleYRatio = 1 - getCirclePosRatios(tempCircle).yRatio;
    let mouseYRatio = 1 - mouseY / canvas.height;

    let updateRatio = mapNegate(mouseYRatio / circleYRatio);

    let newCircleRadius = tempCircle.radius + 1 * updateRatio;
    newCircleRadius = newCircleRadius < 1 ? 1 : newCircleRadius;

    canvasCTX.clearRect(0, 0, canvas.width, canvas.height);
    updateCirclePosition(
      tempCircle,
      tempCircle.x,
      tempCircle.y,
      newCircleRadius
    );

    drawCircle(tempCircle, canvasCTX, randomColor());
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
    let prevRatios = getCirclePosRatios(tempCircle);
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    updateCirclePosition(
      tempCircle,
      prevRatios.xRatio * canvas.width,
      prevRatios.yRatio * canvas.height,
      tempCircle.radius
    );
    drawCircle(tempCircle, canvasCTX);
  }

  function getY(deg, hyp, rotationAngle){
    return hyp * Math.sin(convertDegToRad(deg)).toFixed(3) - (skewVal * (rotationAngle / 180));
  }

  function getX(deg, hyp, rotationAngle){
    let z = Math.cos(convertDegToRad(rotationAngle))
    return (hyp * Math.cos(convertDegToRad(deg)).toFixed(3)) * (Math.abs(90-rotationAngle) / 90);
  }

  function convertDegToRad(deg){
    return deg * (Math.PI / 180);
  }

})();
