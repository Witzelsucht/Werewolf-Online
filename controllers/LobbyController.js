var socket = require('socket.io');
var allClients = [];
var host;

function randomNick(){
    var nickBase = ["Nowakus", "Duża Roxi", "Huberinio", "Wrotka Wywrotka", "Twój Stary", "Twoja Stara", "Dzban"];
    var nick = nickBase[Math.floor(Math.random()*6)];
    return nick;
}

module.exports = function(app, server){
    io = socket(server);
    io.on('connection', function(socket){
        if(allClients[0] == null)
        {
            host = "";
        }
        socket.emit('entry', allClients, host);
        socket.emit('getNickname', "Podaj nick" ,randomNick());
        socket.on('resNickname', function(data){
            var nickTaken = false;
            for(var i = 0; i<allClients.length; i++)
            {
                if(allClients[i] == data)
                {
                    nickTaken = true;
                }
            }
            if(nickTaken)
            {
                socket.emit('getNickname', "Nick już zajęty", randomNick());
            }
            else
            {
                allClients.push(data);
                host = allClients[0];
                io.sockets.emit('entry', allClients, host);
            }
        });
        socket.on('disconnect', function(socket){
            var i = socket.i;
            allClients.splice(i, 1);
            host = allClients[0];
            io.sockets.emit('entry', allClients, host);
        });   
        socket.on('start', function(){
            io.sockets.emit('start');
        })  
        socket.on('chat', function(data){
            io.sockets.emit('chat', data);
        });
    });
}