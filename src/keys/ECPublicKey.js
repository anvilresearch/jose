'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JWK} = require('../jose')

/**
 * ECPublicKey
 *
 * @class
 * ECPublicKey represents an Elliptic Curve public key as a JWK.
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

  /**
   * From PEM
   */
  static fromPEM (pem) {
    return new ECPublicKey()
  }
}

/**
 * Export
 */
module.exports = ECPublicKey
