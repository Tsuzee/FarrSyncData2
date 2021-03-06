const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
};

const app = http.createServer(handler);
app.listen(port);

const io = socketio(app);

const onJoined = (sock) => {
  const socket = sock;

  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('updated', data);
  });
};

io.on('connection', (socket) => {
  socket.join('room1');

  onJoined(socket);

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`Listening on 127.0.0.1: ${port}`);
