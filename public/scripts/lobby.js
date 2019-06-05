var socket = io.connect('http://localhost:2137');
var nick;
var clientHost;
var btn = document.getElementById('start');

socket.on('getNickname', function(message, randomnick){
    nick = prompt(message, randomnick);
    socket.emit('resNickname', nick);
});

socket.on('entry', function(data, host){
    document.getElementById('connected').innerHTML = "";
    for(var i = 0; i<data.length; i++)
    {
        document.getElementById('connected').innerHTML += '<p><strong>' + data[i] + '</strong></p>';
    }
    document.getElementById('header').innerHTML = '<h2>Lobby host: ' + host + '</h2>';;
    clientHost = host;
});