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
      let keypair = {}
      let ecparam = spawn('openssl', ['ecparam', '-name', 'secp256k1', '-genkey'])
      let ec = spawn('openssl', ['ec', '-pubout'])

      ecparam.stdout.on('data', (data) => {
        keypair.prv = data.toString('ascii')
        ec.stdin.write(data)
      })

      ec.stdout.on('data', (data) => {
        keypair.pub = data.toString('ascii')
      })

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
    Object.assign(this, data)
  }

}

/**
 * Export
 */
module.exports = ECKeyPair
