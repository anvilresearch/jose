'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JWK} = require('../jose')

/**
 * RSAPublicKey
 *
 * @class
 * RSAPublicKey represents an RSA public key as a JWK.
 */
class RSAPublicKey extends JWK {

  /**
   * Schema
   */
  static get schema () {
    return {
      properties: {

        n: {
          type: 'string',
          format: 'Base64urlUInt',
          required: true
        },

        e: {
          type: 'string',
          format: 'Base64urlUInt',
          required: true
        }

      }
    }
  }

  /**
   * From PEM
   */
  static fromPEM (pem) {
    return new RSAPublicKey()
  }
}

/**
 * Export
 */
module.exports = RSAPublicKey
