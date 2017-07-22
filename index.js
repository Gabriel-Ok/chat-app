var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);
var path = require('path');
var usernames = [];
connections = [];



server.listen(process.env.PORT || 5000, function () {
   console.log("listenning on port", 5000);

});

app.use(express.static(path.join(__dirname, '/public')));



app.get('/', function (req, res) {

   res.sendFile(__dirname + '/public/index.html');
   // console.log("hello");

});

io.sockets.on('connection', function(socket){
   connections.push(socket);
  console.log( '%s users connected', connections.length);






     socket.on('new user', function (data, callback) {

        if (usernames.indexOf(data)!= -1) {
           callback(false);

        } else {
           callback(true);
           socket.username = data;

           usernames.push(socket.username);


           updateUsername();

        }




     });

     function updateUsername() {
        io.sockets.emit('usernames', usernames);


     }

     socket.on('send message', function (data) {

        io.sockets.emit('new message', {msg: data, user: socket.username});



  });

  // disconnect

  socket.on('disconnect',function (data) {
     if (!socket.usename) {
        return;

     }
     usernames.splice(usertnames.indexOf(socket.username),1);
     updateUsername();
  });


});
