var delta = 0;

var graph1 = new Graph("sin(x)", document.getElementsByTagName("body")[0], func);
var panel1 = new Panel({x: 100, y: 100}, {width: 300, height: 400}, {title: "Graph1", docked: false, parent: document.getElementsByTagName("body")[0], roundness: 10, maximized: false}, graph1);

function func(x)
{
    return Math.sin(x+delta);
}

function frame()
{
    panel1.update();
    delta+=0.06;
    window.requestAnimationFrame(frame);
}

window.onload = () => {    
    window.requestAnimationFrame(frame);
}