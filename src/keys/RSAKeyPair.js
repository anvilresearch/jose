'use strict'

/**
 * Dependencies
 * @ignore
 */
//const {spawn} = require('child_process')
const KeyPair = require('./KeyPair')
const RSAPublicKey = require('./RSAPublicKey')
const RSAPrivateKey = require('./RSAPrivateKey')

/**
 * RSAKeyPair
 *
 * @class
 * RSAKeyPair represents an RSA cryptographic keypair in memory.
 * It maintains both PEM and JWK representations.
 */
class RSAKeyPair extends KeyPair {

  /**
   * Generate
   */
  static generate (options) {
    let bitlength = options.bitlength || 4096

    return new Promise((resolve, reject) => {
      //let keypair = { pem: {} }
      //let genrsa = spawn('openssl', ['genrsa', bitlength])
      //let rsa = spawn('openssl', ['rsa', '-pubout'])

      //// store private key pem on the keypair
      //// and pipe stdout to the public key process
      //genrsa.stdout.on('data', (data) => {
      //  keypair.prv = RSAPrivateKey.fromPEM(data.toString('ascii'))
      //  rsa.stdin.write(data)
      //})

      //// store public key pem on the keypair
      //rsa.stdout.on('data', (data) => {
      //  keypair.pub = RSAPublicKey.fromPEM(data.toString('ascii'))
      //})

      //// cast the keypair to RSAKeyPair
      //// and resolve the promise
      //rsa.on('close', (code) => {
      //  resolve(new RSAKeyPair(keypair))
      //})
    })
  }

  /**
   * Constructor
   */
  constructor (data) {
    super(data)

    if (this.type && this.type !== 'RSA') {
      throw new Error('RSAKeyPair data must have the type "RSA"')
    }

    this.type = 'RSA'
  }
}

/**
 * Export
 */
module.exports = RSAKeyPair
