'use strict';

const net = require('net');
const Networker = require('./network/Networker');
var handshakingToken = null;
var verifyToken = null;
var messages = null;

let socket = net.createConnection({ port: 8000, host: 'localhost' });
socket.on('connect', () => {
  let networker = new Networker(socket, (data) => {
    console.log('received:', data.toString());
  });
  networker.init();
  getHandshaking(networker);
});

async function getHandshaking(networker){
    handshakingToken = null;
    let i=0;

    while(handshakingToken == null){
        networker.send(
            `METHOD: CONNECTION`
        );

        await sleep(1000);
        i++;

        //timeout: use too much time to get handshakingToken
        if (i>10) 
            return null;
    }

    return handshakingToken;
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}