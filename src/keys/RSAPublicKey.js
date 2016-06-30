'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JWK} = require('../jose')
const {pem2jwk} = require('pem-jwk')

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
   *
   * Take a PEM file and return a JWK for the same key.
   * The JWK instance should have a toPEM() method that
   * returns the original PEM or translates if there is
   * none (in the case it has been deserialized from
   * JSON, etc.
   *
   * @return {RSAPrivateKey} return a new instance
   *
   * @todo When building a jwk from a PEM string, we need to assign
   * kid and other paramters that are not included in PEM encoding
   */
  static fromPEM (pem) {
    try {
      let match = pem.match(PEM_REGEXP)
      if (!match || match[1] !== 'RSA' || match[2] !== 'PUBLIC') {
        throw new Error()
      }

      let jwk = pem2jwk(pem)
      return new RSAPublicKey(jwk, pem)

    } catch (err) {
      let stringified = JSON.stringify(pem)
      stringified = stringified && stringified.length > 16 
        ? stringified.slice(0, 15) + '...' 
        : stringified 

      throw new Error(
        `${stringified} is not a valid PEM encoded RSA Public key`
      )
    }
  }
}

/**
 * Export
 */
module.exports = RSAPublicKey
