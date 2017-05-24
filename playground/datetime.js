

date="01/01/1970";
workFrom="11:40";



Date.prototype.addHours = function(h) {    
           this.setTime(this.getTime() + (h*60*60*1000)); 
           return this;   
        }


d = new Date(date +" "+workFrom);

console.log('DateTime: ' + d);
console.log('DateTime: ' + d.addHours(1));