function parseNumber(source, startIndex)
{
    var number = '';
    let offset = 0;
    let char;
    for(let i=startIndex; i<source.length; i++)
    {
        char = source[i];
        if(isNaN(char) && char!='.')
        {
            break;
        }
        number+=char;
        offset++;
    }
    return {offset: offset, number: number}
}

function tokenify(source)
{
    var tokens = [];
    let char;
    let finished = false;
    let i = 0;
    while(!finished)
    {
        if(i>=source.length)
        {
            finished = true;
            break;
        }
        let char = source[i];
        if(!isNaN(char))
        {
            let result = parseNumber(source, i);
            i+=result.offset;
            tokens.push({type: 0, value: result.number})
        }
        else if(char!=' ' && char!='(' && char!=')')
        {
            tokens.push({type: 1, value: char});
            i++;
        }
        else if(char=='(')
        {
            tokens.push({type: 2, value: char});
            i++;
        }
        else if(char==')')
        {
            tokens.push({type: 3, value: char});
            i++;
        }
        else
        {
            i++;
        }
    }
    return tokens;
}

function operatorStrength(operator)
{
    switch (operator) {
        case '^':
            return 4;
        case '*':
            return 3;
        case '/':
            return 3;
        case '+':
            return 2;
        case '-':
            return 2;
        default:
            return 1;
    }
}

function operatorAssociativity(operator)
{
    switch (operator) {
        case '^':
            return 1; // Right associative
        case '*':
            return 0; // Left associative
        case '/':
            return 0;
        case '+':
            return 0;
        case '-':
            return 0;
        default:
            return 0;
    }
}

function stackify(tokens)
{
    let token;
    let outputQueue = [];
    let operatorsStack = [];
    for(let i in tokens)
    {
        token = tokens[i];
        if(token.type==0)
        {
            outputQueue.push(token);
        }
        else if(token.type==1)
        {
            while(operatorsStack.length>0)
            {
                if(operatorsStack.at(-1).value=='(' || operatorStrength(operatorsStack.at(-1).value)<operatorStrength(token.value) || ((operatorStrength(operatorsStack.at(-1).value)==operatorStrength(token.value)) && operatorAssociativity(token.value)!=0))
                {
                    break;
                }
                outputQueue.push(operatorsStack.at(-1));
                operatorsStack.pop();
            }
            operatorsStack.push(token);
        }
        else if(token.type==2) // Left parenthesis (
        {
            operatorsStack.push(token)
        }
        else if(token.type==3) // Right parenthesis )
        {
            while(operatorsStack.at(-1).type!=2)
            {
                if(operatorsStack.length<=0)
                {
                    console.log("Error, mismatching parenthesis!");
                    return null;
                }
                outputQueue.push(operatorsStack.at(-1));
                operatorsStack.pop();
            }
            operatorsStack.pop();
        }
    }
    var tmp = [...operatorsStack]
    while(operatorsStack.length>0)
    {
        outputQueue.push(operatorsStack.pop());
    }
    return outputQueue;
}

function evaluateStackified(stackified)
{
    temp = [...stackified];
    var stack = [];
    let elem;
    while(temp.length>0)
    {
        elem = temp[0];
        if(elem.type==0)
        {
            stack.push(elem.value);
        }
        else if(elem.type==1)
        {
            if(stack.length<2) {
                console.log("ERROR PLEASE INVESTIGATE"); return;
            };
            let a = parseFloat(stack.at(-2));
            let b = parseFloat(stack.at(-1));
            let c;
            switch (elem.value) {
                case '+':
                    c = a+b;
                    break;
                case '-':
                    c = a-b;
                    break;
                case '*':
                    c = a*b;
                    break;
                case '/':
                    c = a/b;
                    break;
                case '^':
                    c = Math.pow(a, b);
                    break;
                default:
                    console.log("Unknown operator " + elem.value);
                    break;
            }
            stack.pop();
            stack.pop();
            stack.push(c);
        }
        temp.shift()
    }
    return stack[0];
}

document.getElementById("btn1").addEventListener("click", () => {
    let a = document.getElementById("formula").value;
    let b = evaluateStackified(stackify(tokenify(a)));
    document.getElementById("answer").innerHTML = b;
})