
var howtoenv;
var howto;
var howtoFlag;
var arrowImg;

var htTheme;
var htEasing;
var htContentInEffect;
var htContentOutEffect;
var htShowTime;

var howtoData = [];

config.howtoenv = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "howtoholder", states: [
            {name: "default", representation: ""}
        ]}
    ]
}

config.howto = {
    type: "entity",
    states: [
        {name: "active", representation: "<div id='howtoArrow'><img src='' /></div><div id='howtoContent'></div>"},
        {name: "default", representation: "<div id='howtoArrow'><img src='' /></div>"}
    ]
}

function initHowto(data, theme, easing, contentInEffect, contentOutEffect, showTime) {
    howtoenv = new Environment("howtoenv");
    howto = new Entity("howto");
    loadConfig(howtoenv);
    loadConfig(howto);
    howto.location(howtoenv.howtoholder);

    howtoData = data;

    //Sort howtoData according to its 'sequence'
    howtoData.sort(function(a, b){
        var a1= a.sequence, b1= b.sequence;
        if(a1 == b1) return 0;
        return a1> b1? 1: -1;
    });

    howtoFlag = 0;
    htTheme = "light"
    htEasing = "swing";
    htContentInEffect = "slide";
    htContentOutEffect = "drop";

    if((theme != undefined) || (theme == ""))
        htTheme = theme;

    if((easing != undefined) || (easing == ""))
        htEasing = easing;

    if((contentInEffect != undefined) || (contentInEffect == ""))
        htContentInEffect = contentInEffect;

    if((contentOutEffect != undefined) || (contentOutEffect == ""))
        htContentOutEffect = contentOutEffect;

    htShowTime = showTime;

    arrowImg="modules/howto/img/arrow.png"
    initHowtoTheme();

    howtoStart();
}

function initHowtoTheme() {
    switch(htTheme) {
        case "light":
            $("#howto").css({color: "rgba(25, 25, 25)"});
            arrowImg = arrowImg.split(".png")[0]+"-light.png";
            $("#howtoArrow").find('img').attr('src', arrowImg);
            break;

        case "dark":
            $("#howto").css({color: "rgba(235, 235, 235)"});
            arrowImg = arrowImg.split(".png")[0]+"-dark.png";
            $("#howtoArrow").find('img').attr('src', arrowImg);
            break;

        default:
            $("#howto").css({color: "rgba(25, 25, 25)"});
            arrowImg = arrowImg.split(".png")[0]+"-light.png";
            $("#howtoArrow").find('img').attr('src', arrowImg);
    }
}

function loadHowtoTheme() {
    $("#howtoArrow").find('img').attr('src', arrowImg);
    switch(htTheme) {
        case "light":
            $("#howtoContent").css({background: "rgba(235, 235, 235, 0.95)"});
            break;

        case "dark":
            $("#howtoContent").css({background: "rgba(35, 35, 35, 0.95)"});
            break;

        default:
            $("#howtoContent").css({background: "rgba(235, 235, 235, 0.95)"});
    }
}



function howtoStart() {
    var divId = ("#"+howtoData[howtoFlag].loc);
    if($(divId).attr("id") == undefined) {
        console.log("Location-"+howtoData[howtoFlag].loc+" does not exist!")
        howtoRedo();
    } else {
        var loc = howtoSetLoc(divId);
        howtoAnimate(divId, loc);
        setTimeout(function() {
            howtoChangeState('active', loc, howtoChangeState);
            $("#howtoContent").html(howtoData[howtoFlag].description);
        }, 1000);
    }
}

function howtoRedo() {
    var next = incHowtoFlag();
    if(next)
        howtoStart();
    else
        howtoHide();
}

function incHowtoFlag() {
    howtoFlag++;
    if(howtoFlag < howtoData.length)
        return true;
    else
        return false;
}

function howtoHide() {
    $("#howto").fadeOut(750);
    setTimeout(function() {
        $("#howtoenv").remove();
    }, 750);
}

