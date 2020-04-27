const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(app);

const io = require('socket.io')(http);


io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join-or-create-room', (roomName) => {
    socket.join(roomName);
  });

  socket.on('clap', (clap) => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      socket.to(room).emit('got-clap');
    });
  });

});

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/*', (req, res) => res.render('pages/room'))

http
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

