'use strict';

const net = require('net');
const uuid = require('uuid');
const Networker = require('../network/Networker');
const handler = require('../util/request_handler');
const sleep = require('../util/tools').sleep;
const saveSymmetricKey = require('../util/symmetric_encrypted').generateKey();

let saveHandshakingToken = null;
let saveVerifyToken = null;

let clients = [];
let server = net.createServer();
let secretKey = getRandomSecretKey();
let message = ['Important messages 1!!!', 'Important messages 2!!!'];

server.on('connection', async (socket) => {
  console.log('new client arrived');
  socket.id = uuid.v4();

  let networker = new Networker(socket, (data) => {
    console.log(data.toString());
    console.log('\n-----------------------------\n')
  });

  networker.init();
  clients.push({ socket, networker });

  await sleep(1000);
  networker.send(handleMethodConnection(secretKey));
  await sleep(500);
  networker.send(handleMethodInsert(secretKey, saveHandshakingToken, ''));
  await sleep(500);
  networker.send(handleMethodMessage(secretKey, saveVerifyToken, message));
    
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

function getRandomSecretKey(){
    return 'thisIsSecretKey1237gztjn7c2x7GfJ'; 
}

const publicEncrypt = require('../util/public_encrypted');
const symmetricEncrypt = require('../util/symmetric_encrypted');

function handleMethodConnection(secretKey){
  let publicPrivateKey = publicEncrypt.generate();
  let handshakingToken = symmetricEncrypt.encrypt(secretKey, publicPrivateKey[1].toString());
  saveHandshakingToken = handshakingToken;
  return 'STATUS: 1\n'+ 
         'METHOD: CONNECTION\n'+ 
         'TOKEN: ' + handshakingToken + '\n' +
         'PUBLIC_KEY: ' + publicPrivateKey[0];
}

function handleMethodInsert(secretKey, token, publicKeyEncryptText){
  let privateKey = symmetricEncrypt.decrypt(secretKey, token);
  //let symmetricKey = publicEncrypt.decrypt(privateKey, publicKeyEncryptText);
  let verifyToken = symmetricEncrypt.encrypt(secretKey, saveSymmetricKey);

  saveVerifyToken = verifyToken;

  return 'STATUS: 1\n'+ 
         'METHOD: INSERT\n'+ 
         'TOKEN: ' + verifyToken;
}

function handleMethodMessage(secretKey, token, messages){
  let symmetricKey = symmetricEncrypt.decrypt(secretKey, token);
  let encyptedMsg = symmetricEncrypt.encrypt(symmetricKey, messages.toString().replace(',', '\n'));

  return 'STATUS: 1\n'+
         'METHOD: MESSAGE\n'+ 
         'BODY: ' + encyptedMsg;
}