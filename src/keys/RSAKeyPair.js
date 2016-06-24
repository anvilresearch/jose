'use strict'

/**
 * Dependencies
 */
const {spawn} = require('child_process')
const KeyPair = require('./KeyPair')

/**
 * RSAKeyPair
 */
class RSAKeyPair extends KeyPair {

  /**
   * Generate
   */
  static generate (bitlength = 4096) {
    return new Promise((resolve, reject) => {
      let keypair = {}
      let genrsa = spawn('openssl', ['genrsa', bitlength])
      let rsa = spawn('openssl', ['rsa', '-pubout'])

      // store private key pem on the keypair
      // and pipe stdout to the public key process
      genrsa.stdout.on('data', (data) => {
        keypair.prv = data.toString('ascii')
        rsa.stdin.write(data)
      })

      // store public key pem on the keypair
      rsa.stdout.on('data', (data) => {
        keypair.pub = data.toString('ascii')
      })

      // cast the keypair to RSAKeyPair
      // and resolve the promise
      rsa.on('close', (code) => {
        resolve(new RSAKeyPair(keypair))
      })
    })
  }

  /**
   * Constructor
   */
  constructor (data) {
    super(data)
    Object.assign(this, data)
  }
}

/**
 * Export
 */
module.exports = RSAKeyPair
