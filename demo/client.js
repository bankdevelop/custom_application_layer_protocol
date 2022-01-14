'use strict';

const net = require('net');
const Networker = require('../network/Networker');
const sleep = require('../util/tools').sleep;
var handshakingToken = '17c7c941917b90253097746b96ec2197:f2933e072d71b1258a8883f0cc329d3a';
var verifyToken = '17c7c941917b90253097746b96ec2197:fec18b6e5f56c8f5b971fbdbef13b012eb5394bf';
const saveSymmetricKey = require('../util/symmetric_encrypted').generateKey();
const symmetricEncrypt = require('../util/symmetric_encrypted');
var messages = null;

let socket = net.createConnection({ port: 8000, host: 'localhost' });
socket.on('connect', async () => {
  let networker = new Networker(socket, (data) => {
    console.log(data.toString());
    console.log('\n-----------------------------\n')
  });
  networker.init();
  networker.send(`METHOD: CONNECTION`);
  await sleep(500);
  networker.send(
    `METHOD: INSERT\n`+
    'TOKEN: '+ handshakingToken
    );
  await sleep(500);
  networker.send(
    `METHOD: MESSAGES\n` +
    `TOKEN: ` + verifyToken
    );
   await sleep(3000);
   console.log(symmetricEncrypt.decrypt(saveSymmetricKey, 'b0a78d718d47b49120af107c33d0e6b8:b35a042cc1a24d5d8576b083c1da163ccf89d319e4765df8713ba532c3ad2270d35d3fec8e143850fec2ed6040213661'))  
});


async function getVerifyToken(networker){
    verifyToken = null;
    let i=0;

    while(verifyToken == null){
        networker.send(
            `METHOD: INSERT\n`+
            'TOKEN: '+ handshakingToken
        );

        await sleep(1000);
        i++;

        //timeout: use too much time to get verifyToken
        if (i>10) 
            return null;
    }

    return verifyToken;
}

async function Messages(networker){
    messages = null;
    let i=0;

    while(messages == null){
        networker.send(
            `METHOD: MESSAGES\n` +
            `TOKEN: ` + verifyToken
        );

        await sleep(1000);
        i++;

        //timeout: use too much time to get verifyToken
        if (i>10) 
            return null;
    }

    return messages;
}