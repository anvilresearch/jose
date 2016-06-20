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
const OIDCRequest = require(path.join(cwd, 'src', 'OIDCRequest'))

/**
 * Tests
 */
describe('OIDCRequest', () => {

  /**
   * Handle
   */
  describe('handle', () => {
    it('should throw an error')
  })

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

    it('should set "req"', () => {
      let request = new OIDCRequest(req, res, provider)
      request.req.should.equal(req)
    })

    it('should set "res"', () => {
      let request = new OIDCRequest(req, res, provider)
      request.res.should.equal(res)
    })

    it('should set "provider"', () => {
      let request = new OIDCRequest(req, res, provider)
      request.provider.should.equal(provider)
    })

    it('should set "host"', () => {
      let request = new OIDCRequest(req, res, provider)
      request.host.should.equal(host)
    })
  })

  /**
   * Get Params
   */
  describe('getParams', () => {
    it('should return GET request parameters', () => {
      let req = { method: 'GET', query: {} }
      let res = {}
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)
      OIDCRequest.getParams(request).should.equal(req.query)
    })

    it('should return POST request parameters', () => {
      let req = { method: 'POST', body: {} }
      let res = {}
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)
      OIDCRequest.getParams(request).should.equal(req.body)
    })
  })

  /**
   * Redirect
   */
  describe('redirect', () => {
    it('should redirect with an authorization response', () => {
      let req = {
        method: 'GET',
        query: { redirect_uri: 'https://example.com/callback' }
      }

      let res = { redirect: sinon.spy() }
      let provider = { host: {} }
      let response = { foo: 'bar' }
      let request = new OIDCRequest(req, res, provider)

      request.params = req.query
      request.responseMode = '#'
      request.redirect(response)
      res.redirect.should.have.been
        .calledWith('https://example.com/callback#foo=bar')
    })
  })

  /**
   * Unauthorized
   */
  describe('unauthorized', () => {
    let status, send, set

    beforeEach(() => {
      set = sinon.spy()
      send = sinon.spy()
      status = sinon.stub().returns({send})

      let req = { method: 'GET', query: {} }
      let res = { set, status }
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)

      request.unauthorized({
        realm: 'a',
        error: 'b',
        error_description: 'c'
      })
    })

    it('should respond 401', () => {
      status.should.have.been.calledWith(401)
    })

    it('should respond Unauthorized', () => {
      send.should.have.been.calledWith('Unauthorized')
    })

    it('should set WWW-Authenticate header', () => {
      set.should.have.been.calledWith({
        'WWW-Authenticate': 'Bearer realm=a, error=b, error_description=c'
      })
    })
  })

  /**
   * Forbidden
   */
  describe('forbidden', () => {
    let status, send

    beforeEach(() => {
      send = sinon.spy()
      status = sinon.stub().returns({send})

      let req = { method: 'GET', query: {} }
      let res = { status }
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)

      request.forbidden()
    })

    it('should respond 403', () => {
      status.should.have.been.calledWith(403)
    })

    it('should respond Forbidden', () => {
      send.should.have.been.calledWith('Forbidden')
    })
  })

  /**
   * Bad Request
   */
  describe('badRequest', () => {
    let status, json, set, err

    beforeEach(() => {
      set = sinon.spy()
      json = sinon.spy()
      status = sinon.stub().returns({json})
      err = { error: 'error_name', error_description: 'description' }

      let req = { method: 'GET', query: {} }
      let res = { set, status }
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)

      request.badRequest(err)
    })

    it('should respond 400', () => {
      status.should.have.been.calledWith(400)
    })

    it('should respond with JSON', () => {
      json.should.have.been.calledWith(err)
    })

    it('should set Cache-Control header', () => {
      set.should.have.been.calledWith(sinon.match({
        'Cache-Control': 'no-store'
      }))
    })

    it('should set Pragma header', () => {
      set.should.have.been.calledWith(sinon.match({
        'Pragma': 'no-cache'
      }))
    })
  })

  /**
   * Internal Server Error
   */
  describe('internalServerError', () => {
    let status, send

    beforeEach(() => {
      send = sinon.spy()
      status = sinon.stub().returns({send})

      let req = { method: 'GET', query: {} }
      let res = { status }
      let provider = { host: {} }
      let request = new OIDCRequest(req, res, provider)

      request.internalServerError()
    })

    it('should respond 500', () => {
      status.should.have.been.calledWith(500)
    })

    it('should respond Internal Server Error', () => {
      send.should.have.been.calledWith('Internal Server Error')
    })
  })
})
