$(() => {
    var socket = io();

    var $form = $("#chat-dialog");
    var $name = $("#user");
    var $textarea = $("#chat");

    $form.submit(function(event) {
        event.preventDefault();
        socket.emit('send mess', {mess: $textarea.val(), name: $name.val()});
        // Очищаем поле с сообщением
        $textarea.val('');
    });

    // Здесь отслеживаем событие 'add mess',
    // которое должно приходить из сокета в случае добавления нового сообщения
    socket.on('add mess', function(data) {
        // Встраиваем полученное сообщение в блок с сообщениями
        // У блока с сообщением будет тот класс, который соответвует пользователю что его отправил
        $textarea.append("<p> <b>" + data.name + "</b>: " + data.mess + "</p>");
    });

});