function howtoSetLoc(divId) {
    var gameHeight = $("#ptotemy-game").outerHeight();
    var gameWidth = $("#ptotemy-game").outerWidth();

    var divTop = $(divId).offset().top;
    var divLeft = $(divId).offset().left;
    var divHeight = $(divId).outerHeight();
    var divWidth = $(divId).outerWidth();

    var howtoHeight = parseInt($("#howto").css('max-height').split("px")[0]);
    var howtoWidth = parseInt($("#howto").css('max-width').split("px")[0]);

    var loc = {};

    var placement;
    if((divLeft+divWidth+howtoWidth) <= gameWidth)
        placement = "right";
    else if((divLeft-howtoWidth) >= 0)
        placement = "left";
    else if((divTop+divHeight+howtoHeight+10) <= gameHeight)
        placement = "bottom";
    else if((divTop-howtoHeight) >= 0)
        placement = "top";
    else placement = "center";

    loc.placement = placement;

    var thisTop = divTop;
    var thisLeft = divLeft;

    var arrowTop = 0;
    var arrowLeft = 0;
    var contentTop = 0;
    var contentLeft = $("#howtoArrow").outerWidth();

    switch(placement) {
        case "top":
            //Calcualte Top Difference
            var topDiff = howtoHeight;
            thisTop = thisTop-topDiff;

            //Calcualte left Difference
            var leftDiff = 0;
            if(howtoWidth < divWidth)
                leftDiff = (divWidth-howtoWidth)/2;

            thisLeft = thisLeft+leftDiff;
            arrowTop = howtoHeight-$("#howtoArrow").outerWidth();

            break;

        case "bottom":
            //Calcualte Top Difference
            var topDiff = divHeight;
            thisTop = thisTop+topDiff;

            //Calcualte left Difference
            var leftDiff = 0;
            if(howtoWidth < divWidth)
                leftDiff = (divWidth-howtoWidth)/2;

            thisLeft = thisLeft+leftDiff;

            break;

        case "left":
            //Calculate Arrow Positions
            arrowLeft = howtoWidth-($("#howtoArrow").outerWidth());
            if(divHeight > $("#howtoArrow").height())
                arrowTop = (divHeight-$("#howtoArrow").height())/2;
            else
                arrowTop = -(divHeight/2);

            if(divHeight >= howtoHeight)
                arrowTop = howtoHeight/2;

            contentLeft = 0;

            //Calcualte Top Difference
            var topDiff = 0;
            if(howtoHeight < divHeight)
                topDiff = (divHeight-howtoHeight)/2;
            thisTop = thisTop+topDiff;
            if((thisTop+howtoHeight) > gameHeight) {
                thisTop = divTop+divHeight-howtoHeight;
                arrowTop = (divTop-thisTop)+((divHeight-$("#howtoArrow").height())/2);
            }

            //Calcualte left Difference
            var leftDiff = howtoWidth;
            thisLeft = thisLeft-leftDiff;

            break;



        case "right":
            //Calculate Arrow Top
            if(divHeight > $("#howtoArrow").height())
                arrowTop = (divHeight-$("#howtoArrow").height())/2;
            else
                arrowTop = -(divHeight/2);

            if(divHeight >= howtoHeight)
                arrowTop = (howtoHeight-$("#howtoArrow").height())/2;

            //Calcualte Top Difference
            var topDiff = 0;
            if(howtoHeight < divHeight)
                topDiff = (divHeight-howtoHeight)/2;
            thisTop = thisTop+topDiff;
            if((thisTop+howtoHeight) > gameHeight) {
                thisTop = divTop+divHeight-howtoHeight;
                arrowTop = (divTop-thisTop)+((divHeight-$("#howtoArrow").height())/2);
            }

            //Calcualte left Difference
            var leftDiff = divWidth;
            thisLeft = thisLeft+leftDiff;

            break;

        case "center":
            var topDiff = (divHeight-howtoHeight)/2;
            var leftDiff = (divWidth-howtoWidth)/2;
            thisTop = thisTop+topDiff;
            thisLeft = thisLeft+leftDiff;

            arrowTop = howtoHeight/2;

            break;
    }

    //Store Values in Object
    loc.top = thisTop;
    loc.left = thisLeft;

    loc.arrowTop = arrowTop;
    loc.arrowLeft = arrowLeft;
    loc.contentTop = contentTop;
    loc.contentLeft = contentLeft;

    return loc;
}

function howtoAnimate(divId, loc) {
    $("#howtoArrow").attr('class', "howto-"+loc.placement);
    howtoArrowPos(loc, "animate");
    $("#howto").animate({
        top: loc.top,
        left: loc.left
    }, 500, htEasing);

    setTimeout(function() {
        if(howtoFlag == 0) {
            $("#howto").animate({
                opacity: 1
            }, 250);
        }
    }, 250);

}

function howtoChangeState(state, loc, callback) {
    howto.setState(state);
    $("#howtoArrow").attr('class', "howto-"+loc.placement);
    loadHowtoTheme();
    howtoArrowPos(loc, "css");
    howtoContentPos(loc, "css", callback);
}

function howtoArrowPos(loc, type) {
    $("#howtoArrow")[type]({
        top: loc.arrowTop,
        left: loc.arrowLeft
    });
}

function howtoContentPos(loc, type, callback) {
    $("#howtoContent")[type]({
        top: loc.contentTop,
        left: loc.contentLeft
    });

    $("#howtoContent").effect(htContentInEffect, 200);
    var dataLength = howtoData[howtoFlag].description.split(" ").length;
    var delay = 300*dataLength;
    if(htShowTime != undefined)
        delay = htShowTime;

    if(delay < 2500)
        delay = 2500;

    if(howto.getState() == 'active')
        if (typeof callback === "function") {
            setTimeout(function(){
                $("#howtoContent").effect(htContentOutEffect, 200);
                setTimeout(function() {
                    callback('default', loc, howtoRedo);
                }, 300);
            }, delay);
        }

    if(howto.getState() == 'default')
        if (typeof callback === "function")
            callback();
}