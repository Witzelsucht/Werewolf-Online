var socket = io.connect('http://localhost:2137');
var nick;
var clientHost;
var cards = document.getElementsByClassName("card");
var cardCount = 0;

socket.on('getNickname', function (message, randomnick) {
    do {
        nick = prompt(message, randomnick);
    } while (nick == null);
    socket.emit('resNickname', nick);
});

socket.on('FullLobby', function () {
    alert("Lobby jest pełne");
    window.location.href = "http://www.google.com";
});

socket.on('entry', function (data, host, gameRules) {
    changeMaxCount();
    var val = gameRules.lobbyLimit;
    var sel = document.getElementById("maxPlayers");
    var opts = sel.options;
    for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == val) {
            sel.selectedIndex = j;
            break;
        }
    }
    for (var i = 0; gameRules.cards.length > i; i++) {
        for (var j = 0; cards.length > j; j++) {
            console.log(gameRules.cards[i]);
            console.log(cards[j].value);
            if (gameRules.cards[i] == cards[j].value) {
                cards[j].checked == true;
                break;
            }
            else {
                cards[j].checked == false;
            }
        }
    }

    var connected = document.getElementById('connected');
    clientHost = host;
    connected.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        if (clientHost == nick) {
            if (nick == data[i]) {
                connected.innerHTML += '<p class="localclient"><strong>' + data[i] + '</strong></p>';
            }
            else {
                connected.innerHTML += '<p class="client"><strong>' + data[i] + '</strong><button onclick=wypierdol(' + i + ')>Kick</button><button onclick="promote(' + i + ')">Promote</button></p>';
            }
        }
        else {
            if (nick == data[i]) {
                connected.innerHTML += '<p class="localclient"><strong>' + data[i] + '</strong></p>';
            }
            else {
                connected.innerHTML += '<p class="client"><strong>' + data[i] + '</strong>';
            }
        }
    }
    document.getElementById('header').innerHTML = '<h2>Lobby host: ' + host + '</h2>';
    var options = document.getElementById("options");
    var nodes = options.getElementsByTagName('*');
    if (clientHost == nick) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = false;
        }
        options.style.display = "block";
        document.getElementById("start").disabled = false;
    }
    else {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = true;
        }
        document.getElementById("start").disabled = true;
        options.style.display = "none";
    }
});

socket.on('start', function () {
    window.location.href = '/game';
});

function start() {

    socket.emit('start');
}

function enterChatSend(e) {
    if (e.keyCode == 13) {
        chatSend();
    }
}

function changeMaxCount()
{
    document.getElementById("cardsNeeded").innerHTML = cardCount + "/" + (parseInt(document.getElementById("maxPlayers").value) + 3);
}

function changeCount(i) {
    if (i) {
        cardCount++;
    }
    else {
        cardCount--;
    }
    document.getElementById("cardsNeeded").innerHTML = cardCount + "/" + (parseInt(document.getElementById("maxPlayers").value) + 3);
}

function wypierdol(i) {
    socket.emit('Kick', i);
}

socket.on('Kicked', function (data) {
    if (nick == data) {
        alert("Zostałeś wyrzucony z pokoju");
        window.location.href = "http://www.google.com";
    }
});

function promote(i) {
    socket.emit('Promote', i);
}

function sendOptions() {
    var maxPlayers = document.getElementById("maxPlayers").value;
    var monstersCheck = [];
    var monsters = document.getElementsByClassName("monster");
    var playedCards = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].checked == true) {
            playedCards.push(cards[i].value);
        }
    };
    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].checked == true) {
            monstersCheck.push(monsters[i].value);
        }
    };
    var data = { lobbyLimit: maxPlayers, cards: playedCards };
    if (monstersCheck.length > 0) {
        var cardNumber = parseInt(maxPlayers) + 3;
        if (playedCards.length == cardNumber) {
            socket.emit('Options', data);
        }
        else {
            alert("Zaznaczyłeś nieprawidłową ilość kart");
        }
    }
    else {
        alert("Nie zaznaczyłeś karty potwora");
    }
}

function chatSend() {
    var wschk = (document.getElementById('message').value).trim();
    if (wschk != "") {
        socket.emit('chat', {
            sender: nick,
            message: document.getElementById('message').value,
        });
        document.getElementById('message').value = "";
    }
}

socket.on('AYST', function () {
    socket.emit('AYSTResponse', nick);
})

socket.on('chat', function (data) {
    if (data.sender == nick) {
        document.getElementById('output').innerHTML += '<p style="margin-left: 10px;"><strong class="localclient">' + data.sender + ': </strong>' + data.message + '</p>';
    }
    else {
        document.getElementById('output').innerHTML += '<p style="margin-left: 10px;"><strong class="client">' + data.sender + ': </strong>' + data.message + '</p>';
    }
});
