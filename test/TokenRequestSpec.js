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
    let params, request

    before(() => {
      params = { grant_type: 'authorization_code' }
      let req = { method: 'POST', body: params }
      let res = {}
      let provider = { host: {} }
      request = new TokenRequest(req, res, provider)
    })

    it('should set "params" from request body', () => {
      request.params.should.equal(params)
    })

    it('should set "grantType" from params', () => {
      request.grantType.should.equal(params.grant_type)
    })
  })

  /**
   * Get Grant Type
   */
  describe('getGrantType', () => {
    it('should return the "grant_type" parameter', () => {
      TokenRequest.getGrantType({
        params: {
          grant_type: 'authorization_code'
        }
      }).should.equal('authorization_code')
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

  describe('authenticateClient', () => {
    describe('with "client_secret_basic" and "client_secret_post" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials',
          client_secret: 's3cr3t'
        }
        let req = {
          method: 'POST',
          body: params,
          headers: {
            authorization: 'Basic base64str'
          }
        }
        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Must use only one authentication method'
        })
      })
    })

    describe('with "client_secret_basic" and "client_secret_jwt" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials',
          client_assertion_type: 'type'
        }

        let req = {
          method: 'POST',
          body: params,
          headers: {
            authorization: 'Basic base64str'
          }
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Must use only one authentication method'
        })
      })
    })

    describe('with "client_secret_post" and "client_secret_jwt" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials',
          client_secret: 's3cr3t',
          client_assertion_type: 'type'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Must use only one authentication method'
        })
      })
    })

    describe('with invalid client assertion type', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials',
          client_assertion_type: 'type'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Invalid client assertion type'
        })
      })

    })

    describe('with missing client assertion', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials',
          client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Missing client assertion'
        })
      })
    })

    describe('with missing client credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let params = {
          grant_type: 'client_credentials'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Missing client credentials'
        })
      })
    })

    describe('with well formed "client_secret_basic" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'clientSecretBasic')

        let params = {
          grant_type: 'client_credentials'
        }

        let req = {
          method: 'POST',
          body: params,
          headers: {
            authorization: 'Basic base64str'
          }
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.clientSecretBasic.restore()
      })

      it('should invoke "client_secret_basic" authentication', () => {
        request.clientSecretBasic.should.have.been.calledWith(request)
      })
    })

    describe('with well formed "client_secret_post" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'clientSecretPost')

        let params = {
          grant_type: 'client_credentials',
          client_id: 'uuid',
          client_secret: 's3cr3t'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.clientSecretPost.restore()
      })

      it('should invoke "client_secret_post" authentication', () => {
        request.clientSecretPost.should.have.been.calledWith(request)
      })
    })

    describe('with well formed "client_secret_jwt" credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'clientSecretJWT')

        let params = {
          grant_type: 'client_credentials',
          client_assertion: 'jwt',
          client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
        }

        let req = {
          method: 'POST',
          body: params
        }

        let res = {}
        let host = {}
        let provider = { host, supported_grant_types: ['client_credentials'] }

        request = new TokenRequest(req, res, provider)
        request.authenticateClient(request)
      })

      after(() => {
        TokenRequest.prototype.clientSecretJWT.restore()
      })

      it('should invoke "client_secret_jwt" authentication', () => {
        request.clientSecretJWT.should.have.been.calledWith(request)
      })
    })
  })

  describe('clientSecretBasic', () => {
    describe('with malformed credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: 'Basic MALFORMED'
          }
        }

        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Malformed HTTP Basic credentials'
        })
      })
    })

    describe('with invalid authorization scheme', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: `Bearer ${new Buffer('id:secret').toString('base64')}`
          }
        }

        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Invalid authorization scheme'
        })
      })
    })

    describe('with missing credentials', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: `Basic ${new Buffer(':').toString('base64')}`
          }
        }

        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Missing client credentials'
        })
      })
    })

    describe('with unknown client', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: `Basic ${new Buffer('id:secret').toString('base64')}`
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve(null)
        }

        request = new TokenRequest(req, res, provider)
        request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should respond "401 Unauthorized"', () => {
        request.unauthorized.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Unknown client identifier'
        })
      })
    })

    describe('with mismatching secret', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: `Basic ${new Buffer('id:WRONG').toString('base64')}`
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve({ client_secret: 'secret' })
        }

        request = new TokenRequest(req, res, provider)
        request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should respond "401 Unauthorized"', () => {
        request.unauthorized.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Mismatching client secret'
        })
      })
    })

    describe('with valid credentials', () => {
      let request, promise

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {},
          headers: {
            authorization: `Basic ${new Buffer('id:secret').toString('base64')}`
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve({ client_secret: 'secret' })
        }

        request = new TokenRequest(req, res, provider)
        promise = request.clientSecretBasic(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should return a promise', () => {
        promise.should.be.instanceof(Promise)
      })

      it('should resolve request', () => {
        promise.then(result => result.should.equal(request))
      })
    })
  })

  describe('clientSecretPost', () => {
    describe('with missing client id', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let req = {
          method: 'POST',
          body: {
            client_secret: 'secret'
          }
        }

        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.clientSecretPost(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Missing client credentials'
        })
      })
    })

    describe('with missing client secret', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'badRequest')

        let req = {
          method: 'POST',
          body: {
            client_id: 'secret'
          }
        }

        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.clientSecretPost(request)
      })

      after(() => {
        TokenRequest.prototype.badRequest.restore()
      })

      it('should respond "400 Bad Request"', () => {
        request.badRequest.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Missing client credentials'
        })
      })
    })

    describe('with unknown client', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {
            client_id: 'uuid',
            client_secret: 'secret'
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve(null)
        }

        request = new TokenRequest(req, res, provider)
        request.clientSecretPost(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should respond "401 Unauthorized"', () => {
        request.unauthorized.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Unknown client identifier'
        })
      })
    })

    describe('with mismatching client secret', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {
            client_id: 'uuid',
            client_secret: 'WRONG'
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve({ client_secret: 'secret' })
        }

        request = new TokenRequest(req, res, provider)
        request.clientSecretPost(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should respond "401 Unauthorized"', () => {
        request.unauthorized.should.have.been.calledWith({
          error: 'unauthorized_client',
          error_description: 'Mismatching client secret'
        })
      })
    })

    describe('with valid credentials', () => {
      let request, promise

      before(() => {
        sinon.stub(TokenRequest.prototype, 'unauthorized')

        let req = {
          method: 'POST',
          body: {
            client_id: 'uuid',
            client_secret: 'secret'
          }
        }

        let res = {}
        let provider = {
          host: {},
          getClient: () => Promise.resolve({ client_secret: 'secret' })
        }

        request = new TokenRequest(req, res, provider)
        promise = request.clientSecretPost(request)
      })

      after(() => {
        TokenRequest.prototype.unauthorized.restore()
      })

      it('should return a promise', () => {
        promise.should.be.instanceof(Promise)
      })

      it('should resolve request', () => {
        promise.then(result => result.should.equal(request))
      })
    })
  })

  describe('clientSecretJWT', () => {})
  describe('privateKeyJWT', () => {})
  describe('none', () => {})

  /**
   * Grant
   */
  describe('grant', () => {
    describe('with "authorization_code" grant type', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'authorizationCodeGrant')

        let req = { method: 'POST', body: { grant_type: 'authorization_code' } }
        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.grant(request)
      })

      after(() => {
        TokenRequest.prototype.authorizationCodeGrant.restore()
      })

      it('should invoke authorizationCodeGrant', () => {
        request.authorizationCodeGrant.should.have.been.calledWith(request)
      })
    })

    describe('with "refresh_token" grant type', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'refreshTokenGrant')

        let req = { method: 'POST', body: { grant_type: 'refresh_token' } }
        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.grant(request)
      })

      after(() => {
        TokenRequest.prototype.refreshTokenGrant.restore()
      })

      it('should invoke refreshTokenGrant', () => {
        request.refreshTokenGrant.should.have.been.calledWith(request)
      })
    })

    describe('with "client_credentials" grant type', () => {
      let request

      before(() => {
        sinon.stub(TokenRequest.prototype, 'clientCredentialsGrant')

        let req = { method: 'POST', body: { grant_type: 'client_credentials' } }
        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
        request.grant(request)
      })

      after(() => {
        TokenRequest.prototype.clientCredentialsGrant.restore()
      })

      it('should invoke clientCredentialsGrant', () => {
        request.clientCredentialsGrant.should.have.been.calledWith(request)
      })
    })

    describe('with unknown grant type', () => {
      let request

      before(() => {
        let req = { method: 'POST', body: { grant_type: 'noyoudint' } }
        let res = {}
        let provider = { host: {} }

        request = new TokenRequest(req, res, provider)
      })

      it('should throw and error', () => {
        expect(() => {
          request.grant(request)
        }).to.throw('Unsupported response type')
      })
    })
  })

  describe('authorizationCodeGrant', () => {})
  describe('refreshGrant', () => {})
  describe('clientCredentialsGrant', () => {})
  describe('verifyAuthorizationCode', () => {})
  describe('includeAccessToken', () => {})
  describe('includeRefreshToken', () => {})
  describe('includeIDToken', () => {})
  describe('includeSessionState', () => {})
})
