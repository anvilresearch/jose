'use strict'

/**
 * Dependencies
 */
const BaseRequest = require('./BaseRequest')

/**
 * OpenIDConfigurationRequest
 */
class OpenIDConfigurationRequest extends BaseRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    res.json(provider.openidConfiguration)
  }
}

/**
 * Export
 */
module.exports = OpenIDConfigurationRequest


