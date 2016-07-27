'use strict'

/**
 * Dependencies
 * @ignore
 */
const JWK = require('../jose/JWK')

/**
 * ECPublicKey Schema
 */
const schema = JWK.schema.extend({
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
      //format: 'base64url',
      required: true,
    },

    y: {
      type: 'string',
      //format: 'base64url',
      required: true,
    }
  }
})

/**
 * ECPublicKey Class
 *
 * @class
 * ECPublicKey represents an Elliptic Curve public key as a JWK.
 */
class ECPublicKey extends JWK {

  /**
   * Schema
   */
  static get schema () {
    return schema
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
