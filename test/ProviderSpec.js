'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

/**
 * Assertions
 */
chai.use(sinonChai)
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const Provider = require(path.join(cwd, 'src', 'Provider'))
const ProviderSchema = require(path.join(cwd, 'src', 'schemas', 'ProviderSchema'))
const AuthenticationRequest = require(path.join(cwd, 'src', 'handlers', 'AuthenticationRequest'))
const DiscoveryRequest = require(path.join(cwd, 'src', 'handlers', 'DiscoveryRequest'))
const DynamicRegistrationRequest = require(path.join(cwd, 'src', 'handlers', 'DynamicRegistrationRequest'))
const JWKSetRequest = require(path.join(cwd, 'src', 'handlers', 'JWKSetRequest'))
const TokenRequest = require(path.join(cwd, 'src', 'handlers', 'TokenRequest'))
const UserInfoRequest = require(path.join(cwd, 'src', 'handlers', 'UserInfoRequest'))

/**
 * Tests
 */
describe('OpenID Connect Provider', () => {

  /**
   * Schema
   */
  describe('schema', () => {
    it('should reference the OpenID Connect Provider Schema', () => {
      Provider.schema.should.equal(ProviderSchema)
    })

    it('should be an instance of JSONSchema')
  })

  /**
   * Constructor
   */
  describe('constructor', () => {
    it('should set the host')
    it('should call initialize on the instance')
  })

  /**
   * Initialize
   */
  describe('initialize', () => {
    it('should initialize based on the defined schema')
  })

  /**
   * Validate
   */
  describe('validate', () => {
    it('should initialize based on the defined schema')
  })

  /**
   * Authorize
   */
  describe('authorize endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(AuthenticationRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.authorize(req, res, provider)
    })

    after(() => {
      AuthenticationRequest.handle.restore()
    })

    it('should invoke the AuthenticationRequest handler', () => {
      AuthenticationRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })

  /**
   * Discover
   */
  describe('discover endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(DiscoveryRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.discover(req, res, provider)
    })

    after(() => {
      DiscoveryRequest.handle.restore()
    })

    it('should invoke the DiscoveryRequest handler', () => {
      DiscoveryRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })

  /**
   * JWKs
   */
  describe('jwks endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(JWKSetRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.jwks(req, res, provider)
    })

    after(() => {
      JWKSetRequest.handle.restore()
    })

    it('should invoke the JWKSetRequest handler', () => {
      JWKSetRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })

  /**
   * Register
   */
  describe('dynamic registration endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(DynamicRegistrationRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.register(req, res, provider)
    })

    after(() => {
      DynamicRegistrationRequest.handle.restore()
    })

    it('should invoke the DynamicRegistrationRequest handler', () => {
      DynamicRegistrationRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })

  /**
   * Token
   */
  describe('token endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(TokenRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.token(req, res, provider)
    })

    after(() => {
      TokenRequest.handle.restore()
    })

    it('should invoke the TokenRequest handler', () => {
      TokenRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })

  /**
   * UserInfo
   */
  describe('userinfo endpoint', () => {
    let req, res, provider

    before(() => {
      req = {}
      res = {}
      sinon.stub(UserInfoRequest, 'handle')
      provider = new Provider({}, {}, {})
      provider.userinfo(req, res, provider)
    })

    after(() => {
      UserInfoRequest.handle.restore()
    })

    it('should invoke the UserInfoRequest handler', () => {
      UserInfoRequest.handle.should.have.been
        .calledWith(req, res, provider)
    })
  })
})
