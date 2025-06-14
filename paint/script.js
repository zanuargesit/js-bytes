const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brushBtn = document.getElementById("brush");
const eraserBtn = document.getElementById("eraser");
const colorPicker = document.getElementById("colorPicker");
const clearBtn = document.getElementById("clear");

canvas.width = 800;
canvas.height = 500;

let painting = false;
let erasing = false;
let currentColor = "#000000";
let lineWidth = 5; 

function startPainting(e) { 
    painting = true;
    draw(e); 
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function endPainting() { 
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = erasing ? "#ffffff" : currentColor;
    
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function selectBrush() { 
    erasing = false;
    brushBtn.classList.add("active");
    eraserBtn.classList.remove("active");
}

function selectEraser() { 
    erasing = true;
    brushBtn.classList.remove("active");
    eraserBtn.classList.add("active");
}

function clearCanvas() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColor(e) {
    currentColor = e.target.value;
}

brushBtn.addEventListener("click", selectBrush);
eraserBtn.addEventListener("click", selectEraser);
colorPicker.addEventListener("input", changeColor);
clearBtn.addEventListener("click", clearCanvas);

canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endPainting); 
canvas.addEventListener("mouseleave", endPainting); 