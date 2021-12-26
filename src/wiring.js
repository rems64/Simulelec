function lerpVec(a, b, t) {
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
            let c = lerpVec(this.position, a, h);
            let d = lerpVec(a, b, h);
            let e = lerpVec(b, this._endPoint, h);
            let f = lerpVec(c, d, h);
            let g = lerpVec(d, e, h);
            let p = lerpVec(f, g, h);
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

        this._selected = false;

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
        for(let i in this._inputPins)
        {
            this._inputPins[i].draw();
        }
        for(let i in this._outputPins)
        {
            this._outputPins[i].draw();
        }

        if(this._selected)
        {
            const margin = 10;

            ctx.strokeStyle = "orange";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.position.x-margin, this.position.y-margin, this._size.x+2*margin, this._size.y+2*margin);
            ctx.setLineDash([]);
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
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        this._mouseDown = false;

        this._components = [];
        this._draggedComponents = [];
        this._selectedComponents = [];
        this._tempWire = new Wire({x: 0, y: 0}, {x: 0, y: 0}, "red");
        this._tempWireHook = {x: 0, y: 0};
        this._tempWire.hide();
        this._draggingType = null;
        this._draggingRect = {x: 0, y: 0, w: 0, h: 0};
        this._tmpDraggingPinTarget = null;
        this._snappingWidth = 10;
    }

    mouseDown(e)
    {
        this._draggingType = "box_select";
        this._draggingRect = {x: e.clientX, y: e.clientY, w: 0, h: 0};
        let modified = false;
        for(let i=this._components.length-1; i>=0; i--)
        {
            let drag = this._components[i].dragZone({x: e.offsetX, y: e.offsetY});
            if(drag.type == 'component')
            {
                modified = true;
                this._draggingType = "component";
                this._draggedComponents.push(this._components[i]);
                this._components[i]._mouseOffset = {x: e.offsetX - this._components[i].position.x, y: e.offsetY - this._components[i].position.y};
                // break;
            }
            else if(this._selectedComponents.includes(this._components[i]))
            {
                this._draggedComponents.push(this._components[i]);
                this._components[i]._mouseOffset = {x: e.offsetX - this._components[i].position.x, y: e.offsetY - this._components[i].position.y};
            }
            else if(drag.type == 'pin')
            {
                modified = true;
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
        if(!modified)
        {
            this._selectedComponents = [];
            this._draggedComponents = [];
        }
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
        // Check for each component if it's selected or not
        for(let i=0; i<this._components.length; i++)
        {
            if(!this._selectedComponents.includes(this._components[i]))
            {
                this._components[i]._selected = false;
            }
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
                case "box_select":
                    this._draggingRect.w = e.clientX - this._draggingRect.x;
                    this._draggingRect.h = e.clientY - this._draggingRect.y;
                    //Check for each component if it is inside the box
                    let bxa = Math.min(this._draggingRect.x, this._draggingRect.x+this._draggingRect.w);
                    let bxb = Math.max(this._draggingRect.x, this._draggingRect.x+this._draggingRect.w);
                    let bya = Math.min(this._draggingRect.y, this._draggingRect.y+this._draggingRect.h);
                    let byb = Math.max(this._draggingRect.y, this._draggingRect.y+this._draggingRect.h);
                    for(let i in this._components)
                    {
                        if(this._components[i].position.x >= bxa && this._components[i].position.x+this._components[i]._size.x <= bxb && this._components[i].position.y >= bya && this._components[i].position.y+this._components[i]._size.y <= byb)
                        {
                            this._components[i]._selected = true;
                            this._selectedComponents.push(this._components[i]);
                        }
                        else
                        {
                            this._components[i]._selected = false;
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

        //Draw box selection rectangle
        if(this._draggingType == "box_select")
        {
            this._ctx.beginPath();
            this._ctx.rect(this._draggingRect.x, this._draggingRect.y, this._draggingRect.w, this._draggingRect.h);
            this._ctx.strokeStyle = "orange";
            this._ctx.stroke();
            this._ctx.fillStyle = 'rgba(255, 127, 0, 0.2)';
            this._ctx.fill();
        }
    }
}