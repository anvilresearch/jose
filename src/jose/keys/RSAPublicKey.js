'use strict'

/**
 * Dependencies
 * @ignore
 */
const PEM = require('./PEM')
const {JWK} = require('..')

/**
 * Symbols
 * @ignore
 */
const CACHED_PEM = Symbol()

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
   * Constructor
   */
  constructor (jwk, pem) {
    super(jwk)
    Object.assign(this, jwk)
    this[CACHED_PEM] = pem
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
   * @return {RSAPublicKey} return a new instance
   *
   * @todo When building a jwk from a PEM string, we need to assign
   * kid and other paramters that are not included in PEM encoding
   */
  static fromPEM (pem) {
    try {
      if (!PEM.isPEM(pem, 'RSA', 'PUBLIC')) {
        throw new Error()
      }

      let jwk = PEM.toJWK(pem)
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

  /**
   * To PEM
   *
   * @description
   * If there is no already cached result, translate the
   * JWK into PEM format and store the result on the instance.
   *
   * @return {string} PEM
   */
  toPEM () {
    let pem = this[CACHED_PEM]

    if (pem) {
      return pem
    } else {
      return this[CACHED_PEM] = PEM.fromJWK(this)
    }
  }
}

/**
 * Export
 */
module.exports = RSAPublicKey
