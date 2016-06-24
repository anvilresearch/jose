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

        crv: {
          type: 'string',
          required: true,
          enum: [
            'P-256',
            'P-384',
            'P-521'
          ],
        },

        x: {
          type: 'string',
          format: 'base64url',
          required: true,
        },

        y: {
          type: 'string',
          format: 'base64url',
          required: true,
        },

        d: {
          type: 'string',
          format: 'base64url',
          required: true,
        }

      }
    }
  }
}

/**
 * Export
 */
module.exports = ECPrivateKey
