'use strict'

/**
 * Dependencies
 */
const JWK = require('./JWK')

/**
 * RSAPublicKey
 */
class RSAPublicKey extends JWK {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {
        n: { type: 'string' },
        e: { type: 'string' }
      }
    }
  }
}

/**
 * Export
 */
module.exports = RSAPublicKey
