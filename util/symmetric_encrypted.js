var assert = require('assert');
var crypto = require('crypto');

var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';
var ivlength = 16  // AES blocksize
var iv = crypto.randomBytes(ivlength);

let symmetric = module.exports;

symmetric.generateKey = function(){
    // return constant key but deployment must random key.
    return 'ciw7p02f70000ysjon7gztjn7c2x7GfJ';
}

symmetric.encrypt = function(key, text){
    key = convertToBuffer(key)
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var ciphered = cipher.update(text, inputEncoding, outputEncoding);
    ciphered += cipher.final(outputEncoding);
    var ciphertext = iv.toString(outputEncoding) + ':' + ciphered

    return ciphertext;
}

symmetric.decrypt = function(key, ciphertext){
    key = convertToBuffer(key)
    var components = ciphertext.split(':');
    var iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
    var decipher = crypto.createDecipheriv(algorithm, key, iv_from_ciphertext);
    var deciphered = decipher.update(components.join(':'), outputEncoding, inputEncoding);
    deciphered += decipher.final(inputEncoding);

    return deciphered;
}

function convertToBuffer(textKey){
    return Buffer.from(textKey, 'latin1');
}

function test(){
    var text = 'WOW ZA';
    var key = Buffer.from('ciw8p02f78888ysjon7gztjn7c2x7GfJ', 'latin1'); // key must be 32 bytes for aes256

    console.log('Ciphering "%s" with key "%s" using %s', text, key, algorithm);

    var encryptText = symmetric.encrypt(key, text);
    var decryptText = symmetric.decrypt(key, encryptText);

    console.log('Result in %s is "%s"', outputEncoding, encryptText);
    console.log(encryptText);
    assert.equal(decryptText, text, 'Deciphered text does not match!');
}