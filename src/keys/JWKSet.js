'use strict'

/**
 * Dependencies
 */

/**
 * JWKSet
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
