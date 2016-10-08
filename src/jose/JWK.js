'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JSONDocument} = require('json-document')
const JWKSchema = require('../schemas/JWKSchema')
const JWA = require('./JWA')

/**
 * JWK Class
 */
class JWK extends JSONDocument {

  /**
   * Schema
   */
  static get schema () {
    return JWKSchema
  }

  /**
   * importKey
   *
   * TODO:
   * - should this be on JWA?
   */
  static importKey (jwk) {
    return JWA.importKey(jwk)
  }


}

/**
 * Export
 */
module.exports = JWK
