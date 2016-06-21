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
const TokenRequest = require(path.join(cwd, 'src', 'TokenRequest'))

/**
 * Tests
 */
describe('TokenRequest', () => {

  /**
   * Handle
   */
  describe('handle', () => {})

  /**
   * Constructor
   */
  describe('constructor', () => {
    let params, req, res, host, provider

    before(() => {
      params = { response_type: 'code' }
      req = { method: 'GET', query: params }
      res = {}
      host = {}
      provider = { host }
    })

    it('should set "params" from request query', () => {
      let req = { method: 'GET', query: params }
      let request = new TokenRequest(req, res, provider)
      request.params.should.equal(params)
    })

    it('should set "params" from request body', () => {
      let req = { method: 'GET', query: params }
      let request = new TokenRequest(req, res, provider)
      request.params.should.equal(params)
    })
  })

  /**
   * Supported Grant Type
   */
  describe('supportedGrantType', () => {
    let res, host, provider

    beforeEach(() => {
      res = {}
      host = {}
      provider = { host, supported_grant_types: ['authorization_code'] }
    })

    it('should return true with a supported response type parameter', () => {
      let params = { grant_type: 'authorization_code' }
      let req = { method: 'POST', body: params }
      let request = new TokenRequest(req, res, provider)
      request.supportedGrantType().should.equal(true)
    })

    it('should return false with an unsupported response type parameter', () => {
      let params = { grant_type: 'other' }
      let req = { method: 'POST', body: params }
      let request = new TokenRequest(req, res, provider)
      request.supportedGrantType().should.equal(false)
    })
  })

  /**
   * Validate
   */
  describe('validate', () => {
    describe('with missing grant_type parameter', () => {
      let params, req, res, host, provider, request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')
        params = {}
        req = { method: 'POST', body: params }
        res = {}
        host = {}
        provider = { host }
        request = new TokenRequest(req, res, provider)
        request.validate(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 bad request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'invalid_request',
          error_description: 'Missing grant type'
        })
      })
    })

    describe('with unsupported grant type', () => {
      let params, req, res, host, provider, request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')
        params = { grant_type: 'unsupported' }
        req = { method: 'POST', body: params }
        res = {}
        host = {}
        provider = { host, supported_grant_types: ['authorization_code'] }
        request = new TokenRequest(req, res, provider)
        request.validate(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 bad request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unsupported_grant_type',
          error_description: 'Unsupported grant type'
        })
      })
    })

    describe('with missing authorization code', () => {
      let params, req, res, host, provider, request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')
        params = { grant_type: 'authorization_code' }
        req = { method: 'POST', body: params }
        res = {}
        host = {}
        provider = { host, supported_grant_types: ['authorization_code'] }
        request = new TokenRequest(req, res, provider)
        request.validate(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 bad request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'invalid_request',
          error_description: 'Missing authorization code'
        })
      })
    })

    describe('with missing redirect uri', () => {
      let params, req, res, host, provider, request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')
        params = { grant_type: 'authorization_code', code: 'c0d3' }
        req = { method: 'POST', body: params }
        res = {}
        host = {}
        provider = { host, supported_grant_types: ['authorization_code'] }
        request = new TokenRequest(req, res, provider)
        request.validate(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 bad request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'invalid_request',
          error_description: 'Missing redirect uri'
        })
      })
    })

    describe('with missing refresh token parameter', () => {
      let params, req, res, host, provider, request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')
        params = { grant_type: 'refresh_token' }
        req = { method: 'POST', body: params }
        res = {}
        host = {}
        provider = { host }
        provider = { host, supported_grant_types: ['refresh_token'] }
        request = new TokenRequest(req, res, provider)
        request.validate(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 bad request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'invalid_request',
          error_description: 'Missing refresh token'
        })
      })
    })
  })

  describe('authenticateClient', () => {})
  describe('clientSecretBasic', () => {})
  describe('clientSecretPost', () => {})
  describe('clientSecretJWT', () => {})
  describe('privateKeyJWT', () => {})
  describe('none', () => {})
  describe('grant', () => {})
  describe('authorizationCodeGrant', () => {})
  describe('refreshGrant', () => {})
  describe('clientCredentialsGrant', () => {})
  describe('verifyAuthorizationCode', () => {})
  describe('includeAccessToken', () => {})
  describe('includeRefreshToken', () => {})
  describe('includeAuthorizationCode', () => {})
  describe('includeIDToken', () => {})
  describe('includeSessionState', () => {})
})
