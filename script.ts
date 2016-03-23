/// <reference path="typings/browser.d.ts" /> ```

class Vehicle {
    speed: number;
    damagePts: number;
    id: number;
    type: string;
    color: string;
    directions: Array<string>;
    degrees: Array<number>;
    animate: Array<Object>
    currentDirection: string;
    currentDegrees: number;
    currentAnimate: Object;
    baseAnimationDuration: number;
    
    constructor() {
        this.speed = 1;
        this.damagePts = 0;
        this.baseAnimationDuration = 5000;
    }
    
    insert() {
        var newVehicle = $('<div class= "vehicle ' + this.type + '" id=' + this.id + '></div>');
        $('.container').append(newVehicle);
        var left = Math.floor(Math.random() * document.documentElement.clientWidth);
        var top = Math.floor(Math.random() * document.documentElement.clientHeight);
        $('#'+this.id).css("left", left);
        $('#'+this.id).css("top", top);
        this.color = 'rgb(' + randomNum() + ',' + randomNum() + ',' + randomNum() + ')';
        $('#'+this.id).css("background-color", this.color);
        
        var newDirectionIndex = Math.floor(Math.random() * this.directions.length);
        var newDirection = this.directions[newDirectionIndex];
        
        this.currentDirection = newDirection;
        this.currentDegrees = this.degrees[newDirectionIndex];
        this.currentAnimate = this.animate[newDirectionIndex];
        this.move();
    }
    
    move() {
        console.log("moving", this.type, this.currentDirection);
        
        var duration = this.baseAnimationDuration / this.speed;
        var options = {
            step: function() {
                if (detectCollisions(this.id)) {
                    $('#'+this.id).stop();
                }
            },
            duration: duration,
            easing: 'linear',
            done: function() {
                this.move();
            }.bind(this)
        }

        $('#'+this.id).css("transform", `rotate(${this.currentDegrees}deg)`);
        $('#'+this.id).animate(this.currentAnimate, options);
    }
    
    damage() {
        
    }
    
    totaled() {
        
    }
};

class Car extends Vehicle {
    constructor() {
        super();
        this.directions = ["W", "E"];
        this.degrees = [0, 180];
        this.animate = [{left: "-=400"}, {left: "+=400"}];
        this.type = "car";
    }
    
    reverse() {
        $('#'+this.id).stop();
        
        var duration = this.baseAnimationDuration / this.speed;
        var options = {
            step: function() {
                if (detectCollisions(this.id)) {
                    $('#'+this.id).stop();
                }
            },
            duration: duration,
            easing: 'linear',
            done: function() {
                this.move();
            }.bind(this)
        }
        if (this.currentDirection == "W") {
            $('#'+this.id).css('border-spacing', 0);
            this.currentDirection = "E";
            this.currentDegrees = 180;
            this.currentAnimate = {left: "+=400"};
            
            $('#'+this.id).animate({  borderSpacing: 180 }, {
                step: function(now,fx) {
                    $(this).css('transform','rotate('+now+'deg)');
                },
                duration:'slow'
            },'linear');
            $('#'+this.id).animate({left: "+=400"}, options);
            return;
        }
        if (this.currentDirection == "E") {
            $('#'+this.id).css('border-spacing', 180);
            this.currentDirection = "W";
            this.currentDegrees = 0;
            this.currentAnimate = {left: "-=400"};
            
            $('#'+this.id).animate({  borderSpacing: 360 }, {
                step: function(now,fx) {
                    $(this).css('transform','rotate('+now+'deg)');
                },
                duration:'slow'
            },'linear');
            $('#'+this.id).animate({left: "-=400"}, options);
            return;
        }
    }
}

class CopCar extends Car {
    sirenOn: boolean;
    
    constructor() {
        super();
        this.directions = ["N", "S"];
        this.degrees = [90, -90];
        this.animate = [{top: "-=400"}, {top: "+=400"}];
        this.sirenOn = false;
        this.type = "copCar";
    }
    
    siren() {
        if (this.sirenOn == false) {
            this.sirenOn = true;
            allSirens[this.id] = setInterval('blink('+this.id+', "'+this.color+'")', 500);
            return;  
        }
        if (this.sirenOn == true) {
            clearInterval(allSirens[this.id]);
            this.sirenOn = false;
            return;
        }
    }
}

class Motorcycle extends Vehicle {
    constructor() {
        super();
        this.speed = 2;
        this.directions = ["NW", "NE", "SW", "SE"];
        this.degrees = [45, 135, -45, -135];
        this.animate = [
            {left: "-=300", top: "-=300"},
            {left: "+=300", top: "-=300"},
            {left: "-=300", top: "+=300"},
            {left: "+=300", top: "+=300"}
        ];
        this.type = "motorcycle";
    }
}

