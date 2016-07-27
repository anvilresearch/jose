'use strict'

/**
 * Dependencies
 * @ignore
 */
const {spawn} = require('child_process')
const KeyPair = require('./KeyPair')
const ECPublicKey = require('./ECPublicKey')
const ECPrivateKey = require('./ECPrivateKey')

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
        keypair.prv = ECPrivateKey.fromPEM(data.toString('ascii'))
        ec.stdin.write(data)
      })

      // store public key pem on the keypair
      ec.stdout.on('data', (data) => {
        keypair.pub = ECPublicKey.fromPEM(data.toString('ascii'))
      })

      // cast the keypair to ECKeyPair
      // and resolve the promise
      ec.on('close', (code) => {
        resolve(new ECKeyPair(keypair))
      })
    })
  }

  /**
   * Constructor
   */
  constructor (data) {
    super(data)

    if (this.type && this.type !== 'EC') {
      throw new Error('ECKeyPair data must have the type "EC"')
    }

    this.type = 'EC'
  }
}

/**
 * Export
 */
module.exports = ECKeyPair
