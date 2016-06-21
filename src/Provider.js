'use strict'

/**
 * Dependencies
 */
const cwd = process.cwd()
const path = require('path')

const providerSchema = require(path.join(cwd, 'src', 'schemas', 'ProviderSchema'))
const AuthenticationRequest = require(path.join(cwd, 'src', 'handlers', 'AuthenticationRequest'))
const DiscoveryRequest = require(path.join(cwd, 'src', 'handlers', 'DiscoveryRequest'))
const DynamicRegistrationRequest = require(path.join(cwd, 'src', 'handlers', 'DynamicRegistrationRequest'))
const JWKSetRequest = require(path.join(cwd, 'src', 'handlers', 'JWKSetRequest'))
const TokenRequest = require(path.join(cwd, 'src', 'handlers', 'TokenRequest'))
const UserInfoRequest = require(path.join(cwd, 'src', 'handlers', 'UserInfoRequest'))

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
    JWKSetRequest.handle(req, res, this)
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
