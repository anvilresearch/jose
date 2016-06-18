'use strict'

/**
 * Request Parameter Mapping
 */
const PARAMS = { 'GET': 'query', 'POST': 'body' }

/**
 * Response Mode Mapping
 */
const MODES = { 'query': '?', 'fragment': '#' }

/**
 * AuthenticationRequest
 *
 * Encapsulates all logic for the OpenID Connect /authorize endpoint.
 */
class AuthenticationRequest {

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    let {host} = provider
    let request = new AuthenticationRequest(req, res, provider)

    Promise
      .resolve(request)
      .then(request.validate)
      .then(host.authenticate)
      .then(host.obtainConsent)
      .then(request.authorize)
      .catch(request.internalServerError)
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
    this.params = req[PARAMS[req.method]] || {}
    this.responseTypes = AuthenticationRequest.parseResponseTypes(this.params)
    this.responseMode = AuthenticationRequest.parseResponseMode(this.params)
  }

  /**
   * Parse Response Types
   *
   * @param {Object} params
   * @returns {Array}
   */
  static parseResponseTypes (params) {
    let { response_type: type } = params
    return (typeof type === 'string') ? type.split(' ') : []
  }

  /**
   * Parse Response Mode
   *
   * @param {Object} params
   * @returns {string}
   */
  static parseResponseMode (params) {
    let mode
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
   * Validate Request
   *
   * @param {AuthenticationRequest} request
   * @returns {Promise}
   */
  validate (request) {
    let { params, provider } = request

    // CLIENT ID IS REQUIRED
    if (!params.client_id) {
      return request.forbidden({
        error: 'unauthorized_client',
        error_description: 'Missing client id'
      })
    }

    // REDIRECT URI IS REQUIRED
    if (!params.redirect_uri) {
      return request.badRequest({
        error: 'invalid_request',
        error_description: 'Missing redirect uri',
      })
    }

    // RETURN A PROMISE WHICH WILL BE RESOLVED
    // IF THE REQUEST IS VALID. ALL ERROR CONDITIONS
    // SHOULD BE HANDLED HERE (WITH AN ERROR RESPONSE),
    // SO THERE'S NOTHING TO CATCH.
    return new Promise((resolve, reject) => {
      provider.getClient(params.client_id).then(client => {

        // UNKNOWN CLIENT
        if (!client) {
          return request.unauthorized({
            error: 'unauthorized_client',
            error_description: 'Unknown client'
          })
        }

        // ADD CLIENT TO REQUEST
        request.client = client

        // REDIRECT_URI MUST MATCH
        if (client.redirect_uris.indexOf(params.redirect_uri) === -1) {
          return request.badRequest({
            error: 'invalid_request',
            error_description: 'Mismatching redirect uri'
          })
        }

        // RESPONSE TYPE IS REQUIRED
        if (!params.response_type) {
          return request.redirect({
            error: 'invalid_request',
            error_description: 'Missing response type',
          })
        }

        // SCOPE IS REQUIRED
        if (!params.scope) {
          return request.redirect({
            error: 'invalid_scope',
            error_description: 'Missing scope',
          })
        }

        // OPENID SCOPE IS REQUIRED
        if (params.scope.indexOf('openid') === -1) {
          return request.redirect({
            error: 'invalid_scope',
            error_description: 'Missing openid scope'
          })
        }

        // NONCE MAY BE REQUIRED
        if (!request.requiredNonceProvided()) {
          return request.redirect({
            error: 'invalid_request',
            error_description: 'Missing nonce'
          })
        }

        // RESPONSE TYPE MUST BE SUPPORTED
        // TODO is this something the client can configure too?
        if (!request.supportedResponseType()) {
          return request.redirect({
            error: 'unsupported_response_type',
            error_description: 'Unsupported response type'
          })
        }

        // RESPONSE MODE MUST BE SUPPORTED
        // TODO is this something the client can configure too?
        if (!request.supportedResponseMode()) {
          return request.redirect({
            error: 'unsupported_response_mode',
            error_description: 'Unsupported response mode'
          })
        }

        // VALID REQUEST
        resolve(request)
      })
    })
  }

  /**
   * Supported Response Type
   *
   * @returns {bool}
   */
  supportedResponseType () {
    let {client,params,provider} = this
    let supportedResponseTypes = provider.supported_response_types
    let requestedResponseType = params.response_type

    // TODO
    // verify that the requested response types are permitted
    // by client registration
    //
    // let registeredResponseTypes = client.response_types
    return supportedResponseTypes.indexOf(requestedResponseType) !== -1
  }

  /**
   * Supported Response Mode
   *
   * @returns {bool}
   */
  supportedResponseMode () {
    let {params,provider} = this
    let supportedResponseModes = provider.supported_response_modes
    let requestedResponseMode = params.response_mode

    if (!requestedResponseMode) {
      return true
    } else {
      return supportedResponseModes.indexOf(requestedResponseMode) !== -1
    }
  }

  /**
   * Required Nonce Provided
   *
   * @returns {bool}
   */
  requiredNonceProvided () {
    let {params} = this
    let {nonce, response_type: responseType} = params
    let requiring = ['id_token', 'token']

    if (!nonce && requiring.some(type => responseType.indexOf(type) !== -1)) {
      return false
    } else {
      return true
    }
  }

  /**
   * Authorize
   *
   * @param {AuthenticationRequest} request
   * @returns {Promise}
   */
  authorize (request) {
    let {params} = request

    if (params.authorize === true) {
      request.allow()
    } else {
      request.deny()
    }
  }

  /**
   * Allow
   *
   * Given a completely validated request with an authenticated user and
   * consent, build a response incorporating auth code, tokens, and session
   * state.
   */
  allow () {
    Promise.resolve({}) // initialize empty response
      .then(this.includeAccessToken)
      .then(this.includeAuthorizationCode)
      .then(this.includeIDToken)
      .then(this.includeSessionState)
      .then(this.redirect)
  }

  /**
   * Deny
   *
   * Handle user's rejection of the client.
   */
  deny (request) {
    this.redirect({
      error: 'access_denied'
    })
  }

  /**
   * Include Access Token
   */
  includeAccessToken (response) {
    let {responseTypes} = this

    return new Promise((resolve, reject) => {
      if (responseTypes.indexOf('token') !== -1) {
        AccessToken.issue(this, response).then(resolve).catch(reject)
      } else {
        resolve(response)
      }
    })
  }

  /**
   * Include Authorization Code
   */
  includeAuthorizationCode (response) {
    let {responseTypes} = this

    return new Promise((resolve, reject) => {
      if (responseTypes.indexOf('code') !== -1) {
        AuthorizationCode.issue(this, response).then(resolve).catch(reject)
      } else {
        resolve(response)
      }
    })
  }

  /**
   * Include ID Token
   */
  includeIDToken (response) {
    let {responseTypes} = this

    return new Promise((resolve, reject) => {
      if (responseTypes.indexOf('id_token') !== -1) {
        IDToken.issue(this, response).then(resolve).catch(reject)
      } else {
        resolve(response)
      }
    })
  }

  /**
   * Include Session State
   */
  includeSessionState (response) {
    // ...
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
  forbidden (error) {
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
    res.status(500).send('Internal Server Error')
  }

}

/**
 * Export
 */
module.exports = AuthenticationRequest

