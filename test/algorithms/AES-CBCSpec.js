'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const crypto = require('@trust/webcrypto')
const {TextEncoder} = require('text-encoding')
const base64url = require('base64url')
const AES_CBC = require('../../src/algorithms/AES-CBC')
const AesCbcJwk = {
    kty: "oct",
    k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
    alg: "A256CBC",
    ext: true,
}

/**
 * Tests
 */
describe('AES-CBC', () => {

  let alg, ec, encryptedDataBuffer

  before(() => {
    alg = { name: 'AES-CBC', hash: { name: 'AES-CBC' } }
    ec = new AES_CBC(alg)
  })

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should set params', () => {
      ec.params.should.equal(alg)
    })
  })

  /**
   * encrypt
   */
  describe('encrypt', () => {
    let data, key

    before(() => {
      let promise = crypto.subtle.importKey(
                    "jwk",
                    AesCbcJwk,
                    {   // algorithm
                        name: 'AES-CBC',
                    },
                    false, // extractable
                    ["encrypt", "decrypt"] // usages
                  )
      data = 'encrypted with Chrome webcrypto'
      promise.then(result => { key = result })
    })

    it('should return a promise', () => {
      ec.encrypt(key, data).should.be.instanceof(Promise)
    })

    it('should perform encryption', () => {
      return ec.encrypt(key, data)
        .then(result => {
          encryptedDataBuffer = result
          result.should.not.eql(Buffer.from(data))
        })
    })
  })

  /**
   * decrypt
   */
  describe('decrypt', () => {
    let key, data

    before(() => {
      let promise = crypto.subtle.importKey(
                    "jwk",
                    AesCbcJwk,
                    {   // algorithm
                        name: 'AES-CBC',
                    },
                    false, // extractable
                    ["encrypt", "decrypt"] // usages
                  )
      data = 'encrypted with Chrome webcrypto'
      promise.then(result => { key = result })
    })

    it('should return a promise', () => {
      ec.decrypt(key, encryptedDataBuffer).should.be.instanceof(Promise)
    })

    it('should recover plaintext', () => {
      return ec.decrypt(key, encryptedDataBuffer)
      .then(result => {
        result.should.eql(Buffer.from(data))
      })
    })

  })

  /**
   * importKey
   */
  describe('importKey', () => {
    let promise, result

    before(() => {
      promise = ec.importKey(AesCbcJwk).then(jwk => result = jwk)
    })

    it('should return a promise', () => {
      promise.should.be.instanceof(Promise)
    })

    it('should resolve a JWK', () => {
      result.should.eql(AesCbcJwk)
    })

    it('should resolve a JWK with CryptoKey property', () => {
      result.cryptoKey.constructor.name.should.equal('CryptoKey')
    })
  })
})
