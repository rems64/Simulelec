function frame()
{
    ctx.clearRect(0,  0, width, height);
    
    panel1.update();
    
    circuit.update();
    circuit.draw();

    window.requestAnimationFrame(frame);
}


var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");

var drawing = false;
var base = {x: 0, y: 0};
var mouseLoc = {x: 0, y: 0};

var graph1 = new Graph("sin(x)", document.getElementsByTagName("body")[0], func);
var panel1 = new Panel({x: 100, y: 100}, {width: 300, height: 400}, {title: "Graph1", docked: false, parent: document.getElementsByTagName("body")[0], roundness: 10, maximized: false}, graph1);

function func(x)
{
    return Math.sin(x);
}

// var path1 = new Wire({x: 200, y: 200}, {x: 600, y: 600}, 'red');
var circuit = new Circuit(cvs);
circuit.addComponent(new Capacitor({x: 300, y: 400}));
circuit.addComponent(new Coil({x: 500, y: 400}));
circuit.addComponent(new Lamp({x: 800, y: 400}));
circuit.addComponent(new Resistor({x: 300, y: 600}));

cvs.addEventListener("mousedown", (evt) => {
    drawing = true;
    base.x = evt.clientX;
    base.y = evt.clientY;
});

document.addEventListener("mousemove", (evt) => {
    mouseLoc.x = evt.clientX;
    mouseLoc.y = evt.clientY;
})

document.addEventListener("mouseup", () => {
    drawing = false;
})

var width, height;

window.onload = () => {
    let margin = {x: 2, y: 2};
    width = window.innerWidth - margin.x;
    height = window.innerHeight - margin.y;
    cvs.style.position = "absolute";
    cvs.style.top = margin.x/2+'px';
    cvs.style.left = margin.y/2+'px';
    cvs.width = width;
    cvs.height = height;
    window.requestAnimationFrame(frame);
}