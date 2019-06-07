var express = require('express');
var GMC = require('./controllers/GameMasterController');
var lobbyController = require('./controllers/LobbyController');
var app = express();
var server = app.listen(2137, function(){
    console.log("Server is running on port 2137");
});

app.use(express.static('client'));

app.get('/', function(req, res){
    res.status(200).sendFile(__dirname + '/views/lobby.html');
});

app.get('/game', function(req, res){
    res.status(200).sendFile(__dirname + "/views/game.html");
});

GMC(app, server);
lobbyController(app, server);

