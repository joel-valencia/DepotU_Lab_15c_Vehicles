/// <reference path="typings/browser.d.ts" /> ```
var Vehicle = function () {
    this.speed = 1;
    this.damagePts = 0;
};
Vehicle.prototype.insert = function () {
    var newVehicle = $('<div class= "vehicle ' + this.type + '" id=' + this.id + '></div>');
    $('.container').append(newVehicle);
    var left = Math.floor(Math.random() * document.documentElement.clientWidth);
    var top = Math.floor(Math.random() * document.documentElement.clientHeight);
    $('#' + this.id).css("left", left);
    $('#' + this.id).css("top", top);
    this.color = 'rgb(' + randomNum() + ',' + randomNum() + ',' + randomNum() + ')';
    $('#' + this.id).css("background-color", this.color);
    this.move();
};
Vehicle.prototype.move = function () {
    var newDirectionIndex = Math.floor(Math.random() * this.directions.length);
    var newDirection = this.directions[newDirectionIndex];
    var newDegrees = this.degrees[newDirectionIndex];
    var newAnimate = this.animate[newDirectionIndex];
    console.log("moving", this.type, newDirection);
    this.currentDirection = newDirection;
    var duration = 2000 / this.speed;
    var options = {
        step: function () {
            if (detectCollisions(this.id)) {
                $('#' + this.id).stop();
            }
        },
        duration: duration
    };
    $('#' + this.id).css("transform", "rotate(" + newDegrees + "deg)");
    $('#' + this.id).animate(newAnimate, options);
    // if (newDirection == "N") {
    //     $('#'+this.id).css("transform", "rotate(90deg)");
    //     $('#'+this.id).animate({top: "-=400"}, options);
    // }
    // if (newDirection == "S") {
    //     $('#'+this.id).css("transform", "rotate(-90deg)");
    //     $('#'+this.id).animate({top: "+=400"}, options);
    // }
    // if (newDirection == "W") {
    //     $('#'+this.id).css("transform", "rotate(0)");
    //     $('#'+this.id).animate({left: "-=400"}, options);
    // }
    // if (newDirection == "E") {
    //     $('#'+this.id).css("transform", "rotate(180deg)");
    //     $('#'+this.id).animate({left: "+=400"}, options);
    // }
    // if (newDirection == "NW") {
    //     $('#'+this.id).css("transform", "rotate(45deg)");
    //     $('#'+this.id).animate({left: "-=300", top: "-=300"}, options);
    // }
    // if (newDirection == "NE") {
    //     $('#'+this.id).css("transform", "rotate(135deg)");
    //     $('#'+this.id).animate({left: "+=300", top: "-=300"}, options);
    // }
    // if (newDirection == "SW") {
    //     $('#'+this.id).css("transform", "rotate(-45deg)");
    //     $('#'+this.id).animate({left: "-=300", top: "+=300"}, options);
    // }
    // if (newDirection == "SE") {
    //     $('#'+this.id).css("transform", "rotate(-135deg)");
    //     $('#'+this.id).animate({left: "+=300", top: "+=300"}, options);
    // }
};
Vehicle.prototype.damage = function () {
};
Vehicle.prototype.totaled = function () {
};
var Car = function () {
    Vehicle.call(this);
    this.directions = ["W", "E"];
    this.degrees = [0, 180];
    this.animate = [{ left: "-=400" }, { left: "+=400" }];
};
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;
Car.prototype.reverse = function () {
    var duration = 2000 / this.speed;
    var options = {
        step: function () {
            if (detectCollisions(this.id)) {
                $('#' + this.id).stop();
            }
        },
        duration: duration
    };
    if (this.currentDirection == "W") {
        $('#' + this.id).css('border-spacing', 0);
        this.currentDirection = "E";
        $('#' + this.id).animate({ borderSpacing: 180 }, {
            step: function (now, fx) {
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 'slow'
        }, 'linear');
        $('#' + this.id).animate({ left: "+=400" }, options);
        return;
    }
    if (this.currentDirection == "E") {
        $('#' + this.id).css('border-spacing', 180);
        this.currentDirection = "W";
        $('#' + this.id).animate({ borderSpacing: 360 }, {
            step: function (now, fx) {
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 'slow'
        }, 'linear');
        $('#' + this.id).animate({ left: "-=400" }, options);
        return;
    }
};
var CopCar = function () {
    Car.call(this);
    this.directions = ["N", "S"];
    this.degrees = [90, -90];
    this.animate = [{ top: "-=400" }, { top: "+=400" }];
    this.sirenOn = false;
};
CopCar.prototype = Object.create(Car.prototype);
CopCar.prototype.constructor = CopCar;
CopCar.prototype.siren = function () {
    if (this.sirenOn == false) {
        this.sirenOn = true;
        allSirens[this.id] = setInterval('blink(' + this.id + ', "' + this.color + '")', 500);
        return;
    }
    if (this.sirenOn == true) {
        clearInterval(allSirens[this.id]);
        this.sirenOn = false;
        return;
    }
};
var Motorcycle = function () {
    Vehicle.call(this);
    this.speed = 2;
    this.directions = ["NW", "NE", "SW", "SE"];
    this.degrees = [45, 135, -45, -135];
    this.animate = [
        { left: "-=300", top: "-=300" },
        { left: "+=300", top: "-=300" },
        { left: "-=300", top: "+=300" },
        { left: "+=300", top: "+=300" }
    ];
};
Motorcycle.prototype = Object.create(Vehicle.prototype);
Motorcycle.prototype.constructor = Motorcycle;
var Tank = function () {
    Vehicle.call(this);
    this.speed = 0.5;
    this.directions = ["N", "S", "W", "E", "NW", "NE", "SW", "SE"];
    this.degrees = [90, -90, 0, 180, 45, 135, -45, -135];
    this.animate = [
        { top: "-=400" },
        { top: "+=400" },
        { left: "-=400" },
        { left: "+=400" },
        { left: "-=300", top: "-=300" },
        { left: "+=300", top: "-=300" },
        { left: "-=300", top: "+=300" },
        { left: "+=300", top: "+=300" }
    ];
};
Tank.prototype = Object.create(Vehicle.prototype);
Tank.prototype.constructor = Tank;
var allVehicles = [];
var allSirens = [];
var addCar = function () {
    allVehicles.push(new Car());
    allVehicles[allVehicles.length - 1].id = allVehicles.length - 1;
    allVehicles[allVehicles.length - 1].type = "car";
    allVehicles[allVehicles.length - 1].insert();
    $('#' + (allVehicles.length - 1)).click(function () {
        allVehicles[this.id].reverse();
    });
};
var addCopCar = function () {
    allVehicles.push(new CopCar());
    allVehicles[allVehicles.length - 1].id = allVehicles.length - 1;
    allVehicles[allVehicles.length - 1].type = "copCar";
    allVehicles[allVehicles.length - 1].insert();
    $('#' + (allVehicles.length - 1)).click(function () {
        allVehicles[this.id].siren();
    });
};
var addMotorcycle = function () {
    allVehicles.push(new Motorcycle());
    allVehicles[allVehicles.length - 1].id = allVehicles.length - 1;
    allVehicles[allVehicles.length - 1].type = "motorcycle";
    allVehicles[allVehicles.length - 1].insert();
};
var addTank = function () {
    allVehicles.push(new Tank());
    allVehicles[allVehicles.length - 1].id = allVehicles.length - 1;
    allVehicles[allVehicles.length - 1].type = "tank";
    allVehicles[allVehicles.length - 1].insert();
};
function randomNum() {
    return Math.floor((Math.random() * 150)) + 50;
}
function blink(id, color) {
    $('#' + id).css('background-color', 'yellow');
    setTimeout(function () {
        $('#' + id).css('background-color', color);
    }, 100);
}
function detectCollisions(id) {
    console.log("vehicle " + id + ", top " + $('#' + id).css("top") + ", left " + $('#' + id).css("left"));
    for (var i in allVehicles) {
        var myTop = parseInt($('#' + id).css("top"), 10);
        var myLeft = parseInt($('#' + id).css("left"), 10);
        var otherTop = parseInt($('#' + i).css("top"), 10);
        var otherLeft = parseInt($('#' + i).css("left"), 10);
        var topDiff = Math.abs(myTop - otherTop);
        var leftDiff = Math.abs(myLeft - otherLeft);
        var collisionThreshold = 75;
        if (i !== id && topDiff < collisionThreshold && leftDiff < collisionThreshold) {
            console.log("collision! vehicle " + id + " hit vehicle " + i);
            var myOptions = {
                done: function () {
                    $('#' + id).remove();
                }
            };
            var otherOptions = {
                done: function () {
                    $('#' + id).remove();
                }
            };
            $('#' + id).hide(myOptions);
            $('#' + i).hide(otherOptions);
            clearInterval(allSirens[id]);
            clearInterval(allSirens[i]);
            delete allVehicles[id];
            delete allVehicles[i];
            return true;
        }
    }
}
$(document).ready(function () {
    $('#btnCar').click(function () {
        addCar();
    });
    $('#btnCopCar').click(function () {
        addCopCar();
    });
    $('#btnMotorcycle').click(function () {
        addMotorcycle();
    });
    $('#btnTank').click(function () {
        addTank();
    });
    $('body').click(function () {
        console.log('------------------');
        for (var i in allVehicles) {
            console.log("vehicle " + i + ", top " + $('#' + i).css("top") + ", left " + $('#' + i).css("left"));
        }
    });
});
