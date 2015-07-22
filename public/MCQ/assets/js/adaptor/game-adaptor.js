/* ----------------------------------------------------------- */
/* Helper Functions */
/* ----------------------------------------------------------- */

function loadConfig(obj) {
    var data = config[obj.name];
    switch (data.type) {
    case "environment":
        for (var j in data.states) {
            obj.defineState(data.states[j].name, data.states[j].representation);
        }
        for (var k in data.locations) {
            var thisLoc = obj.addLocation(data.locations[k].name, data.locations[k].sequence);
            for (var l in data.locations[k].states) {
                thisLoc.defineState(data.locations[k].states[l].name, data.locations[k].states[l].representation);
            }
            if (data.locations[k].positioned) {
                $('#' + data.locations[k].name).css({
                    left: data.locations[k].left + "%",
                    top: data.locations[k].top + "%",
                    height: data.locations[k].height,
                    width: data.locations[k].width
                })
            }
        }
        break;
    case "entity":
        for (var m in data.states) {
            obj.defineState(data.states[m].name, data.states[m].representation);
        }
        for (var n in data.items) {
            for (var p = 0; p < data.items[n].count; p++) {
                var thisItem = obj.createItem(data.items[n].name + "_" + p, data.items[n].attributes);
                for (var o in data.items[n].states) {
                    thisItem.defineState(data.items[n].states[o].name, data.items[n].states[o].representation);
                }
            }
        }
        break;
    default:
        return false;
    }
    return true;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function toSnakeCase(str) {
    return str.split(" ").join("_").toLowerCase();
}

function randBetween(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function findByName(objClass, name) {
    result = $.grep(window[objClass].all, function (a) {
        return (a.name == name);
    })[0];
    return (result == undefined) ? "Not Found" : result;
}

function findById(objClass, id) {
    result = $.grep(window[objClass].all, function (a) {
        return (a.id == id);
    })[0];
    return (result == undefined) ? "Not Found" : result;
}

(function ($) {
    $.fn.countTo = function (options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).each(function () {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(parseFloat(value).toFixed(options.decimals));

                if (typeof (options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof (options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, // the number the element should start at
        to: 100, // the number the element should end at
        speed: 1000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        onUpdate: null, // callback method for every time the element is updated,
        onComplete: null // callback method for when the element finishes updating
    };
})(jQuery);

/* ----------------------------------------------------------- */
/* Reporting Helpers */
/* ----------------------------------------------------------- */

var $p = parent;
var attemptStatus;
var gameTimer, attemptTime;

function initMetaData(blob) {
    if (typeof $p.setMetaData === "function") {
        $p.setMetaData(blob);
    } else {
        console.log(blob);
    }
}

function initAttempt() {
    attemptTime = 0;
    clearInterval(gameTimer);
    gameTimer = setInterval(runTimer, 1000);
    if (typeof $p.startAttempt === "function") {
        $p.startAttempt();
    } else {
        attemptStatus = {
            complete: false,
            score: 0,
            time: 0
        };
        console.log('Attempt Initiated')
    }
}

function runTimer() {
    attemptTime++;
    if (typeof showTimer === "function") {
        showTimer(attemptTime);
    }
}

function reportGameVal(blob) {
    if (typeof $p.setGameVal === "function") {
        $p.setGameVal(blob);
    } else {
        console.log(blob);
    }
}


function reportScore(value) {
    if (typeof $p.setScore === "function") {
        $p.setScore(value);
    } else {
        attemptStatus.score = value;
    }
}

function reportTime() {
    if (typeof $p.setTime === "function") {
        $p.setTime(attemptTime);
    } else {
        attemptStatus.time = attemptTime;
    }
}

function reportComplete() {
    if (typeof $p.setComplete === "function") {
        $p.setComplete();
    } else {
        attemptStatus.complete = true;
        console.log(attemptStatus);
    }
}

/* ----------------------------------------------------------- */
/* View State Helper */
/* ----------------------------------------------------------- */

var State = Fiber.extend(function () {
    return {
        init: function (name, representation) {
            this.name = name;
            this.representation = representation;
        }
    }
});

function defineStateFn(obj, stateName, representation) {
    if (obj.states == undefined) obj.states = [];
    var $objElm = $('#' + obj.name);

    var thisState = $.grep(obj.states, function (a) {
        return (a.name == stateName);
    })[0];

    if (obj.states.indexOf(thisState) != -1) obj.states.splice(obj.states.indexOf(thisState), 1);

    obj.states.push(new State(stateName, representation));
    $objElm.html(representation);
}

function setStateFn(obj, stateName) {
    var $objElm = $('#' + obj.name);
    var thisState = $.grep(obj.states, function (a) {
        return (a.name == stateName);
    })[0];

    if (thisState != -1 && thisState != undefined) {
        $objElm.html(thisState.representation);
        return true;
    } else {
        return false
    }
}

function div(klass, kid) {
    return "<div class='" + klass + "' id='" + kid + "'></div>"
}

/* ----------------------------------------------------------- */
/* Logger Class */
/* ----------------------------------------------------------- */

var Logger = Fiber.extend(function () {
    return {
        init: function (name) {
            this.name = name;
            var privatelog = "";
            this.update = function (value) {
                privatelog = value;
            };
            this.contents = function () {
                return privatelog;
            }
        },
        add: function (msg) {
            this.update(this.contents() + msg + '<br/>');
            $(this).trigger('updated');
            return true;
        },
        reads: function () {
            return this.contents();
        }
    }
});

var log = new Logger('Base');


/* ----------------------------------------------------------- */
/* Environment Classes */
/* ----------------------------------------------------------- */

var Location = Fiber.extend(function () {
    return {
        init: function (name, environment, sequence, entities, items, states) {
            this.name = name;
            this.environment = environment;
            this.sequence = sequence;
            this.entities = entities;
            this.items = items;
            this.states = states;
            log.add('Location ' + this.name + ' created in ' + this.environment.name);

            var currentState = "default";
            this.setMyState = function (stateName) {
                currentState = stateName;
            };
            this.getMyState = function () {
                return currentState;
            }
        },
        defineState: function (stateName, representation) {
            return defineStateFn(this, stateName, representation);
        },
        setState: function (stateName) {
            var newState = setStateFn(this, stateName);
            if (newState) this.setMyState(stateName);
            return newState;
        },
        getState: function () {
            return this.getMyState();
        },
        putEntity: function (entity) {
            if (this.entities == undefined) this.entities = [];
            this.entities.push(entity);
            return true;
        },
        removeEntity: function (entity) {
            if (this.entities.indexOf(entity) != -1) {
                this.entities.splice(this.entities.indexOf(entity), 1);
                return true
            }
            return false;
        },
        putItem: function (item) {
            if (this.items == undefined) this.items = [];
            this.items.push(item);
            return true;
        },
        removeItem: function (item) {
            if (this.items.indexOf(item) != -1) {
                this.items.splice(this.items.indexOf(item), 1);
                return true
            }
            return false;
        }
    }
});

var Environment = Fiber.extend(function () {
    return {
        init: function (name, parent, locations, environments, states) {
            this.name = name;
            this.parent = parent;
            this.locations = locations;
            this.environments = environments;
            this.states = states;
            if (this.parent == undefined) {
                $('#ptotemy-game').append(div("environment", this.name));
            }
            log.add('Environment ' + name + ' created.');

            var currentState = "default";
            this.setMyState = function (stateName) {
                currentState = stateName;
            };
            this.getMyState = function () {
                return currentState;
            }

        },
        defineState: function (stateName, representation) {
            return defineStateFn(this, stateName, representation);
        },
        setState: function (stateName) {
            var newState = setStateFn(this, stateName);
            if (newState) this.setMyState(stateName);
            return newState;
        },
        getState: function () {
            return this.getMyState();
        },
        addLocation: function (locationName, sequence) {
            var thisLocation = toSnakeCase(locationName.toLowerCase());
            this[thisLocation] = new Location(locationName, this, (sequence == undefined ? "NA" : sequence), [], [], []);
            if (this.locations == undefined) this.locations = [];
            this.locations.push(this[thisLocation]);
            $("#" + this.name).append(div("location", this[thisLocation].name));
            return this[thisLocation];
        },
        addEnvironment: function (environmentName) {
            this[environmentName] = new Environment(environmentName, this, [], [], []);
            if (this.environments == undefined) this.environments = [];
            this.environments.push(this[environmentName]);
            $("#" + this.name).append(div("environment", this[environmentName].name));
            return this[environmentName];
        },
        prevLocation: function (location) {
            var currIndex = location.sequence;
            if (currIndex == 0 || currIndex == "NA") {
                return location;
            } else {
                return $.grep(this.locations, function (a) {
                    return (a.sequence == currIndex - 1);
                })[0];
            }
        },
        nextLocation: function (location) {
            var currIndex = location.sequence;
            if (currIndex == this.locations.length || currIndex == "NA") {
                return location;
            } else {
                return $.grep(this.locations, function (a) {
                    return (a.sequence == currIndex + 1);
                })[0];
            }
        }
    }
});

/* ----------------------------------------------------------- */
/* Currency Class - Used with Entities */
/* ----------------------------------------------------------- */

var Currency = Fiber.extend(function () {
    return {
        init: function (name) {
            this.name = name;
            log.add('Currency ' + name + ' created')
        }
    }
});

/* ----------------------------------------------------------- */
/* Wallet Class */
/* ----------------------------------------------------------- */

var Wallet = Fiber.extend(function () {
    return {
        init: function (owner, contents, min, max) {
            this.owner = owner;
            this.contents = contents;
            this.min = min;
            this.max = max;
            log.add(this.owner.name.toLowerCase() + '.' + this.contents.name.toLowerCase() + ' created');

            var amount = 0;
            this.contains = function (value) {
                switch (true) {
                case (value > this.max):
                    $(this).trigger("max", [value, this.max]);
                    log.add(this.contents.name + ' update failed due to a Max out. Amount unchanged');
                    return false;
                case (value < this.min):
                    $(this).trigger("min", [value, this.min]);
                    log.add(this.contents.name + ' update failed due to a Min out. Amount unchanged');
                    return false;
                case (value == null):
                    return amount;
                default:
                    $('#' + this.contents.name + " .value").countTo({
                        from: amount,
                        to: value,
                        speed: 1000,
                        refreshInterval: 10
                    });
                    amount = value;
                    return amount;
                }
            }
        },
        is: function (value) {
            log.add('Updating ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' to ' + value);
            return this.contains(value);
        },
        incrBy: function (value) {
            log.add('Increasing ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' by ' + value);
            return this.contains(this.contains() + value);
        },
        decrBy: function (value) {
            log.add('Decreasing ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' by ' + value);
            return this.contains(this.contains() - value);
        }
    }
});

/* ----------------------------------------------------------- */
/* Entity Class */
/* ----------------------------------------------------------- */

var Entity = Fiber.extend(function () {
    return {
        init: function (name, items, states) {
            this.name = name;
            this.items = items;
            this.states = states;
            Entity.all.push(this);
            log.add('Entity ' + name + ' created');
            $("#entities").append(div("entity", this.name));

            var location = false;
            this.address = function (newLocation) {
                if (newLocation == null) {
                    return location;
                } else {
                    location = newLocation;
                    $('#' + location.name).append($('#' + this.name));
                    return true;
                }
            };

            var currentState = "default";
            this.setMyState = function (stateName) {
                currentState = stateName;
            };
            this.getMyState = function () {
                return currentState;
            }
        },
        defineState: function (stateName, representation) {
            return defineStateFn(this, stateName, representation);
        },
        setState: function (stateName) {
            var newState = setStateFn(this, stateName);
            if (newState) this.setMyState(stateName);
            return newState;
        },
        getState: function () {
            return this.getMyState();
        },
        createWallet: function (forCurrency, min, max, amount) {
            var wallet = forCurrency.name.toLowerCase();
            this[wallet] = new Wallet(this, forCurrency, min, max);
            this[wallet].is(amount);

            return true;
        },
        createItem: function (itemName, attributes) {
            var thisItem = toSnakeCase(itemName.toLowerCase());
            this[thisItem] = new Item(itemName, attributes);
            if (this.items == undefined) this.items = [];
            this.items.push(this[thisItem]);
            $("#" + this.name).append(div("item", this[thisItem].name));
            return this[thisItem];
        },
        addItem: function (item) {
            this.items.push(item);
            $("#" + item.name).detach().appendTo("#" + this.name);
            return item;
        },
        addItems: function (items) {
            for (var i in items) {
                this.items.push(items[i]);
                $("#" + items[i].name).detach().appendTo("#" + this.name);
            }
            return items;
        },
        pays: function (to, value, inCurrency) {
            var currency = inCurrency.name.toLowerCase();
            if (this[currency].decrBy(value) != false) {
                if (to[currency].incrBy(value) != false) {
                    log.add(this.name + ' paid ' + value + ' ' + currency + ' to ' + to.name);
                    return true;
                } else {
                    this[currency].incrBy(value);
                }
            }
            return false;
        },
        gives: function (item, to) {
            if (to.items == undefined) to.items = [];
            $('#' + to.name).append($('#' + item.name));
            return item.transfer(this, to)
        },
        buys: function (item, seller, payment, currency) {
            if (this.items == undefined) this.items = [];
            if (seller.gives(item, this) != false) {
                if (this.pays(seller, payment, currency) != false) {
                    return true;
                } else {
                    this.gives(item, seller)
                }
            }
            return false;
        },
        sells: function (item, buyer, payment, currency) {
            if (buyer.items == undefined) buyer.items = [];
            if (this.gives(item, buyer) != false) {
                if (buyer.pays(this, payment, currency) != false) {
                    return true;
                } else {
                    buyer.gives(item, this)
                }
            }
            return false;
        },
        trades: function (myItem, theirItem, partner) {
            if (this.items == undefined) this.items = [];
            if (partner.items == undefined) partner.items = [];
            if (this.gives(myItem, partner) != false) {
                if (partner.gives(theirItem, this) != false) {
                    return true;
                } else {
                    partner.gives(myItem, this)
                }
            }
            return false;
        },
        location: function (location) {
            if (location == undefined) {
                return this.address();
            } else {
                if (this.address() != false) {
                    this.address().removeEntity(this);
                }
                location.putEntity(this);
                this.address(location);
                $(this).trigger("teleporting", [this.address(), location]);
                log.add(this.name + ' placed at ' + location.name);
                return true;
            }
        },
        moveTo: function (location, speed) {
            var $this = this;
            var oldLocation = this.address();
            var newLocation = location;
            if (oldLocation != newLocation) {
                var $thisObj = $('#' + this.name);
                var oldPosition = $('#' + oldLocation.name).position() || 0;
                var newPosition = $('#' + newLocation.name).position() || 0;
                $thisObj.stop().detach().appendTo('#' + location.environment.name);
                if (speed === undefined) speed = 1500;
                $($this).trigger("moving", [oldLocation, newLocation, speed]);
                $thisObj.css({
                    left: oldPosition.left,
                    top: oldPosition.top
                }).animate({
                    left: newPosition.left,
                    top: newPosition.top
                }, speed, function () {
                    $('#' + $this.name).css({
                        'left': 0,
                        'top': 0
                    });
                    $this.address().removeEntity(this);
                    location.putEntity(this);
                    $this.address(location);
                    log.add($this.name + ' moved to ' + location.name);
                    return true;
                });
            }

        },
        picks: function (item, location) {
            if (this.items == undefined) this.items = [];
            if (location.items.indexOf(item) != -1) {
                this.items.push(item);
                location.items.splice(location.items.indexOf(item), 1);
                return true;
            }
            return false;
        },
        drops: function (item, location) {
            if (location.items == undefined) location.items = [];
            if (this.items.indexOf(item) != -1) {
                location.items.push(item);
                this.items.splice(this.items.indexOf(item), 1);
                return true;
            }
            return false;
        },
        rollsDice: function (count) {
            var results = [];
            var localCount = 0;
            for (i in this.items) {
                if ('roll' in this.items[i]) {
                    if (localCount < count) {
                        results.push(this.items[i].roll());
                        localCount++;
                    }
                }
            }
            return results;
        }
    }
});

Entity.all = [];

/* ----------------------------------------------------------- */
/* Item Class */
/* ----------------------------------------------------------- */

var Item = Fiber.extend(function () {
    return {
        init: function (name, attributes, states) {
            this.name = name;
            this.attributes = attributes;
            this.states = states;
            Item.all.push(this);
            log.add('Item ' + name + ' created.');
            //            $("#items").append(div("item", this.name));

            var location = false;
            this.address = function (newLocation) {
                if (newLocation == null) {
                    return location;
                } else {
                    location = newLocation;
                    $('#' + location.name).append($('#' + this.name));
                    return true;
                }
            };

            var currentState = "default";
            this.setMyState = function (stateName) {
                currentState = stateName;
            };
            this.getMyState = function () {
                return currentState;
            }
        },
        defineState: function (stateName, representation) {
            return defineStateFn(this, stateName, representation);
        },
        setState: function (stateName) {
            var newState = setStateFn(this, stateName);
            if (newState) this.setMyState(stateName);
            return newState;
        },
        getState: function () {
            return this.getMyState();
        },
        transfer: function (playerA, playerB) {
            if (playerA.items.indexOf(this) != -1) {
                playerA.items.splice(playerA.items.indexOf(this), 1);
                playerB.items.push(this);
                log.add(playerA.name + ' gave the ' + this.name + ' to ' + playerB.name);
                return true;
            }
            return false;
        },
        location: function (location) {
            if (location == undefined) {
                return this.address();
            } else {
                $(this).trigger("teleporting", [this.address(), location]);
                if (this.address() != false) {
                    this.address().removeItem(this);
                }
                location.putItem(this);
                this.address(location);
                log.add(this.name + ' placed at ' + location.name);
                return true;
            }
        },
        moveTo: function (location) {
            $(this).trigger("moving", [this.address(), location]);
            this.address().removeItem(this);
            location.putItem(this);
            this.address(location);
            log.add(this.name + ' moved to ' + location.name);
            return true;
        }
    }
});

Item.all = [];

/* ----------------------------------------------------------- */
/* Item Sub Classes */
/* ----------------------------------------------------------- */
/*-----------------------------------------------------------------------------------------------------------------------*/


/* ----------------------------------------------------------- */
/* Dice Class */
/* ----------------------------------------------------------- */

var Dice = Item.extend(function () {
    return {
        roll: function (interval) {
            if (interval == null) {
                interval = 2000;
            }
            log.add(this.name + " dice started rolling for " + interval / 1000 + " secs");
            $(this).trigger('rollStart');
            var that = this;
            var result = randBetween(1, that.items.length);
            setTimeout(function () {
                $(that).trigger('rollEnd', {
                    result: items[result]
                });
                log.add(that.name + " dice stopped. Final result was " + items[result]);
            }, interval);
            return items[result];
        }
    }
});