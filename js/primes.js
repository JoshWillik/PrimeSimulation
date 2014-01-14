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
    this.canv = document.getElementById(container);
    this.ctx = this.canv.getContext("2d");
    this.pixelData;
    this.pixel;
    this.finder = new PrimeFinder();
    this.generator;
    this.saver;
    this.color = [0,255,0,255];
    

    this.init = function(){
        this.finder.matchedPrimes = this.loadPrimeData();
        this.finder.lastPrime = this.finder.matchedPrimes[this.finder.matchedPrimes.length -1];
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.canvas.width = 1920;
        this.ctx.canvas.height= 1080;
        this.pixelData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.pixel = this.ctx.getImageData(0,0,1,1);
        this.resize();
        this.drawPixelPrime(2);
    };
    this.startRender = function(){
        this.generator = setInterval(function(){
               var prime = this.finder.findNextPrime();
               this.drawPixelPrime(prime);
               //console.log(prime);
               this.maybeKillGenerator();
       }.bind(this),0);
        this.saver = setInterval(function(){
            this.savePrimeData();
        }.bind(this), 500);
    };
    this.maybeKillGenerator = function(){
        if(this.finder.lastPrime >= this.ctx.canvas.height * this.ctx.canvas.width){
            this.killGenerator();
        }
    }
    this.killGenerator = function(){
        clearInterval(this.generator);
        clearInterval(this.saver);
    }
    this.drawPixelPrime = function(num){
        num--;
        this.pixel.data[0] = this.color[0]; //green
        this.pixel.data[1] = this.color[1]; //green
        this.pixel.data[2] = this.color[2]; //green
        this.pixel.data[3] = this.color[3]; //alpha
        var x = num % this.ctx.canvas.width;
        var y = (num/this.ctx.canvas.height) | 0;
        this.ctx.putImageData(this.pixel, x, y);
    }
    this.resize = function(){
        var m = this.finder.matchedPrimes;
        for(var i in m){
            this.drawPixelPrime(m[i]);
        }
        if(this.finder.lastPrime < this.ctx.canvas.height * this.ctx.canvas.width){
            this.killGenerator();
            this.startRender();
        }
    };
    this.savePrimeData = function(){
        if(localStorage) localStorage.setItem("primelist", JSON.stringify(this.finder.matchedPrimes));
        else return;
        console.log("prime data saved to localStorage");
    }
    this.loadPrimeData = function(){
        var data;
        if(localStorage) data = localStorage.getItem("primelist");
        if(data === null) return [2];
        if(data.length > 0){
            return JSON.parse(data);
        }else{
            return [2];
        }
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
