'use strict'

/**
 * Dependencies
 */
const JWK = require('./JWK')

/**
 * ECPublicKey
 */
class ECPublicKey extends JWK {

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
        }

      }
    }
  }
}

/**
 * Export
 */
module.exports = ECPublicKey
