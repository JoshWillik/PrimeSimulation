function Grapher(container){
    this.container = document.getElementById(container);
    this.ctx;
    this.pixelData;
    this.finder = new PrimeFinder();
    

    this.init = function(){
        this.makeCanvas("base");
        this.pixelData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
       for(var i = 0; i < 20; i++){ 
           var prime = this.finder.findNextPrime();
           this.drawPixelPrime(prime);
           console.log(prime);
       }
    };
    this.makeCanvas = function(name){
        var canvas = document.createElement("canvas");
        this.container.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
    };
    this.drawPixelPrime = function(num){
        this.pixelData.data[(num*4)] = 255;
        this.pixelData.data[(num*4) + 3] = 255;
        this.ctx.putImageData(this.pixelData, 0, 0);
    }
}

function PrimeFinder(){
    this.lastPrime = 2;
    this.matchedPrimes = [this.lastPrime];
    
    this.findNextPrime = function(){
        console.log(this.matchedPrimes);
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
        for(var i in this.matchedPrimes){
            if(num % this.matchedPrimes[i] === 0){
                return false
            }
        }
        this.matchedPrimes.push(num);
        return true;
    }
}
