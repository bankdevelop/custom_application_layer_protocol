const publicEncrypt = require('./public_encrypted');
const symmetricEncrypt = require('./symmetric_encrypted');

let handler = module.exports;

handler.extractHeader() = (secretKey, data) => {
    let lines = data.split('\n');
    let method = lines[0].trim().split(':')[1].trim.toLowerCase();
    if (method === 'connection'){
        return handleMethodConnection(secretKey);
    } else if (method === 'insert'){
        return handleMethodInsert(secretKey, lines[1].trim, lines[2].trim)
    } else if (method === 'message'){
        return handleMethodMessage(secretKey, lines[1].trim, ['Important messages 1!!!', 'Important messages 2!!!'])
    }
}

function handleMethodConnection(secretKey){
    let publicPrivateKey = publicEncrypt.generate();
    let handshakingToken = symmetricEncrypt.encrypt(secretKey, publicPrivateKey[1]);
    return 'STATUS: 1\n'+ 
           'TOKEN: ' + handshakingToken + '\n' +
           'PUBLIC_KEY: ' + publicPrivateKey[0];
}

function handleMethodInsert(secretKey, token, publicKeyEncryptText){
    let privateKey = symmetricEncrypt.decrypt(secretKey, token);
    let symmetricKey = publicEncrypt.decrypt(privateKey, publicKeyEncryptText);
    let verifyToken = symmetricEncrypt.encrypt(secretKey, symmetricKey);

    return 'STATUS: 1\n'+ 
           'TOKEN: ' + verifyToken;
}

function handleMethodMessage(secretKey, token, messages){
    let symmetricKey = symmetricEncrypt.decrypt(secretKey, token);
    let encyptedMsg = symmetricEncrypt.encrypt(symmetricKey, messages.toString().replace(',', '\n'));

    return 'STATUS: 1\n'+
           'BODY: ' + encyptedMsg;
}