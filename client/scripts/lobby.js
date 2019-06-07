var socket = io.connect('http://localhost:2137');
var nick;
var clientHost;

socket.on('getNickname', function(message, randomnick){
    do
    {
        nick = prompt(message, randomnick);
    }while(nick == null);
    socket.emit('resNickname', nick);
});

socket.on('entry', function(data, host){
    document.getElementById('connected').innerHTML = "";
    for(var i = 0; i<data.length; i++)
    {
        if(nick == data[i])
        {
            document.getElementById('connected').innerHTML += '<p class="localclient"><strong>' + data[i] + '</strong></p>';
        }
        else
        {
            document.getElementById('connected').innerHTML += '<p class="client"><strong>' + data[i] + '</strong></p>';
        }
    }
    document.getElementById('header').innerHTML = '<h2>Lobby host: ' + host + '</h2>';
    clientHost = host;
    if(clientHost == nick)
    {
        document.getElementById('start').disabled = false;
    }
    else
    {
        document.getElementById('start').disabled = true;
    }
});

socket.on('start', function(){
    window.location.href = '/game';
});

function start(){
    socket.emit('start');
}

function  enterChatSend(e)
{
    if(e.keyCode == 13)
    {
        chatSend();
    }
}

function chatSend(){
    var wschk = (document.getElementById('message').value).trim();
    if(wschk != "")
    {
        socket.emit('chat', {
            sender: nick,
            message: document.getElementById('message').value,
        });
        document.getElementById('message').value = "";
    }
}

socket.on('chat', function(data){
    if(data.sender == nick)
    {
        document.getElementById('output').innerHTML += '<p style="margin-left: 10px;"><strong class="localclient">' + data.sender + ': </strong>' + data.message + '</p>';
    }
    else
    {
        document.getElementById('output').innerHTML += '<p style="margin-left: 10px;"><strong class="client">' + data.sender + ': </strong>' + data.message + '</p>';
    }
});
