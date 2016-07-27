'use strict'

/**
 * Dependencies
 * @ignore
 */
const EncryptedJWK = require('./EncryptedJWK')

/**
 * ECPrivateKey Schema
 */
const schema = EncryptedJWK.schema.extend({
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
    },

    d: {
      type: 'string',
      //format: 'base64url',
      required: true,
    }
  }
})

/**
 * ECPrivateKey Class
 *
 * @class
 * ECPrivate key represents an Elliptic Curve private key as a JWK, and
 * can serialize/deserialize the key as an Encrypted JWT.
 */
class ECPrivateKey extends EncryptedJWK {

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
    return new ECPrivateKey()
  }
}

/**
 * Export
 */
module.exports = ECPrivateKey
