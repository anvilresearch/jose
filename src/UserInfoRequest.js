'use strict'

/**
 * Dependencies
 */
const OIDCRequest = require('./OIDCRequest')

/**
 * UserInfoRequest
 */
class UserInfoRequest extends OIDCRequest {

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
module.exports = UserInfoRequest


