(() => {
  let canvas;
  let canvasCTX;
  let playingAnimation = false;
  let runAnimation;
  const frameRate = 10;
  let trackingMouse;

  canvas = document.querySelector("canvas");
  canvasCTX = canvas.getContext("2d");
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  let tempCircle = new Circle(canvas.width / 2, canvas.height / 2, 2);
  drawCircle(tempCircle, canvasCTX);

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

    drawCircle(tempCircle, canvasCTX);
  }

  function mapNegate(num) {
    let ratioSplit = 0.5;
    return num < ratioSplit ? -(ratioSplit - num) : num;
  }

  function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  function drawCircle(circle, ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();
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
})();
