'use strict'

/**
 * Dependencies
 */
const EncryptedJWK = require('./EncryptedJWK')

/**
 * RSAPrivateKey
 */
class RSAPrivateKey extends EncryptedJWK {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {
        d: { type: 'string' },
        p: { type: 'string' },
        q: { type: 'string' },
        dp: { type: 'string' },
        dq: { type: 'string' },
        qi: { type: 'string' },
        oth: { type: 'string' },
      }
    }
  }
}

/**
 * Export
 */
module.exports = RSAPrivateKey
