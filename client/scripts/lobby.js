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
    var connected = document.getElementById('connected');
    connected.innerHTML = "";
    for(var i = 0; i<data.length; i++)
    {
        if(nick == data[i])
        {
            connected.innerHTML += '<p class="localclient"><strong>' + data[i] + '</strong></p>';
        }
        else
        {
            connected.innerHTML += '<p class="client"><strong>' + data[i] + '</strong></p>';
        }
    }
    document.getElementById('header').innerHTML = '<h2>Lobby host: ' + host + '</h2>';
    clientHost = host;
    var nodes = document.getElementById("options").getElementsByTagName('*');
    if(clientHost == nick)
    {
        for(var i = 0; i < nodes.length; i++)
        {
            nodes[i].disabled = false;
        }
        document.getElementById('start').disabled = false;
    }
    else
    {
        for(var i = 0; i < nodes.length; i++)
        {
            nodes[i].disabled = true;
        }
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

function sendOptions()
{
    var maxPlayers = document.getElementById("maxPlayers").value;
    var playedCards = [];
    var cards = document.getElementsByClassName("card");
    for(var i = 0; i<cards.length; i++){
        if(cards[i].checked==true)
        {
            playedCards.push(cards[i].value);
        }
    };
    var data = {lobbyLimit: maxPlayers, cards: playedCards};
    socket.emit('Options', data);
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
