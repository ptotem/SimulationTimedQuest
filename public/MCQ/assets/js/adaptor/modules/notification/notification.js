var notification = new Environment("notification");

function initNotifications() {
    loadConfig(notification);
}

function notify(message, interval) {
    $('#notification-content').html(message);
    $('#notification').hide().fadeIn(function () {
        $('#notification').delay(interval).fadeOut();
    })
}
