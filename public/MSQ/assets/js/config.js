var config = {};
var loadInitConfig = function(){
	config.base = {
	    type: "environment",
	    states: [
		{name: "default", representation: "<img src='" + getImg("msq-background") + "' />"}
	    ]
	};

	config.messages = {
	    type: "environment",
	    states: [
		{name: "default", representation: ""}
	    ],
	    locations: [
		{
		    name: "messageBox",
		    states: [
		        {name: "default", representation: ""}
		    ]
		}
	    ]
	};
}

