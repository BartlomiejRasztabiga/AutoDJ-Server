var cors = require('cors');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var client_id = '47f899fb8664419689f4130816c42aaa';
var client_secret = '421a970c39a64c249009c529e8ba3a0a';

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

app.use(cors())

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/token', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            // use the access token to access the Spotify Web API
            var token = body.access_token;
            res.send(JSON.stringify({
                access_token: token
            }))
        }
    });

});

http.listen(5280, function () {
    console.log('listening on *:5280');
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
