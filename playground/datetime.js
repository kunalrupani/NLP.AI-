

date="2017-05-24";
workFrom="11:40:00";



Date.prototype.addHours = function(h) {    
           this.setTime(this.getTime() + (h*60*60*1000)); 
           return this;   
        }


startTime1 = new Date(date +" "+workFrom + " GMT-0700");
console.log('DateTime startTime: ' + startTime1);

//endTime1=startTime1.addHours(1);

endTime1 = new Date(date +" "+workFrom + " GMT-0700" );

console.log('DateTime endTime: ' + endTime1.addHours(1));



