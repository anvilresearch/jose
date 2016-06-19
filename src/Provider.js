'use strict'

/**
 * Dependencies
 */
const providerSchema = require('./ProviderSchema')
const AuthenticationRequest = require('./AuthenticationRequest')
const DiscoveryRequest = require('./DiscoveryRequest')
const DynamicRegistrationRequest = require('./DynamicRegistrationRequest')
const JWKsRequest = require('./JWKsRequest')
const TokenRequest = require('./TokenRequest')
const UserInfoRequest = require('./UserInfoRequest')

/**
 * OpenID Connect Provider
 */
class Provider {

  /**
   * Schema
   *
   * @returns {JSONSchema}
   */
  static get schema () {
    return providerSchema
  }

  /**
   * Constructor
   *
   * @param {Object} host
   * @param {Object} configuration
   * @param {Object} options
   */
  constructor (host, configuration = {}, options = {}) {
    this.host = host
    //this.initialize(this, configuration, options)
  }

  /**
   * Initialize
   *
   * @param {Object} data
   * @param {Object} options
   */
  intialize (data = {}, options = {}) {
    let {constructor: {schema}} = this
    schema.initialize(this, data, options)
  }

  /**
   * Validate
   *
   * @returns {Object}
   */
  validate () {
    let {constructor: {schema}} = this
    return schema.validate(this)
  }

  /**
   * Authorize
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  authorize (req, res) {
    AuthenticationRequest.handle(req, res, this)
  }

  /**
   * Discover
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  discover (req, res) {
    DiscoveryRequest.handle(req, res, this)
  }

  /**
   * JWKs
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  jwks (req, res) {
    JWKsRequest.handle(req, res, this)
  }

  /**
   * Register
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  register (req, res) {
    DynamicRegistrationRequest.handle(req, res, this)
  }

  /**
   * Token
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  token (req, res) {
    TokenRequest.handle(req, res, this)
  }

  /**
   * UserInfo
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   */
  userinfo (req, res) {
    UserInfoRequest.handle(req, res, this)
  }
}

/**
 * Export
 */
module.exports = Provider
