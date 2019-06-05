module.exports = function(app){
    app.get('/game', function(req, res){
        res.status(200).sendFile('game');
    });
}