'use strict';

const net = require('net');
const uuid = require('uuid');
const Networker = require('./network/Networker');

let rooms = {};
let clients = [];
let server = net.createServer();

server.on('connection', (socket) => {
  console.log('new client arrived');
  socket.id = uuid.v4();

  let networker = new Networker(socket, (data) => {
    console.log('received:', data.toString());
  });
  networker.init();
  clients.push({ socket, networker });
  networker.send('Greetings traveller!');

  socket.on('end', () => {
    console.log('socket end');
  });
  socket.on('close', () => {
    console.log('socket close');
  });
  socket.on('error', (e) => {
    console.log(e);
    networker.send('STATUS:3')
  });
});

server.on('error', (e) => {
  console.log(e);
});

server.listen(8000);
