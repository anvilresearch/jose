'use strict'

/**
 * Dependencies
 */
const qs = require('qs')

/**
 * OIDCRequest
 *
 * @class
 * Abstract class for implementing OpenID Connect request handlers.
 */
class OIDCRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    throw new Error('Handle must be implemented by OIDCRequest subclass')
  }

  /**
   * Constructor
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  constructor (req, res, provider) {
    this.req = req
    this.res = res
    this.provider = provider
    this.host = provider.host
  }

  /**
   * 302 Redirect Response
   */
  redirect (data) {
    let { res, params: { redirect_uri: uri }, responseMode } = this
    let response = qs.stringify(data)
    res.redirect(`${uri}${responseMode}${response}`)
  }

  /**
   * 401 Unauthorized Response
   */
  unauthorized (err) {
    let { res } = this
    let { realm, error, error_description: description } = err

    res.set({
      'WWW-Authenticate':
      `Bearer realm=${realm}, error=${error}, error_description=${description}`
    })

    res.status(401).send('Unauthorized')
  }

  /**
   * 403 Forbidden Response
   */
  forbidden () {
    let {res} = this
    res.status(403).send('Forbidden')
  }

  /**
   * 400 Bad Request Response
   */
  badRequest (error) {
    let {res} = this

    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    res.status(400).json(error)
  }

  /**
   * Internal Server Error
   */
  internalServerError (err) {
    // TODO: Debug logging here
    let {res} = this
    res.status(500).send('Internal Server Error')
  }

}

/**
 * Export
 */
module.exports = OIDCRequest

