const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const arrowImage = document.getElementById('arrow');
const newCode = document.getElementById('new-code');
const arrowX = 50;
const arrowY = 50;
const arrowSize = 20;

let fracButton = document.getElementById('frac');
let inputText = document.getElementById('code-text');
let scaleInput = document.getElementById('scale');

let inst = "";
let start = [100,300];
let step = 50 - scaleInput.valueAsNumber;



const compass = [[1,0],[0,1],[-1,0],[0,-1]];

function mod(m,n) {
    return ((m%n)+n)%n
}

function drawGrid(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = start[0]%step; x <= 1000; x += step) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, 1000);
    }

    for (var x = start[1]%step; x <= 1000; x += step) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(1000, 0.5 + x);
    }
    ctx.strokeStyle = 'rgba(0,0,0,.15)';
    ctx.stroke();

}



function drawPath(inst) {
    
    let [x, y] = start;

    drawGrid();

    let dir = 0;
    let xdir = 1;
    let ydir = 0;
    let colorIndex = 0;
    let colors = ['hsl(20 94% 52%)','hsl(280 50% 50%)'];

    ctx.strokeStyle = colors[1];


    ctx.beginPath();
    ctx.moveTo(x,y);

    for (let i = 0; i < inst.length; i++){
        if (inst[i] == "F") {
            x = x+xdir*step;
            y = y+ydir*step;
            ctx.lineTo(x,y);
        } else if (inst[i] == "J") {
            x = x+xdir*step;
            y = y+ydir*step;
            ctx.moveTo(x,y);
        } else if (inst[i] == "B") {
            x = x-xdir*step;
            y = y-ydir*step;
            ctx.lineTo(x,y);
        } else if (inst[i] == "R") {
            dir = mod(dir + 1,4);
            [xdir, ydir] = compass[dir];
        } else if (inst[i] == "L") {
            dir = mod(dir - 1,4);
            [xdir, ydir] = compass[dir];
        } else if (inst[i] == "(") {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x,y);
            colorIndex = (colorIndex + 1)%2;
            ctx.strokeStyle = colors[colorIndex];
        }
    }

    // canvas.width = 200;

    ctx.stroke();

    drawArrow(dir);

    newCode.innerHTML = "";

}

function drawArrow(dir) {
    ctx.translate(arrowX,arrowY);
    ctx.rotate(90 * dir * Math.PI / 180);
    ctx.drawImage(arrowImage, -arrowSize/2, -arrowSize/2, arrowSize, arrowSize);
    ctx.translate(-arrowX,-arrowY);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

inputText.addEventListener("input",()=>{
    fracButton.innerHTML = "Fractalize!";
    inst = inputText.value.toUpperCase().replace(/[^JFBLR]/g,"");
    drawPath(inst);
  });

fracButton.addEventListener("click",()=>{
    fracButton.innerHTML = "Fractalized!";
    let fracString = "";
    inst = inputText.value.toUpperCase().replace(/[^JFBLR]/g,"");
    for (let i = 0; i < inst.length; i++){
        if (inst[i] == "F") {
            fracString = fracString.concat("(",inst,")");
        } else {
            fracString = fracString.concat(inst[i]);
        }
    }
    drawPath(fracString);
    newCode.innerHTML = "The fractal code:<br>".concat(fracString,"<br><br>This is the same as:<br>",fracString.replace(/[()]/g,""));
  });

window.addEventListener('load', e => {
    ctx.drawImage(arrowImage, arrowX-arrowSize/2, arrowY-arrowSize/2, 20, 20);
    drawGrid();
    drawArrow(0);
})

function nearestGrid(x,y) {
    return [Math.round(x/step)*step, Math.round(y/step)*step]
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    start = nearestGrid(x,y);
}

canvas.addEventListener('mousedown', function(e) {
    fracButton.innerHTML = "Fractalize!";
    getCursorPosition(canvas, e);
    drawPath(inst);
})

scaleInput.addEventListener('input', function(e) {
    step = 54 - scaleInput.valueAsNumber;
    drawPath(inst);
})