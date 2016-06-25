'use strict'

/**
 * Dependencies
 */
const EncryptedJWK = require('./EncryptedJWK')

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
}

/**
 * Export
 */
module.exports = RSAPrivateKey
