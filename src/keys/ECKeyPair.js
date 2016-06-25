'use strict'

/**
 * Dependencies
 * @ignore
 */
const {spawn} = require('child_process')
const KeyPair = require('./KeyPair')

/**
 * ECKeyPair
 *
 * @class
 * ECKeyPair represents an Elliptic Curve cryptographic keypair in memory.
 * It maintains both PEM and JWK representations.
 */
class ECKeyPair extends KeyPair {

  /**
   * Generate
   */
  static generate () {
    return new Promise((resolve, reject) => {
      let keypair = { pem: {} }
      let ecparam = spawn('openssl', ['ecparam', '-name', 'secp256k1', '-genkey'])
      let ec = spawn('openssl', ['ec', '-pubout'])

      // store private key pem on the keypair
      // and pipe stdout to the public key process
      ecparam.stdout.on('data', (data) => {
        keypair.pem.prv = data.toString('ascii')
        ec.stdin.write(data)
      })

      // store public key pem on the keypair
      ec.stdout.on('data', (data) => {
        keypair.pem.pub = data.toString('ascii')
      })

      // cast the keypair to ECKeyPair
      // and resolve the promise
      ec.on('close', (code) => {
        resolve(new ECKeyPair(keypair))
      })
    })
  }

  /**
   * Type
   */
  get type () {
    return 'EC'
  }
}

/**
 * Export
 */
module.exports = ECKeyPair
