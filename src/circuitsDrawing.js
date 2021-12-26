function frame()
{
    window.requestAnimationFrame(frame);
    ctx.clearRect(0,  0, width, height);

    circuit.update();
    circuit.draw();
}




var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");

var drawing = false;
var base = {x: 0, y: 0};
var mouseLoc = {x: 0, y: 0};

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
    width = 1000;
    height = 900;
    cvs.width = width;
    cvs.height = height;
    window.requestAnimationFrame(frame);
}