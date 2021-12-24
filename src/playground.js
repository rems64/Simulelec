// var panel1 = new Panel({x: 100, y: 100}, {width: 300, height: 500}, {title: "Graph1", docked: false, parent: document.getElementsByTagName("body")[0], roundess: 10, maximized: false}, new cPar1());
// var panel2 = new Panel({x: 500, y: 100}, {width: 300, height: 500}, {title: "Graph2", docked: false, parent: document.getElementsByTagName("body")[0], roundess: 10, maximized: false}, new cPar2());

var delta = 0;

var graph1 = new Graph("sin(x)", document.getElementsByTagName("body")[0], func);
var panel1 = new Panel({x: 100, y: 100}, {width: 300, height: 400}, {title: "Graph1", docked: false, parent: document.getElementsByTagName("body")[0], roundness: 10, maximized: false}, graph1);

// var graph2 = new Graph("tan(x)", document.getElementsByTagName("body")[0], (x)=>{return Math.tan(x)});
// var panel2 = new Panel({x: 100, y: 100}, {width: 300, height: 400}, {title: "Graph2", docked: false, parent: document.getElementsByTagName("body")[0], roundness: 10, maximized: false}, graph2);

function func(x)
{
    return Math.sin(x+delta);
}

function frame()
{
    panel1.update();
    delta+=0.06;
    // panel2.update();
    window.requestAnimationFrame(frame);
}

window.onload = () => {    
    window.requestAnimationFrame(frame);
}