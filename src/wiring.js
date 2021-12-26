function lerp(a, b, t) {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
}

class Drawable
{
    constructor(position)
    {
        this.position = {x: position.x, y: position.y};
        this._visibility = "visible";
    }

    show()
    {
        this._visibility = "visible";
    }

    hide()
    {
        this._visibility = "hidden";
    }

    isVisible()
    {
        return this._visibility == "visible";
    }

    getPosition()
    {
        return this.position;
    }
}

class Wire extends Drawable
{
    constructor(position, end, color='red')
    {
        super(position);
        this._endPoint = {x: end.x, y: end.y};
        this._beginHandle = {x: Math.abs(end.x-position.x)*0.8, y: 0};
        this._endHandle = {x: -Math.abs(end.x-position.x)*0.8, y: 0};
        this._resolution = 100;
        this._color = color;
    }

    draw()
    {
        if(this._visibility == "hidden")
            return;
        let h = 0;
        let a = {x: this.position.x+this._beginHandle.x, y: this.position.y+this._beginHandle.y};
        let b = {x: this._endPoint.x+this._endHandle.x, y: this._endPoint.y+this._endHandle.y};
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        for(let i=0; i<=this._resolution; i++)
        {
            h = i/this._resolution;
            let c = lerp(this.position, a, h);
            let d = lerp(a, b, h);
            let e = lerp(b, this._endPoint, h);
            let f = lerp(c, d, h);
            let g = lerp(d, e, h);
            let p = lerp(f, g, h);
            ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = this._color;
        ctx.stroke();
    }

    update()
    {

    }

    dragZone(position)
    {
        return {type: "none"};
    }

    setPosition(position)
    {
        this.position.x = position.x;
        this.position.y = position.y;
        this._beginHandle.x = Math.max(20, Math.abs(this._endPoint.x-this.position.x)*0.8);
        this._endHandle.x = Math.min(-10, -Math.abs(this._endPoint.x-this.position.x)*0.8);
        this._beginHandle.y = 0;
        this._endHandle.y = 0;
    }

    getEnd()
    {
        return this._endPoint;
    }

    setEnd(position)
    {
        this._endPoint.x = position.x;
        this._endPoint.y = position.y;
        this._beginHandle.x = Math.max(20, Math.abs(this._endPoint.x-this.position.x)*0.8);
        this._endHandle.x = Math.min(-10, -Math.abs(this._endPoint.x-this.position.x)*0.8);
        this._endHandle.y = 0;
        this._endHandle.y = 0;
    }
}

class Component extends Drawable
{
    constructor(position, color='grey')
    {
        super(position);
        this._color = color;
        this._size = {x: 150, y: 100};
        this._inputPins = [];
        this._outputPins = [];
        this._spacingBetweenPins = 40;
        this._marginPins = 20;

        this._mouseOffset = {x: 0, y: 0};
    }

    update()
    {
        for(let i in this._inputPins)
        {
            this._inputPins[i].update(this._marginPins+this._spacingBetweenPins*i);
        }
        for(let i in this._outputPins)
        {
            this._outputPins[i].update(this._marginPins+this._spacingBetweenPins*i);
        }
    }

    draw()
    {
        //Draw a rectangle representing the dipole
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this._size.x, this._size.y);
        ctx.strokeStyle = "black";
        //Set stroke width to 4
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = this._color;
        ctx.fill();
        //Reset line width to 1
        ctx.lineWidth = 1;
        for(let i in this._inputPins)
        {
            this._inputPins[i].draw();
        }
        for(let i in this._outputPins)
        {
            this._outputPins[i].draw();
        }
    }

    contains(point)
    {
        return point.x>this.position.x && point.x<this.position.x+this._size.x && point.y>this.position.y && point.y<this.position.y+this._size.y;
    }

    dragZone(point)
    {
        for(let i in this._inputPins)
        {
            if(this._inputPins[i].contains(point))
            {
                return {type: 'pin', pin: this._inputPins[i], index: i, side: 'input'};
            }
        }
        for(let i in this._outputPins)
        {
            if(this._outputPins[i].contains(point))
            {
                return {type: 'pin', pin: this._outputPins[i], index: i, side: 'output'};
            }
        }
        let inside = point.x>this.position.x && point.x<this.position.x+this._size.x && point.y>this.position.y && point.y<this.position.y+this._size.y;
        return {type: inside ? 'component' : 'none', pin: null};
    }
}

class Pin extends Drawable
{
    constructor(component, type)
    {
        super(component.position);
        this._component = component;
        this._color = "black";
        this._type = type;
        this._nature = "coaxial";
        this._radius = 5;
        this._hoverOffset = 10;
    }

    update(offset)
    {
        if(this._type=="input")
        {
            this.position.x = this._component.position.x;
        }
        else if(this._type=="output")
        {
            this.position.x = this._component.position.x + this._component._size.x;
        }
        this.position.y = this._component.position.y + offset;
    }
    
    draw()
    {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this._radius, 0, 2*Math.PI);
        ctx.fillStyle = this._color;
        ctx.fill();
    }

    contains(point)
    {
        // return point.x>this.position.x-this._radius && point.x<this.position.x+this._radius && point.y>this.position.y-this._radius && point.y<this.position.y+this._radius;
        // Return if the point if hovered, taking into account the hover offset
        return point.x>this.position.x-this._radius-this._hoverOffset && point.x<this.position.x+this._radius+this._hoverOffset && point.y>this.position.y-this._radius-this._hoverOffset && point.y<this.position.y+this._radius+this._hoverOffset;
    }
}

