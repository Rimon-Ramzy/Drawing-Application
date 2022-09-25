const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")
const sizeSlider = document.querySelector("#size-slider")
const colorBtns = document.querySelectorAll(".colors .option")
const colorPicker = document.querySelector("#color-picker")
const clearCanvas = document.querySelector(".clear-canvas")
const saveImg = document.querySelector(".save-img")

const ctx = canvas.getContext("2d");

let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let prevMouseX;
let prevMouseY;
let snaphsot;
let selectedColor = '#000';

const setCanvasBackground = () => {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
  // SETTING CANVAS WIDTH/HEIGHT - OFFSETWIDTH/OFFSETHEIGHT RETURNS VIEWALE WIDTH/HEIGHT OF AN ELEMENT
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
})

const drawRec = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
  ctx.beginPath(); // CREATING NEW PATH TO DRAW
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2)) // getting radius for circle according to the mouse pointer
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI) // CREATING CIRCLE ACCORDING TO THE MOUSE POINTE
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
  ctx.beginPath(); // CREATING NEW PATH TO DRAW
  ctx.moveTo(prevMouseX, prevMouseY) // MOVING TRIANGLE TO THE MOUSE POINTER
  ctx.lineTo(e.offsetX, e.offsetY) // CREATING FIRST LINE ACCORDING TO THE MOUSE POINETR
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // CREATING BOTTOM LINE OF TRIANGLE
  ctx.closePath(); // CLOSING PATH OF TRIANGLE SO THE THIRD LINE DRAW AUTOMATICALLLY
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}


const drawLine = (e) => {
  ctx.beginPath(); // CREATING NEW PATH TO DRAW
  ctx.moveTo(prevMouseX, prevMouseY) // MOVING LINE TO THE MOUSE POINTER
  ctx.lineTo(e.offsetX, e.offsetY) // CREATING FIRST LINE ACCORDING TO THE MOUSE POINETR
  ctx.stroke();
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snaphsot, 0, 0) // ADDING COPIED CANVAS DATA ON THIS CANVAS
  if (selectedTool == "brush" || selectedTool == "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#FFF" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // CREATING LINE ACCRORDING TO MOUSE POINTER
    ctx.stroke(); // DRAWING/FILLING LINE WITH COLOR
  } else if (selectedTool == "rectangle") {
    drawRec(e);
  } else if (selectedTool == "circle") {
    drawCircle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  } else if (selectedTool == "line") {
    drawLine(e);
  }
}

const startDrow = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // PASSING CURRENT MOUSEX POSITION AS PREVMOUSEX VALUE
  prevMouseY = e.offsetY; // PASSING CURRENT MOUSEY POSITION AS PREVMOUSEY VALUE
  ctx.beginPath(); // CREATING NEW PATH TO DRAW
  ctx.lineWidth = brushWidth; // PASING BRUSH SIZE AS LINE WIDTH
  ctx.strokeStyle = selectedColor; // PASSING SELECTEDCOLOR AS FILL STYLE
  ctx.fillStyle = selectedColor; // PASSING SELECTEDCOLOR AS FILL STYLE
  snaphsot = ctx.getImageData(0, 0, canvas.width, canvas.height) // COPYING CANVAS DATAT & PASSING AS SANPSHOT VALUE.. THIS AVOIDS DRAGGING THE IMAGE
}

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id
    console.log(selectedTool);
  })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value) //PASSING SLIDER VALUE AS BRUSHSIZE


colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  })
})

colorPicker, addEventListener("change", () => {
  colorPicker.parentElement.style.backgroundColor = colorPicker.value; // PASSING PICKED COLOR VALUE FROM COLOR PICKER TO LAST COLOR BTN BACKGROUND
  colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
})

saveImg.addEventListener("click", () => {
  const link = document.createElement("a"); // CREATING <A> ELEMENT
  link.download = `${Date.now()}.jpg`; // PASSING CURRENT DATE AS LINK DOWNLOAD VALUE
  link.href = canvas.toDataURL(); // PASSSING CANVASDATA AS LINK HREF VALUE
  link.click(); // CLICKING LINK TO DOWNLOAD IMAGE
})

canvas.addEventListener("mousedown", startDrow)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)