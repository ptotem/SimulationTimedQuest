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
	$.ajax({type:'POST', url:remote_host, data:{user_results:window.userGameData,time_left:window.parent.clock.getTime().time},async:false, success:callback});
}

window.onbeforeunload=function(event){
	// event.returnValue="You will not be able to return to the game once you leave this page";
	//var button = "<a class='next-section'>Next Section</a>"
	//game.end(getText("mcq-gamecomplete") + "<br /><br />" + button, "persist");
	saveUsersGameData();
};

function saveResult(gameData, resultData) {
	var remote_host = "http://finalassessment.starscribble.in/save_result";
	//var remote_host = "http://localhost:3000/save_result";

	var data_string = {
		section: "Single Response Questions",
		question: resultData.question,
		selected_option: resultData.selected_option,
		correct_option: resultData.correct_option,
		option_score: resultData.option_score,
		option_status: resultData.option_status
	};

	var requiredDelay = 1000;
	var dateBeforeAjax = new Date();

	window.userGameData.push(data_string);
	game.start(gameData.quesbank, gameData.score, gameData.total);
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
	// 		game.start(gameData.quesbank, gameData.score, gameData.total);
	// 	}, delay)
	// })

}

function initMaster() {
	initLayout();
	initGame();
}

    
function initLayout() {
    base = new Environment("base");
    messages = new Environment("messages");
    
    loadConfig(base);
    
    loadConfig(messages);
	initQuiz();
}

function initGame() {
    var quesbank = Question.all;
    quesbank = shuffle(quesbank);
	
	var score = 0;
	var total = quesbank.length;
    playGame(quesbank, score, total);
}


function playGame(quesbank, score, total) {
	displayMessage(getText("mcq-instructions") + "<p id='goahead'>Start!</p>", "persist");
	$("#goahead").unbind('click').on('click', function() {
		$("#messages").fadeOut();
	});
	game.start(quesbank, score, total);
}

var game = {};

game.start = function(quesbank, score, total) {
	$(".option-block").removeClass("selected no-click");
	// $(".option-block").removeClass("incorrect correct no-click");

	if(quesbank.length===0 || limitQuestions(questionbank.questions.length, quesbank.length, 25)) {
		var button = "<a class='next-section'>Next Section</a>"
		displayMessage(getText("mcq-gamecomplete") + "<br /><br />" + button, "persist");
		// game.end(getText("mcq-gamecomplete") + "<br /><br />You've got " + score + "/" + total + " correct!", "persist");
		reportScore(score);
		reportTime();
		reportComplete();
	}
	else {
		var question = quesbank.pop();
		$("#quiz").fadeIn(function() {
			question.options = shuffle(question.options);
			Question.showQuizPanel(quiz, question);
			addQuestionNumber(questionbank.questions.length-quesbank.length);
			checkNullAnswer(question);
			game.play(question, quesbank, score, total);
		})
	}
};

game.play = function(question, quesbank, score, total) {
	$(question).unbind('answered').on('answered', function(e, data) {
		$(".option-block").addClass("no-click");

		$("#option-block-" + data.optionId).addClass("selected");
		var correctOption;
		for(var i = 0; i < question.options.length; i++)
			if(question.options[i].correct==="true"){
				correctOption = question.options[i].name;
				break
			}


		var gameData = {};
		gameData.quesbank = quesbank;
		gameData.score = score;
		gameData.total = total;

		resultData = {};
		resultData.question = question.name;
		resultData.selected_option = question.options[data.optionId].name;
		resultData.correct_option = correctOption;
		resultData.option_score = data.points;
		resultData.option_status = data.correct==="true" ? "Correct" : "Incorrect";

		saveResult(gameData, resultData);


		// if(data.correct==="true") {
		// 	$("#option-block-" + data.optionId).addClass("correct");
		// 	score++;
		// 	reportGameVal({
		// 		"recordType": "Question",
		// 		"question": question.name,
		// 		"result": "correct"
		// 	});

		// 	parent.markQuestionAttemptCorrect();
		// }
		// else {
		// 	$("#option-block-" + data.optionId).addClass("incorrect");
		// 	for(var i=0; i<question.options.length; i++)
		// 		if(question.options[i].correct==="true")
		// 			$("#option-block-"+i).addClass("correct");
		// 	reportGameVal({
		// 		"recordType": "Question",
		// 		"question": question.name,
		// 		"result": "incorrect"
		// 	});
		// }

		// setTimeout(function() {
		// 	game.start(quesbank, score, total)
		// }, 2000);
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
		window.parent.location.pathname = "/msq";
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
