let express = require('express');
let path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');
let PORT = process.env.port | 5000;
let bodyParser = require('body-parser');
let cors = require('cors');
let Routes = require('./src/Routes/routes');
let User = require('./schemas/users');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

/* mLab mongo connection */
mongoose.connect("mongodb://nigel:scorpionJKD14@ds235711.mlab.com:35711/rightvoice",{ 'useMongoClient': true }, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Database Connected")
    }
})

app.use(Routes);

io.on('connection', function(socket) {
    // Tell clients someone signed in
    socket.on('signedIn', (name) => {
        User.findOneAndUpdate({
            username: name
        }, {
            $set: {
                active: true
            }
        }, function(err, res) {
            if (res) {
                socket.join(name);
                User.find({}, function(err, members) {
                    socket.broadcast.emit('loadMembers', members);
                });
            }
        });
    });

    // Tell clients someone signed out
    socket.on('signedOut', (name) => {
        User.findOneAndUpdate({
            username: name
        }, {
            $set: {
                active: false
            }
        }, function(err, res) {
            if (err) {
                socket.leave(name);
                res.send(err);
            }
            if (res) {
                socket.leave(name);
                User.find({}, function(err, members) {
                    socket.broadcast.emit('loadMembers', members);
                });
            }
        });
    });

    // Send message to logged in user
    socket.on('message', (data) => {
        socket.broadcast.to(data.recipient).emit('messageReceived', {
            message: data.message,
            sender: data.sender
        });
    });

    socket.on('membersList', () => {
        User.find({}, function(err, data) {
            if (err) {
                return;
            }
            socket.emit('loadMembers', data);
        });
    });

    io.on('disconnnnected', function(username) {
        User.findOneAndUpdate({
            username: username
        }, {
            $set: {
                active: false
            }
        }, function(err, res) {
            if (err) {
                socket.leave(username)
            }
            if (res) {
                socket.emit('left', res);
                socket.leave(username);
            }
        });
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})