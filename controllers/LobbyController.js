var socket = require('socket.io');
var allClients = [];
module.exports = function(app, server){
    io = socket(server);
    io.on('connection', function(socket){
        socket.emit('getNickname');
        socket.on('resNickname', function(data){
            allClients.push(data);
            io.sockets.emit('entry', allClients);
        });
        socket.on('disconnect', function(socket){
            var i = socket.i;
            allClients.splice(i, 1);
            io.sockets.emit('entry', allClients);
        });
    });
}