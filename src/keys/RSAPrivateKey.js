'use strict'

/**
 * Dependencies
 * @ignore
 */
const EncryptedJWK = require('./EncryptedJWK')
const {pem2jwk, jwk2pem} = require('pem-jwk')

/**
 * Symbols
 * @ignore
 */
const PEM = Symbol()

/**
 * RSAPrivateKey
 *
 * @class
 * RSAPrivate key represents an RSA private key as a JWK, and
 * can serialize/deserialize the key as an Encrypted JWT.
 */
class RSAPrivateKey extends EncryptedJWK {

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
        },

        d: {
          type: 'string',
          format: 'Base64urlUInt',
          required: true
        },

        // TODO
        // - if the produce includes any of the other private key
        //   parameters, then all of the others MUST be present,
        //   with the exception of "oth", which MUST only be present
        //   when more than two prime factors were used.
        p: {
          type: 'string',
          format: 'Base64urlUInt'
        },

        q: {
          type: 'string',
          format: 'Base64urlUInt'
        },

        dp: {
          type: 'string',
          format: 'Base64urlUInt'
        },

        dq: {
          type: 'string',
          format: 'Base64urlUInt'
        },

        qi: {
          type: 'string',
          format: 'Base64urlUInt'
        },

        // TODO
        // - When only two primes have been used, (the normal case), this
        //   parameter MUST be omitted
        // - When three or more primes have been used, the number of array
        //   elements MUST be the number of primes used minus two.
        oth: {
          type: 'array',
          items: [
            {
              type: 'object',
              properties: {
                r: {
                  type: 'string',
                  format: 'Base64urlUInt',
                  required: true
                },
                d: {
                  type: 'string',
                  format: 'Base64urlUInt',
                  required: true
                },
                t: {
                  type: 'string',
                  format: 'Base64urlUInt',
                  required: true
                }
              }
            }
          ]
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
      if (!match || match[0] !== 'RSA' || match[1] !== 'PRIVATE') {
        throw new Error()
      }

      let jwk = pem2jwk(pem)
      return new RSAPrivateKey(jwk, pem)

    } catch (err) {
      throw new Error(
        `${JSON.stringify(pem)} is not a valid PEM encoded RSA Private key`
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
    let pem = this[PEM]
    if (pem) {
      return pem
    } else {
      return this[PEM] = jwk2pem(this)
    }
  }
}

/**
 * Export
 */
module.exports = RSAPrivateKey