class Dipole extends Component
{
    constructor(position, color='grey')
    {
        super(position, color);
        this._inputPins = [new Pin(this, "input")];
        this._outputPins = [new Pin(this, "output")];
    }

    update()
    {   
        super.update();
        this._marginPins = this._size.y/2;
    }

    draw()
    {
        super.draw();
    }
}

class Quadrupole extends Component
{
    constructor(position, color='grey')
    {
        super(position, color);
        this._inputPins = [new Pin(this, "input"), new Pin(this, "input")];
        this._outputPins = [new Pin(this, "output"), new Pin(this, "output")];
    }

    update()
    {   
        super.update();
        // Evently vertically space the four pins
        this._spacingBetweenPins = this._size.y - 2*this._marginPins;
    }

    draw()
    {
        super.draw();
    }
}

class Circuit
{
    constructor(canvas)
    {
        this._cvs = canvas;
        this._ctx = this._cvs.getContext("2d");
        
        this._cvs.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this));
        this._cvs.addEventListener("mousemove", this.mouseMove.bind(this));
        this._mouseDown = false;

        this._components = [];
        this._draggedComponents = [];
        this._tempWire = new Wire({x: 0, y: 0}, {x: 0, y: 0}, "red");
        this._tempWireHook = {x: 0, y: 0};
        this._tempWire.hide();
        this._draggingType = null;
        this._tmpDraggingPinTarget = null;
        this._snappingWidth = 10;
    }

    mouseDown(e)
    {
        for(let i=this._components.length-1; i>=0; i--)
        {
            let drag = this._components[i].dragZone({x: e.offsetX, y: e.offsetY});
            if(drag.type == 'component')
            {
                this._draggingType = "component";
                this._draggedComponents.push(this._components[i]);
                this._components[i]._mouseOffset = {x: e.offsetX - this._components[i].position.x, y: e.offsetY - this._components[i].position.y};
                break;
            }
            else if(drag.type == 'pin')
            {
                this._draggingType = drag.side=='input' ? "wire_in" : "wire_out";
                if(drag.side=='input')
                {
                    this._tempWireHook = drag.pin.position;
                }
                this._tempWire.setPosition(drag.pin.position);
                this._tempWire.setEnd(drag.pin.position);
            }
        }
        this._mouseDown = true;
    }

    mouseUp(e)
    {
        this._mouseDown = false;
        this._draggedComponents = [];
        this._draggingType = null;
        this._tempWire.hide();
        if(this._tempWire.getEnd().x != this._tempWire.getPosition().x || this._tempWire.getEnd().y != this._tempWire.getPosition().y)
        {
            let wire = new Wire(this._tempWire.getPosition(), this._tempWire.getEnd(), "red");
            this._components.push(wire);
        }
    }

    mouseMove(e)
    {
        if(this._mouseDown)
        {
            switch(this._draggingType)
            {
                case "component":
                    for(let i in this._draggedComponents)
                    {
                        // this._draggedComponents[i].position.x = e.offsetX - this._draggedComponents[i]._mouseOffset.x;
                        // this._draggedComponents[i].position.y = e.offsetY - this._draggedComponents[i]._mouseOffset.y;
                        // Update the position of the component taking into account the snapping
                        this._draggedComponents[i].position.x = Math.round((e.offsetX - this._draggedComponents[i]._mouseOffset.x)/this._snappingWidth)*this._snappingWidth;
                        this._draggedComponents[i].position.y = Math.round((e.offsetY - this._draggedComponents[i]._mouseOffset.y)/this._snappingWidth)*this._snappingWidth;
                    }
                    break;
                case "wire_in":
                    this._tempWire.setPosition({x: e.offsetX, y: e.offsetY}); 
                    this._tempWire.show();
                    // Check if a pin is hovered
                    this._tmpDraggingPinTarget = null;
                    for(let i in this._components)
                    {
                        let pin = this._components[i].dragZone({x: e.offsetX, y: e.offsetY});
                        if(pin.type=='pin')
                        {
                            this._tempWire.setPosition(pin.pin.position);
                            this._tmpDraggingPinTarget = pin;
                            break;
                        }
                    }
                    break;
                case "wire_out":
                    this._tempWire.setEnd({x: e.offsetX, y: e.offsetY});
                    this._tempWire.show();
                    // Check if a pin is hovered
                    this._tmpDraggingPinTarget = null;
                    for(let i in this._components)
                    {
                        let pin = this._components[i].dragZone({x: e.offsetX, y: e.offsetY});
                        if(pin.type=='pin')
                        {
                            this._tempWire.setEnd(pin.pin.position);
                            this._tmpDraggingPinTarget = pin;
                            break;
                        }
                    }
                    break;
            }
        }
    }

    addComponent(component)
    {
        this._components.push(component);
    }

    update()
    {
        for(let i in this._components)
        {
            this._components[i].update();
        }
    }

    draw()
    {
        this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);
        for(let i in this._components)
        {
            this._components[i].draw();
        }
        this._tempWire.draw();
    }
}