exports = module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected!');

    socket.on('chat', (data) => {
      io.sockets.emit('chat', data);
    });
  });
};
