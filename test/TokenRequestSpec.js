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
