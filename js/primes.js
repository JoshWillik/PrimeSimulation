(function(){
    var noTimeFunction = [];
    var messageName = "zero-timeout-hack";

    //setTimeout with no 4-10ms enforced waittime
    function zeroTimeout(fn){
        noTimeFunction.push(fn);
        window.postMessage(messageName, "*");
    }

    function handleMessage(event){
        if(event.source == window && event.data == messageName){
            event.stopPropagation();
            if(noTimeFunction > 0){
                var fn = noTimeFunction.shift();
                fn();
            }
        }
    }
    
    window.addEventListener("message", handleMessage, true);

    window.zeroTimeout = zeroTimeout;
})(); //^credit to David Baron for this beauty^

function Grapher(container){
    this.container = document.getElementById(container);
    this.ctx;
    this.pixelData;
    this.pixel;
    this.finder = new PrimeFinder();
    this.generator;
    

    this.init = function(){
        this.makeCanvas("base");
        this.ctx.canvas.width = 1920;
        this.ctx.canvas.height= 1080;
        this.pixelData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.pixel = this.ctx.getImageData(0,0,1,1);
        this.generator = setInterval(function(){
               var prime = this.finder.findNextPrime();
               this.drawPixelPrime(prime);
               console.log(prime);
               this.maybeKillGenerator();
       }.bind(this),0);
    };
    this.maybeKillGenerator = function(){
        if(this.finder.lastPrime >= this.ctx.canvas.height * this.ctx.canvas.width){
            clearInterval(this.generator);
        }
    }
    this.makeCanvas = function(name){
        var canvas = document.createElement("canvas");
        this.container.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
    };
    this.drawPixelPrime = function(num){
        this.pixel.data[1] = 255; //green
        this.pixel.data[3] = 255; //alpha
        var x = num % this.ctx.canvas.width;
        var y = (num/this.ctx.canvas.height) | 0;
        this.ctx.putImageData(this.pixel, x, y);
        //console.log(this.pixel);
    }
}

function PrimeFinder(totalPixels){
    this.lastPrime = 2;
    this.matchedPrimes = [this.lastPrime];
    this.dontbother = Math.sqrt(totalPixels);
    
    this.findNextPrime = function(){
        var prime = this.lastPrime;
        var nextPrime = 0;
        while(true){
           prime++; 
           if(this.isPrime(prime)){
               nextPrime = prime;
               this.lastPrime = prime;
               return prime;
           }
        }
    }
    this.isPrime = function(num){
        var square = Math.sqrt(num);
        for(var i in this.matchedPrimes){
            if(this.matchedPrimes[i] > square) break;
            if(num % this.matchedPrimes[i] === 0){
                return false
            }
        }
        if(num > this.dontbother){}
        else{
            this.matchedPrimes.push(num);
        return true;
        }
    }
}
