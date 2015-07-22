var config = {};

config.base = {
    type: "environment",
    states: [
        {name: "default", representation: "<img src='" + getImg("mcq-background") + "' />"}
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