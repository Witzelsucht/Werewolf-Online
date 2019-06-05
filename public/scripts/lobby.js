var socket = io.connect('http://localhost:2137');

socket.on('getNickname', function(){
    var nick = prompt('Podaj nick');
    socket.emit('resNickname', nick);
});

socket.on('entry', function(data){
    document.getElementById('connected').innerHTML = "";
    for(var i = 0; i<data.length; i++)
    {
        document.getElementById('connected').innerHTML += '<p><strong>' + data[i] + '</strong></p>';
    }
});