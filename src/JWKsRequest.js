'use strict'

/**
 * Dependencies
 */
const BaseRequest = require('./BaseRequest')

/**
 * JWKsRequest
 */
class JWKsRequest extends BaseRequest {

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


