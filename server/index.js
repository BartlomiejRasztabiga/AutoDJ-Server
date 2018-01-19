var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const SpotifyWebHelper = require('spotify-web-helper');
const helper = SpotifyWebHelper();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('a user connected ');

    socket.on('vote message', function (msg) {
        console.log('vote: ' + msg);
        helper.player.play(msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

helper.player.on('error', function (err) {
    if (err.message.match(/No user logged in/)) {
        // also fires when Spotify client quits
    } else {
        // other errors: /Cannot start Spotify/ and /Spotify is not installed/
    }
});