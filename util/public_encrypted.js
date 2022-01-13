const crypto = require("crypto");

let encrypter = module.exports;

encrypter.generate = function() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });

    return [publicKey, privateKey];
}

encrypter.encrypt = function(key, data) {
    const encryptedData = crypto.publicEncrypt(
        {
          key: key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
      );

    return encryptedData.toString('base64');
}

encrypter.decrypt = function(key, ciphertext) {
    const decryptedData = crypto.privateDecrypt(
        {
          key: key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(ciphertext, "base64")
      );

    return decryptedData.toString();
}

function testKey(){
    const data = "my secret data";

    let key = publicEncrypt.generate();
    const publicKey = key[0];
    const privateKey = key[1];
    const encryptText = publicEncrypt.encrypt(publicKey, data);
    console.log("encypted data: ", encryptText);
    console.log("decrypted data: ", publicEncrypt.decrypt(privateKey, encryptText));  
}