class Tank extends Vehicle {
    constructor() {
        super();
        this.speed = 0.5;
        this.directions = ["N", "S", "W", "E", "NW", "NE", "SW", "SE"]
        this.degrees = [90, -90, 0, 180, 45, 135, -45, -135];
        this.animate = [
            {top: "-=400"},
            {top: "+=400"},
            {left: "-=400"},
            {left: "+=400"},
            {left: "-=300", top: "-=300"},
            {left: "+=300", top: "-=300"},
            {left: "-=300", top: "+=300"},
            {left: "+=300", top: "+=300"}
        ];
        this.type = "tank";
    }
    
    
}



var allVehicles = [];
var allSirens = [];


var addCar = function() {
    allVehicles.push(new Car());
    var lastIndex = allVehicles.length - 1;
    allVehicles[lastIndex].id = lastIndex;
    allVehicles[lastIndex].insert();
    $('#' + lastIndex).click(function() {
       allVehicles[this.id].reverse();
    });
}

var addCopCar = function() {
    allVehicles.push(new CopCar());
    var lastIndex = allVehicles.length - 1;
    allVehicles[lastIndex].id = lastIndex;
    allVehicles[lastIndex].insert();
    $('#' + lastIndex).click(function() {
       allVehicles[this.id].siren();
    });
}

var addMotorcycle = function() {
    var lastIndex = allVehicles.length - 1;
    allVehicles.push(new Motorcycle());
    allVehicles[lastIndex].id = lastIndex;
    allVehicles[lastIndex].insert();
    $('#' + lastIndex).click(function() {
       allVehicles[this.id].move();
    });
}

var addTank = function() {
    allVehicles.push(new Tank());
    var lastIndex = allVehicles.length - 1;
    allVehicles[allVehicles.length - 1].id = lastIndex;
    allVehicles[allVehicles.length - 1].insert();
    $('#' + lastIndex).click(function() {
       allVehicles[this.id].move();
    });
}

function randomNum() {
    return Math.floor((Math.random() * 150)) + 50;
}

function blink(id, color) {
    $('#'+id).css('background-color', 'yellow');
    setTimeout(function() {
        $('#'+id).css('background-color', color);
    }, 100);
}

function detectCollisions(id) {
    //console.log("vehicle " + id + ", top " + $('#'+id).css("top") + ", left " + $('#'+id).css("left"));
    for (var i in allVehicles) {
        var myTop = parseInt($('#'+id).css("top"), 10);
        var myLeft = parseInt($('#'+id).css("left"), 10);
        var otherTop = parseInt($('#'+i).css("top"), 10);
        var otherLeft = parseInt($('#'+i).css("left"), 10);
        var topDiff = Math.abs(myTop - otherTop);
        var leftDiff = Math.abs(myLeft - otherLeft);
        var collisionThreshold = 75;
        if (i !== id && topDiff < collisionThreshold && leftDiff < collisionThreshold) {
            // origin vehicle hit vehicle from loop
            console.log("collision! vehicle " + id + " hit vehicle " + i);
            var myOptions = {
                done: function() {
                    $('#'+id).remove();
                }
            }
            var otherOptions = {
                done: function() {
                    $('#'+id).remove();
                }
            }
            // for some reason stopping just one results in smoother hide animations
            //$('#'+id).stop();
            $('#'+i).stop();
            $('#'+id).hide(myOptions);
            $('#'+i).hide(otherOptions);
            clearInterval(allSirens[id]);
            clearInterval(allSirens[i]);
            delete allVehicles[id];
            delete allVehicles[i];
            return true;
        } else if (myTop >= document.documentElement.clientHeight || myLeft >= document.documentElement.clientWidth || myTop < -150 || myLeft < -150) {
            // origin vehicle went outside container bounds
            $('#'+id).remove();
            clearInterval(allSirens[id]);
            delete allVehicles[id];
        }
    }
}

$(document).ready(function() {
    $('#btnCar').click(function() {
        addCar();
    });
    $('#btnCopCar').click(function() {
        addCopCar();
    });
    $('#btnMotorcycle').click(function() {
        addMotorcycle();
    });
    $('#btnTank').click(function() {
        addTank();
    });
    
    $('.container').css("width", document.documentElement.clientWidth - 20);
    $('.container').css("height", document.documentElement.clientHeight - 100);
    // $('body').click(function() {
    //     console.log('------------------');
    //     for (var i in allVehicles) {
    //         console.log("vehicle " + i + ", top " + $('#'+i).css("top") + ", left " + $('#'+i).css("left"));
    //     }
    // });
});