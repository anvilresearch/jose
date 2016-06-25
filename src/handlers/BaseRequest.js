'use strict'

/**
 * Dependencies
 * @ignore
 */
const qs = require('qs')

/**
 * Request Parameter Mapping
 */
const PARAMS = { 'GET': 'query', 'POST': 'body' }

/**
 * Response Mode Mapping
 */
const MODES = { 'query': '?', 'fragment': '#' }

/**
 * BaseRequest
 *
 * @class
 * Abstract class for implementing OpenID Connect request handlers.
 */
class BaseRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    throw new Error('Handle must be implemented by BaseRequest subclass')
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
   * Get Params
   *
   * @param {BaseRequest} request
   * @returns {Object}
   */
  static getParams (request) {
    let {req,res,provider} = request
    return req[PARAMS[req.method]] || {}
  }

  /**
   * Get Response Types
   *
   * @param {BaseRequest} request
   * @returns {Array}
   */
  static getResponseTypes (request) {
    let { params: { response_type: type } } = request
    return (typeof type === 'string') ? type.split(' ') : []
  }

  /**
   * Get Response Mode
   *
   * @param {BaseRequest} request
   * @returns {string}
   */
  static getResponseMode (request) {
    let mode
    let { params } = request || {}
    let { response_mode: responseMode, response_type: responseType } = params

    if (responseMode) {
      mode = MODES[responseMode]
    } else if (responseType === 'code' || responseType === 'none') {
      mode = '?'
    } else {
      mode = '#'
    }

    return mode
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
module.exports = BaseRequest

