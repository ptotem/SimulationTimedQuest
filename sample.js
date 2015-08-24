function sample(){
    var remote_host = "http://localhost:3000/save_result";

    setTimeout(function() {

        var data_string = {
            question: '',
            correct_option:'',
            option_score:'',
            option_status:''
        };
        $.ajax({
            type: "Get",
            url: remote_host,
            dataType: "jsonp",
            data: data_string,
            success: function (res) {
                console.log(res)
            },
            error: function (e, msg) {
                console.log(e)
                console.log(msg)

            }
        });

    }, 500);
}