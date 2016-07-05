'use strict'

/**
 * Dependencies
 */

/**
 * JWKSet
 *
 * @class
 * JWKSet represents a JSON Web Key Set as described in Section 5 of RFC 7517:
 * https://tools.ietf.org/html/rfc7517#section-5
 */
class JWKSet {

  /**
   * Schema
   */
  static get schema () {
    return {
      type: 'object',
      properties: {
        keys: {
          type: 'array',
          items: {
            anyOf: [ // schemas?
              'RSAPublicKey',
              'RSAPrivateKey',
              'EllipticCurvePublicKey',
              'EllipticCurvePrivateKey'
            ]
          }
        }
      }
    }
  }
}

/**
 * Export
 */
module.exports = JWKSet
