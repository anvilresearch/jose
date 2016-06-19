'use strict'

/**
 * Dependencies
 */
const OIDCRequest = require('./OIDCRequest')

/**
 * JWKsRequest
 */
class JWKsRequest extends OIDCRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    res.json(provider.jwkSet)
  }
}

/**
 * Export
 */
module.exports = JWKsRequest


