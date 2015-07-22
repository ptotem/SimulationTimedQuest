var slider = new Environment('slider');

config.slider = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: function () {
        var allLocations = [];
        var noOfLocations = config.sliderPoints || 100;
        for (var i = 0; i < noOfLocations; i++) {
            allLocations.push({name: "loc" + i, positioned: true, sequence: i, left: parseFloat(100 * (i / noOfLocations)), top: 0, width: parseFloat(100 / noOfLocations) + "%", height: "100%", states: [
                {name: "filled", representation: "<div class='filled'></div>"},
                {name: "default", representation: "<div class='unfilled'></div>"}
            ]});
        }
        return allLocations;
    }()
};

function initSlider(marker){
    loadConfig(slider);
    $(marker).on('moving', function (e, from, to, speed) {
        fillSlider(from, to, speed);
    });
    $(marker).on('teleporting', function (e, from, to) {
        fillSlider(from, to);
    });
}

function fillSlider(from, to, speed) {
    if (speed == 0 || speed == undefined) {
        for (i = 0; i < to.sequence; i++) {
            slider["loc" + i].setState('filled');
        }
        for (i = to.sequence + 1; i < to.environment.locations.length; i++) {
            slider["loc" + i].setState('default');
        }
    } else {
        var i = from.sequence;
        var filler = setInterval(function () {
            if (from.sequence < to.sequence) {
                slider["loc" + i].setState('filled');
                i++;
            } else {
                slider["loc" + i].setState('default');
                i--;
            }
        }, (0.99*speed / Math.abs(from.sequence - to.sequence)));
        setTimeout(function () {
            clearInterval(filler);
            i = 0;
        }, speed + 1);
    }

}