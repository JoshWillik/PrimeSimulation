function Grapher(container){
    this.container = document.getElementById(container);
    this.canvasArray = {};
    

    this.init = function(){
        this.addCanvas("base");
        this.draw();
    };
    this.addCanvas = function(name){
        var canvas = document.createElement("canvas");
        this.container.appendChild(canvas);
        this.canvasArray[name] = canvas;
    };
    this.draw = function(){
        var ctx = this.canvasArray.base.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0,0,100,100);
    };
}

function PrimeFinder(){
    this.lastPrime = 1;
    
    this.findNextPrime = function(){
        var last = this.lastPrime;
        var nextPrime = 0;
        while(true){
            
        }
        this.lastPrime = nextPrime; 
    }
}
