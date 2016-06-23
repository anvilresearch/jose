'use strict'

/**
 * Dependencies
 */
const EncryptedJWK = require('./EncryptedJWK')

/**
 * ECPrivateKey
 */
class ECPrivateKey extends EncryptedJWK {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {
        d: { type: 'string' }
      }
    }
  }
}

/**
 * Export
 */
module.exports = ECPrivateKey
