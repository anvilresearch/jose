'use strict'

/**
 * Dependencies
 * @ignore
 */
const BaseRequest = require('./BaseRequest')

/**
 * DynamicRegistrationRequest
 */
class DynamicRegistrationRequest extends BaseRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
  }
}

/**
 * Export
 */
module.exports = DynamicRegistrationRequest


