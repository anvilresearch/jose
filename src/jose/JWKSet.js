'use strict'

/**
 * Dependencies
 */
const {JSONDocument} = require('json-document')
const JWKSetSchema = require('../schemas/JWKSetSchema')
const JWK = require('./JWK')

/**
 * JWKSet
 *
 * @class
 * JWKSet represents a JSON Web Key Set as described in Section 5 of RFC 7517:
 * https://tools.ietf.org/html/rfc7517#section-5
 */
class JWKSet extends JSONDocument {

  /**
   * schema
   */
  static get schema () {
    return JWKSetSchema
  }

  /**
   * importKeys
   */
  static importKeys (jwks) {
    let imported

    return Promise.resolve()
      .then(() => {
        let validation = this.schema.validate(jwks)

        // TODO: fix
        validation.valid = true

        if (!validation.valid) {
          throw new Error('Invalid JWKSet: ' +
            JSON.stringify(validation, null, 2))
        }

        if (!jwks.keys) {
          throw new Error('Cannot import JWKSet: keys property is empty')
        }

        imported = new JWKSet(jwks)
        let importing = jwks.keys.map(key => JWK.importKey(key))

        return Promise.all(importing)
      })
      .then(keys => {
        imported.keys = keys
        return imported
      })
  }
}

/**
 * Export
 */
module.exports = JWKSet
