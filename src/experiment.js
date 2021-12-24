var formula = [];

document.getElementById("btn1").addEventListener("click", () => {
    let a = document.getElementById("formula").value;
    let both = tokenify(a);
    // let variables = both.variables;
    formula = stackify(both.tokens);
})

var graph1 = new Graph("sin(x)", document.getElementsByTagName("body")[0], func);
var panel1 = new Panel({x: 100, y: 100}, {width: 300, height: 400}, {title: "Graph1", docked: false, parent: document.getElementsByTagName("body")[0], roundness: 10, maximized: false}, graph1);


function func(x)
{
    return evaluateStackified(formula, {x: x});
}

function frame()
{
    panel1.update();
    window.requestAnimationFrame(frame);
}

window.onload = () => {    
    window.requestAnimationFrame(frame);
}