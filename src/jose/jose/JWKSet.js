'use strict'

/**
 * Dependencies
 */
const {JSONSchema,JSONDocument} = require('json-document')

/**
 * JWKSet Schema
 */
const schema = new JSONSchema({
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
})

/**
 * JWKSet
 *
 * @class
 * JWKSet represents a JSON Web Key Set as described in Section 5 of RFC 7517:
 * https://tools.ietf.org/html/rfc7517#section-5
 */
class JWKSet extends JSONDocument {

  /**
   * Schema
   */
  static get schema () {
    return schema
  }
}

/**
 * Export
 */
module.exports = JWKSet
