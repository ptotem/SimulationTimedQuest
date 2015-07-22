(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);

initMetaData([
    {
        dname: "recordType",
        dtype: "string",
        unique: "false"
    },
    {
        dname: "question",
        dtype: "string",
        unique: "false"
    },
    {
        dname: "result",
        dtype: "boolean",
        unique: "false"
    }
]);


var base, buckets, choices, messages;
window.userGameData=[];

function saveUsersGameData(callback){
	var remote_host = "http://finalassessment.starscribble.in/finish_game";
	//var remote_host = "http://localhost:3000/finish_game";
	$.ajaxSetup({
		headers: {
			'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({type:'POST',url:remote_host, data:{user_results:window.userGameData,time_left:window.parent.clock.getTime().time}, async:false, success:callback});
}

window.onbeforeunload=function(event){
	// event.returnValue="You will not be able to return to the game once you leave this page";
	//var button = "<a class='next-section'>Next Section</a>"
	//displayMessage(getText("msq-gamecomplete") + "<br /><br />" + button, "persist");
	saveUsersGameData();
};

function saveResult(gameData, resultData) {
	var remote_host = "http://finalassessment.starscribble.in/save_result";
	//var remote_host = "http://localhost:3000/save_result";

	var data_string = {
		section: "Multiple Response Questions",
		question: resultData.question,
		selected_option: resultData.selected_option,
		correct_option: resultData.correct_option,
		option_score: resultData.option_score,
		option_status: resultData.option_status
	};

	var requiredDelay = 1000;
	var dateBeforeAjax = new Date();

	window.userGameData.push(data_string);
	game.start(gameData.quesbank, gameData.score, gameData.total, gameData.answerdump, gameData.curanswerdump);
	// $.ajaxSetup({
	// 	headers: {
	// 		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
	// 	}
	// });

	// $.post(remote_host, data_string, function(res) {
	// 	var dateAfterAjax = new Date();
	// 	var ajaxDelay = dateAfterAjax - dateBeforeAjax;
	// 	var delay = ajaxDelay>requiredDelay ? 0 : requiredDelay-ajaxDelay;

	// 	setTimeout(function() {
	// 		gameData.answerdump=[];
	// 		game.start(gameData.quesbank, gameData.score, gameData.total, gameData.answerdump, gameData.curanswerdump);
	// 	}, delay)
	// })

}

function initMaster() {
	loadInitConfig();
	initQuestionBank();
	initLayout();
};


function initLayout() {
    base = new Environment("base");
    messages = new Environment("messages");
    
    loadConfig(base);
    
    loadConfig(messages);
	initQuiz();
	initGame();
}

function initGame() {
    var quesbank = Question.all;
    quesbank = shuffle(quesbank);
	
	var score = 0;
	var total = quesbank.length;
	var answerdump = [];
    playGame(quesbank, score, total, answerdump);
}


function playGame(quesbank, score, total, answerdump) {
	var curanswerdump = [];
	displayMessage(getText("msq-instructions") + "<p id='goahead'>Start!</p>", "persist");
	$("#goahead").unbind('click').on('click', function() {
		$("#messages").fadeOut();
	});
	game.start(quesbank, score, total, answerdump, curanswerdump);
}

var game = {};

game.start = function(quesbank, score, total, answerdump, curanswerdump) {
	$(".option-block").removeClass("no-click selected");
	// $(".option-block").removeClass("incorrect correct no-click correct-unselected");
	if(quesbank.length===0 || limitQuestions(questionbank.questions.length, quesbank.length, 5)) {
		// game.end(getText("msq-gamecomplete") + "<br /><br />You've got " + score + "/" + total + " correct!", "persist");
		var button = "<a class='next-section'>Next Section</a>"
		displayMessage(getText("msq-gamecomplete") + "<br /><br />" + button, "persist");
		reportScore(score);
		reportTime();
		reportComplete();
	}
	else {
		var question = quesbank.pop();

		for(i in question.options)
			if(question.options[i].correct==="true")
				answerdump.push(question.options[i].correct);

		question.options = shuffle(question.options);

		$("#quiz").fadeIn(function() {
			Question.showQuizPanel(quiz, question);
			addQuestionNumber(questionbank.questions.length-quesbank.length);
			checkNullAnswer(question);
			$("#statement-area").append('<p id="submit">Select atleast one option and Submit!</p>');
			game.play(quesbank, question, quesbank, score, total, answerdump, curanswerdump);
		})
	}
};

game.submit = function(quesbank, question, score, total, answerdump, curanswerdump) {

	if($(".locked").length!=0) {
		$(".option-block").toggleClass('no-click');

		$(".locked").each(function() {
			var indx = $("#" + $(this).attr("id")).index();
			$(this).removeClass('locked');
			// if(question.options[indx].correct==="true")
			// 	$(this).addClass('correct');
			// else
			// 	$(this).addClass('incorrect');
		});
		
		// if(curanswerdump.length!==answerdump.length) {
		// 	for(i in question.options) {
		// 		var this_ = $("#option-block-"+i);
		// 		if(question.options[i].correct==="true" && !this_.hasClass('locked') && $(".incorrect").length===0 && !this_.hasClass("correct"))
		// 			this_.addClass('correct-unselected');
		// 	}
		// }

		var gameData = {};
		gameData.quesbank = quesbank;
		gameData.score = score;
		gameData.total = total;
		gameData.answerdump = answerdump;
		gameData.curanswerdump = curanswerdump;

		resultData = {};
		resultData.question = question.name;

		var correctOptions = [];
		var correctOptionsObjArr = [];
		var selectedOptions = [];
		var selectedOptionsObjArr = [];
		var optionStatus = [];
		var points = 0;
		for(var i = 0; i < question.options.length; i++) {
			if(question.options[i].correct === "true"){
				correctOptions.push(question.options[i].name);
				correctOptionsObjArr.push(question.options[i]);
			}

			if($(".option-block").eq(i).hasClass('selected')) {
				selectedOptions.push(question.options[i].name);
				selectedOptionsObjArr.push(question.options[i]);
				//points += parseFloat(question.options[i].points);

				if(question.options[i].correct === "true")
					optionStatus.push("Correct");
				else
					optionStatus.push("Incorrect");
			}
		}

		var correctOptionsLen = correctOptionsObjArr.length;
		var selectedOptionsLen = 0;


		$.each(selectedOptionsObjArr, function( index, value ){
			if(value.correct==="true"){
				selectedOptionsLen = selectedOptionsLen + 1;
			}
		});

		if (selectedOptionsLen==correctOptionsLen) {
			$.each(selectedOptionsObjArr, function( index, value ){
				if(value.correct==="true"){
					points = parseFloat(points) + parseFloat(value.points);
				}
			});
		}

		$.each(selectedOptionsObjArr, function( index, value ){
			if(value.correct==="false"){
				points = 0;
			}
		});

		resultData.selected_option = selectedOptions.join(', ');
		resultData.correct_option = correctOptions.join(', ');
		resultData.option_score = points;
		resultData.option_status = optionStatus.join(', ');

		saveResult(gameData, resultData);

		// if($(".incorrect").length<1 && $(".correct-unselected").length<1) {
		// 	score++;
		// 	reportGameVal({
		// 		"recordType": "Question",
		// 		"question": question.name,
		// 		"result": "correct"
		// 	});
		// }
		// else
		// 	reportGameVal({
		// 		"recordType": "Question",
		// 		"question": question.name,
		// 		"result": "incorrect"
		// 	});

		// setTimeout(function(){
		// 	answerdump=[];
		// 	game.start(quesbank, score, total, answerdump, curanswerdump);
		// }, 2000);
	}
};

game.play = function(quesbank, question, quesbank, score, total, answerdump, curanswerdump) {

	$(question).unbind('answered').on('answered', function(e, data) {

		var this_ = $("#option-block-"+data.optionId);
		this_.toggleClass('locked');
		this_.toggleClass('selected');
		
		if($(".locked").length!=0)
			$("#submit").text("Submit");
		else
			$("#submit").text("Select atleast one option and Submit!");

		if(data.correct==="true")
			curanswerdump.push(data.correct);

	});
		
	$("#submit").unbind('click').on('click', function() {
		game.submit(quesbank, question, score, total, answerdump, curanswerdump);
	});
};

game.end = function(str) {
	displayMessage(str, "persist");
};

function checkNullAnswer(question) {
	for(var i=0; i<question.options.length; i++) {
		if(question.options[i].name==="" || question.options[i].name===" ")
			$("#option-block-"+i).hide();
	}
}

function displayMessage(str, dowhat, duration) {
    $("#messages").fadeIn().css({display: "table"});
    $("#messageBox").empty().append(str);
    $(".next-section").on('click', function() {
		window.parent.location.pathname = "/quinterrogation1";
	});
    $("#messages").css({zIndex: 3});
	if(dowhat!=="persist")
		setTimeout(function() {
			$("#messages").fadeOut();
		},duration);
}           

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function limitQuestions(all, current, limit) {
	return (all-current >= limit)
}

function addQuestionNumber(number) {
	$("#statement-area p").prepend(number+".&nbsp;&nbsp;");
}
