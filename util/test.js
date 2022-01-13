const publicEncrypt = require('./public_encrypted');
const data = "my secret data";

let key = publicEncrypt.generate();
const publicKey = key[0];
const privateKey = key[1];
const encryptText = publicEncrypt.encrypt(publicKey, data);
console.log("encypted data: ", encryptText);
console.log("decrypted data: ", publicEncrypt.decrypt(privateKey, encryptText));  