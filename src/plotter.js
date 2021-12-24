class Widget
{
    constructor(name, parent)
    {
        this._name = name;
        this._parent = parent;
    }

    setParent(parent)
    {
        this._parent = parent;
    }
}


class Graph extends Widget
{
    constructor(name, parent, func=(x)=>{return x;}, xbegin=-2*Math.PI, xend=2*Math.PI, ybegin=-2, yend=2)
    {
        super(name, parent);

        this.width = 0
        this.height = 0;
        this._funcs = [{func: func, color: 'blue'}];
        this._xbegin = xbegin;
        this._xend = xend;
        this._ybegin = ybegin;
        this._yend = yend;
        this._resolution = 500;

        this._root = document.createElement("div");
        this._cvs = document.createElement("canvas");
        this._title = document.createElement("p");

        this._ctx = this._cvs.getContext("2d");

        this._root.style.width = 'fit-content';
        this._root.classList.add("_graphRoot");
        this._title.innerHTML = this._name;

        this._parent.appendChild(this._root);
        this._root.appendChild(this._cvs);
        this._root.appendChild(this._title);
    }

    getDOM()
    {
        return this._root;
    }

    update()
    {
        // console.log("Content updated");
        this.width = getWidth(this._parent);
        this.height = getHeight(this._root)-3*getHeight(this._title);
        this._cvs.width = this.width;
        this._cvs.height = this.height;
        // this._ctx.clearRect(0, 0, this.width, this.height);
        // this._ctx.fillStyle = 'black';
        // this._ctx.fillRect(20, 20, 40, 50);
        this._resolution = 10*this.width;
        this.drawBackground();
        for(let i in this._funcs)
        {
            this.plotFunction(i);
        }
    }

    setBounds(xbegin, xend, ybegin, yend)
    {
        this._xbegin = xbegin;
        this._xend = xend;
        this._ybegin = ybegin;
        this._yend = yend;
    }

    setResolution(resolution)
    {
        this._resolution = resolution;
    }

    setFunction(func)
    {
        this._func = func;
    }

    drawBackground()
    {
        let count = Math.floor(this._xend-this._xbegin);
        let ampl = this._xend-this._xbegin;
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(0, 0, this.width, this.height);
        this._ctx.fillStyle = 'black';
        for(let i=Math.floor(this._xbegin); i<=Math.ceil(this._xend); i+=0.5)
        {
            let x = this.width*(i-this._xbegin)/(this._xend-this._xbegin);
            let y = 0;
            if(i!=0) {y = 0.5;}
            else {y = 2;};
            this._ctx.fillRect(x, 0, y, this.height);
        }

        count = Math.floor(this._yend-this._ybegin);
        ampl = this._yend-this._ybegin;
        for(let i=Math.floor(this._ybegin); i<=Math.ceil(this._yend); i+=0.5)
        {
            let x = this.height*Math.min(Math.max((1-(i-this._ybegin)/(this._yend-this._ybegin)), 0), 1);
            let y = 0;
            if(i!=0) {y = 0.5;}
            else {y = 2;};
            this._ctx.fillRect(0, x, this.width, y);
        }
    }

    plotFunction(index)
    {
        let h=0;
        let x=this._xbegin;
        let y = 0;
        let g= 0;
        const ampl = this._yend-this._ybegin;
        this._ctx.strokeStyle = this._funcs[index].color;
        this._ctx.moveTo(0, ((this._funcs[index].func(this._xbegin)-this._ybegin)/ampl)*(this.height));
        this._ctx.beginPath();
        for(let i=0; i<=this._resolution; i++)
        {
            h=i/this._resolution;
            x = h*(this._xend-this._xbegin)+this._xbegin;
            y = this._funcs[index].func(x);
            g = Math.max(Math.min((y-this._ybegin)/(ampl), 1), 0);
            this._ctx.lineTo(h*(this.width), (1-g)*(this.height));
        }
        this._ctx.stroke();
    }
}



/*
function frame()
{
    panel1.update();
    panel2.update();
    ctx1.clearRect(0, 0, width1, height1);
    ctx2.clearRect(0, 0, width2, height2);
    ctx1.fillStyle = 'white';
    ctx1.fillRect(width1*0.1, height1*0.1, width1*0.8, height1*0.8);
    ctx2.fillStyle = 'white';
    ctx2.fillRect(width2*0.1, height2*0.1, width2*0.8, height2*0.8);
    plotFunction1(width1*0.1, height1*0.1, width1*0.9, height1*0.9, -4*Math.PI, 4*Math.PI, -4*Math.PI, 4*Math.PI, width1/2, xsquared);
    delta+=0.1;
    // plotFunction2(width2*0.1, height2*0.1, width2*0.9, height2*0.9, -4*Math.PI, 4*Math.PI, -4*Math.PI, 4*Math.PI, 100, tan);
    window.requestAnimationFrame(frame);
}

function plotFunction1(xmin, ymin, xmax, ymax, xbegin, xend, ybegin, yend, resolution, func)
{
    let h=0;
    let x=xbegin;
    let y = 0;
    let g= 0;
    const ampl = yend-ybegin;
    ctx1.moveTo(xmin, ((func(xbegin)-ybegin)/ampl)*(ymax-ymin)+ymin);
    ctx1.beginPath();
    for(let i=0; i<=resolution; i++)
    {
        h=i/resolution;
        x = h*(xend-xbegin)+xbegin;
        y = func(x);
        g = (y-ybegin)/(ampl);
        ctx1.lineTo(h*(xmax-xmin)+xmin, g*(ymin-ymax)+ymax);
    }
    ctx1.stroke();
}

*/